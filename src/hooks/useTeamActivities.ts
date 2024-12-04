import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfDay, endOfDay } from "date-fns";
import { Activity } from "@/types/activity";
import { toast } from "sonner";

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

      try {
        // First check if we have an authenticated session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Authentication error");
        }

        if (!session) {
          console.error("No active session found");
          throw new Error("No authenticated session");
        }

        console.log("Fetching activities for user:", session.user.email);

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
          const start = startOfDay(selectedDate);
          const end = endOfDay(selectedDate);
          console.log('Filtering by date range:', { start, end });
          query = query.gte('created_at', start.toISOString())
                      .lte('created_at', end.toISOString());
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

        if (!data || data.length === 0) {
          console.log("No activities found");
          return [];
        }

        return data.map((item): Activity => ({
          id: item.id,
          type: item.type as Activity['type'],
          date: item.created_at,
          created_at: item.created_at,
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
          leadName: item.lead?.client_name || 'Unknown Lead',
          activityType: item.type,
          activityOutcome: item.outcome,
          activityNextAction: item.next_action,
          activityNextActionDate: item.next_action_date
        }));
      } catch (error) {
        console.error("Error in useTeamActivities:", error);
        toast.error("Failed to fetch team activities");
        throw error;
      }
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5000 // Refetch every 5 seconds
  });
};