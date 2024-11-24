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
        .from('leads')
        .select(`
          id,
          client_name,
          contact_person,
          activity_next_action_date,
          activity_next_action,
          activity_outcome,
          status,
          created_at,
          updated_at
        `);

      if (leadSearch) {
        query.ilike('client_name', `%${leadSearch}%`);
      }

      if (selectedDate) {
        query.gte('created_at', format(selectedDate, 'yyyy-MM-dd'))
          .lt('created_at', format(new Date(selectedDate.getTime() + 86400000), 'yyyy-MM-dd'));
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }

      console.log("Fetched lead activities:", data);

      // Map the lead data to match our Activity type
      return (data || []).map((item): Activity => ({
        id: item.id,
        type: 'status_change',
        date: item.created_at,
        time: format(new Date(item.created_at), 'HH:mm'),
        outcome: item.activity_outcome || '',
        notes: '',
        nextAction: item.activity_next_action || '',
        assignedTo: '',
        contactPerson: item.contact_person,
        description: `Lead activity for ${item.client_name}`,
        teamMember: 'System',
        leadName: item.client_name,
        nextFollowUp: item.activity_next_action_date,
        followUpOutcome: item.activity_outcome,
        activityOutcome: item.activity_outcome
      }));
    }
  });
};