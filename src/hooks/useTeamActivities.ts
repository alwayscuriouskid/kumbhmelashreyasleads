import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Activity } from "@/types/leads";

export const useTeamActivities = (
  selectedTeamMember: string,
  activityType: string,
  leadSearch: string,
  selectedDate?: Date
) => {
  return useQuery({
    queryKey: ["team-activities", selectedTeamMember, activityType, leadSearch, selectedDate],
    queryFn: async () => {
      console.log("Fetching activities with filters:", { 
        selectedTeamMember, 
        activityType,
        leadSearch,
        selectedDate 
      });

      const query = supabase
        .from('lead_activities')
        .select(`
          *,
          leads (
            client_name
          ),
          team_members (
            name
          )
        `);

      if (selectedTeamMember !== "all") {
        query.eq('team_member_id', selectedTeamMember);
      }

      if (activityType !== 'all') {
        query.eq('type', activityType);
      }

      if (leadSearch) {
        query.textSearch('leads.client_name', leadSearch);
      }

      if (selectedDate) {
        query.gte('date', format(selectedDate, 'yyyy-MM-dd'))
          .lt('date', format(new Date(selectedDate.getTime() + 86400000), 'yyyy-MM-dd'));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }

      console.log("Fetched activities:", data);

      // Map the data to match our Activity type
      return (data || []).map((item: any): Activity => ({
        id: item.id,
        type: item.type,
        date: item.date,
        time: format(new Date(item.date), 'HH:mm'),
        outcome: item.outcome || '',
        notes: item.notes || '',
        nextAction: item.next_action,
        assignedTo: item.team_member_id,
        contactPerson: '',
        description: item.notes,
        teamMember: item.team_members?.name || 'Unknown',
        leadName: item.leads?.client_name || 'Unknown',
        nextFollowUp: item.next_follow_up_date,
        followUpOutcome: item.outcome,
        activityOutcome: item.outcome
      }));
    }
  });
};