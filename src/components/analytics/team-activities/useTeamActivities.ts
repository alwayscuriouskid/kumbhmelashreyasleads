import { useState, useEffect } from "react";
import { Activity } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTeamActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  const validateActivityType = (type: string): Activity['type'] => {
    const validTypes: Activity['type'][] = ['call', 'meeting', 'email', 'note', 'status_change', 'follow_up'];
    return validTypes.includes(type as Activity['type']) 
      ? (type as Activity['type']) 
      : 'note';
  };

  const transformActivity = (activity: any): Activity => ({
    id: activity.id,
    date: activity.created_at,
    time: new Date(activity.created_at).toLocaleTimeString(),
    type: validateActivityType(activity.type),
    description: activity.notes,
    teamMember: activity.assigned_to,
    leadName: activity.lead?.client_name || 'Unknown Lead',
    nextFollowUp: activity.lead?.next_follow_up,
    followUpOutcome: activity.lead?.follow_up_outcome,
    nextAction: activity.lead?.next_action,
    activityOutcome: activity.outcome,
    outcome: activity.outcome,
    notes: activity.notes,
    assignedTo: activity.assigned_to,
    contactPerson: activity.contact_person
  });

  const fetchActivities = async () => {
    try {
      console.log('Fetching activities...');
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select(`
          *,
          lead:leads (
            id,
            client_name,
            next_follow_up,
            follow_up_outcome,
            next_action
          )
        `)
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      console.log('Fetched activities:', activitiesData);
      const transformedActivities = activitiesData.map(transformActivity);
      setActivities(transformedActivities);
      return transformedActivities;
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive",
      });
      return [];
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Subscribe to real-time updates for activities
    const activitiesChannel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities'
        },
        async () => {
          console.log('Real-time activity update received');
          await fetchActivities();
        }
      )
      .subscribe();

    // Subscribe to real-time updates for leads
    const leadsChannel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads'
        },
        async () => {
          console.log('Real-time lead update received');
          await fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(leadsChannel);
    };
  }, []);

  return {
    activities,
    filteredActivities,
    setFilteredActivities,
    fetchActivities
  };
};