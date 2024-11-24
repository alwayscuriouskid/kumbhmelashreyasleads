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

      const { data: leads, error } = await supabase
        .from('leads')
        .select(`
          id,
          client_name,
          next_action,
          next_follow_up,
          follow_up_outcome,
          team_member_id,
          team_members (
            name
          )
        `)
        .not('next_action', 'is', null);

      if (error) throw error;

      let filteredActions = leads.map(lead => ({
        id: lead.id,
        type: lead.next_action?.toLowerCase().includes('follow') ? 'follow_up' : 'action',
        description: lead.next_action,
        dueDate: lead.next_follow_up,
        clientName: lead.client_name,
        teamMember: lead.team_members?.name || 'Unassigned',
        teamMemberId: lead.team_member_id || ''
      }));

      if (selectedTeamMember !== 'all') {
        filteredActions = filteredActions.filter(action => action.teamMemberId === selectedTeamMember);
      }

      if (selectedActionType !== 'all') {
        filteredActions = filteredActions.filter(action => action.type === selectedActionType);
      }

      if (selectedDate) {
        filteredActions = filteredActions.filter(action => {
          if (!action.dueDate) return false;
          const actionDate = new Date(action.dueDate);
          return actionDate.toDateString() === selectedDate.toDateString();
        });
      }

      console.log("Filtered pending actions:", filteredActions);
      return filteredActions;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};