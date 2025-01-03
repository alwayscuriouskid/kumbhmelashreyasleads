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
    activityType: activity.type,
    activityOutcome: activity.outcome,
    activityNextAction: activity.next_action,
    activityNextActionDate: activity.next_action_date,
    outcome: activity.outcome,
    notes: activity.notes,
    assignedTo: activity.assigned_to,
    contactPerson: activity.contact_person
  });

  const fetchActivities = async () => {
    try {
      console.log('Checking authentication session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No authenticated session found');
        toast({
          title: "Authentication Error",
          description: "Please log in to view activities",
          variant: "destructive",
        });
        return [];
      }

      console.log('Fetching activities for user:', session.user.email);
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select(`
          *,
          lead:leads (
            id,
            client_name,
            activity_type,
            activity_outcome,
            activity_next_action,
            activity_next_action_date
          )
        `)
        .order('created_at', { ascending: false });

      if (activitiesError) {
        console.error("Error fetching activities:", activitiesError);
        throw activitiesError;
      }

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
    console.log('Setting up activity subscriptions...');
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
        async (payload) => {
          console.log('Real-time activity update received:', payload);
          await fetchActivities();
        }
      )
      .subscribe((status) => {
        console.log('Activities subscription status:', status);
      });

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
        async (payload) => {
          console.log('Real-time lead update received:', payload);
          await fetchActivities();
        }
      )
      .subscribe((status) => {
        console.log('Leads subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscriptions');
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