import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";

export const usePendingActions = (
  selectedTeamMember: string,
  selectedActionType: string,
  selectedDate?: Date
) => {
  const { data: teamMembers = [] } = useTeamMemberOptions();
  const currentTeamMemberId = teamMembers[0]?.id;

  return useQuery({
    queryKey: ['pending-actions', selectedTeamMember, selectedActionType, selectedDate, currentTeamMemberId],
    queryFn: async () => {
      console.log("Fetching pending actions with filters:", {
        teamMember: selectedTeamMember,
        actionType: selectedActionType,
        date: selectedDate,
        currentTeamMemberId
      });

      if (!currentTeamMemberId) {
        console.log("No team member ID available");
        return [];
      }

      let query = supabase
        .from('activities')
        .select(`
          id,
          type,
          notes,
          outcome,
          next_action,
          next_action_date,
          assigned_to,
          contact_person,
          is_completed,
          hidden_by,
          lead:leads (
            id,
            client_name
          )
        `)
        .not('next_action', 'is', null)
        .not('next_action', 'eq', '')
        .eq('is_completed', false);

      // Explicitly filter out activities where current team member is in hidden_by array
      query = query.not('hidden_by', '@>', `["${currentTeamMemberId}"]`);

      if (selectedTeamMember !== 'all') {
        query = query.eq('assigned_to', selectedTeamMember);
      }

      if (selectedActionType !== 'all') {
        query = query.eq('type', selectedActionType);
      }

      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        query = query.eq('next_action_date', dateStr);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching pending actions:", error);
        throw error;
      }

      console.log("Fetched pending actions:", data);

      // Additional client-side filtering to ensure hidden actions are removed
      const filteredData = data.filter(action => {
        const hiddenBy = action.hidden_by || [];
        return !hiddenBy.includes(currentTeamMemberId) && !action.is_completed;
      });

      return filteredData.map(action => ({
        id: action.id,
        type: action.type,
        description: action.next_action,
        dueDate: action.next_action_date,
        clientName: action.lead?.client_name || 'Unknown Client',
        teamMember: action.assigned_to || 'Unassigned',
        teamMemberId: action.assigned_to || '',
        outcome: action.outcome,
        notes: action.notes,
        is_completed: action.is_completed,
        hidden_by: action.hidden_by || []
      }));
    },
    staleTime: 0,
    gcTime: 0,
  });
};