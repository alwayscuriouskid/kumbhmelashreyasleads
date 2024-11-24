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
          activity_next_action,
          activity_next_action_date,
          activity_outcome,
          team_member_id,
          team_members (
            name
          )
        `)
        .not('activity_next_action', 'is', null);

      if (error) throw error;

      let filteredActions = leads.map(lead => ({
        id: lead.id,
        type: lead.activity_next_action?.toLowerCase().includes('follow') ? 'follow_up' : 'action',
        description: lead.activity_next_action,
        dueDate: lead.activity_next_action_date,
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