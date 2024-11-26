import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePendingActions = (
  selectedTeamMember: string,
  selectedActionType: string,
  selectedDate?: Date
) => {
  return useQuery({
    queryKey: ['pending-actions', selectedTeamMember, selectedActionType, selectedDate],
    queryFn: async () => {
      console.log("Fetching pending actions with filters:", {
        teamMember: selectedTeamMember,
        actionType: selectedActionType,
        date: selectedDate
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
          lead:leads (
            id,
            client_name
          )
        `)
        .not('next_action', 'is', null)
        .not('next_action', 'eq', '')
        .eq('is_completed', false);  // Explicitly filter out completed actions

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

      return data.map(action => ({
        id: action.id,
        type: action.type,
        description: action.next_action,
        dueDate: action.next_action_date,
        clientName: action.lead?.client_name || 'Unknown Client',
        teamMember: action.assigned_to || 'Unassigned',
        teamMemberId: action.assigned_to || '',
        outcome: action.outcome,
        notes: action.notes
      }));
    },
  });
};