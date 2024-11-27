import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Activity } from "@/types/leads";

export const useTeamActivities = (
  selectedTeamMember: string,
  activityType: string,
  leadSearch: string,
  selectedDate?: Date,
  nextActionDateFilter?: Date
) => {
  return useQuery({
    queryKey: ["team-activities", selectedTeamMember, activityType, leadSearch, selectedDate, nextActionDateFilter],
    queryFn: async () => {
      console.log("Fetching activities with filters:", { 
        selectedTeamMember, 
        activityType,
        leadSearch,
        selectedDate,
        nextActionDateFilter 
      });

      let query = supabase
        .from('activities')
        .select(`
          *,
          lead:leads (
            id,
            client_name
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedTeamMember !== 'all') {
        query = query.eq('assigned_to', selectedTeamMember);
      }

      if (activityType !== 'all') {
        query = query.eq('type', activityType);
      }

      if (selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        query = query.gte('created_at', `${dateStr}T00:00:00`)
                    .lt('created_at', `${dateStr}T23:59:59`);
      }

      if (nextActionDateFilter) {
        const dateStr = format(nextActionDateFilter, 'yyyy-MM-dd');
        query = query.eq('next_action_date', dateStr);
      }

      if (leadSearch) {
        query = query.textSearch('lead.client_name', leadSearch);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }

      console.log("Fetched activities:", data);

      return data.map((item): Activity => ({
        id: item.id,
        type: item.type as Activity['type'],
        date: item.created_at,
        time: format(new Date(item.created_at), 'HH:mm'),
        notes: item.notes || '',
        outcome: item.outcome || '',
        startTime: item.start_time,
        endTime: item.end_time,
        assignedTo: item.assigned_to || '',
        nextAction: item.next_action || '',
        next_action_date: item.next_action_date,
        contactPerson: item.contact_person || '',
        description: `Lead activity for ${item.lead?.client_name}`,
        teamMember: item.assigned_to || 'System',
        leadName: item.lead?.client_name,
        activityType: item.type,
        activityOutcome: item.outcome,
        activityNextAction: item.next_action,
        activityNextActionDate: item.next_action_date,
        update: item.update
      }));
    },
    staleTime: 0,
    refetchOnWindowFocus: true
  });
};