import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePendingActions = (
  selectedTeamMember: string,
  selectedActionType: string,
  selectedDate?: Date
) => {
  return useQuery({
    queryKey: ["pending-actions", selectedTeamMember, selectedActionType, selectedDate],
    queryFn: async () => {
      console.log("Fetching pending actions with filters:", { 
        selectedTeamMember, 
        selectedActionType,
        selectedDate 
      });

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
          hidden_by,
          lead:leads (
            id,
            client_name
          )
        `)
        .not('next_action', 'is', null)
        .not('next_action', 'eq', '');

      // Filter by team member if selected
      if (selectedTeamMember !== 'all') {
        query = query.eq('assigned_to', selectedTeamMember);
      }

      // Filter by action type if selected
      if (selectedActionType !== 'all') {
        query = query.eq('type', selectedActionType);
      }

      // Filter by date if selected
      if (selectedDate) {
        const dateStr = selectedDate.toISOString().split('T')[0];
        query = query.eq('next_action_date', dateStr);
      }

      // Filter out hidden actions for current team member using proper array syntax
      const currentTeamMemberId = selectedTeamMember !== 'all' ? selectedTeamMember : undefined;
      if (currentTeamMemberId) {
        query = query.not('hidden_by', 'cs', `{${currentTeamMemberId}}`);
      }

      console.log("Executing Supabase query...");
      const { data, error } = await query;

      if (error) {
        console.error("Error fetching pending actions:", error);
        throw error;
      }

      console.log("Fetched pending actions:", data);

      return data.map(action => ({
        id: action.id,
        type: action.type,
        description: action.next_action,
        dueDate: action.next_action_date,
        clientName: action.lead?.client_name || 'Unknown Client',
        teamMember: action.assigned_to || 'Unassigned',
        teamMemberId: action.assigned_to,
        outcome: action.outcome,
        notes: action.notes,
        hidden_by: action.hidden_by || []
      }));
    },
    staleTime: 0,
    gcTime: 0,
  });
};