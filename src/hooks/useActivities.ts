import { useState, useEffect } from "react";
import { Activity } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { setupActivitySubscription, cleanupSubscription } from "@/utils/realtimeSubscriptions";

export const useActivities = (leadId: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
    
    const channel = setupActivitySubscription((payload) => {
      if (payload.new.lead_id === leadId) {
        console.log('Real-time activity update received:', payload);
        setActivities(prev => [transformActivity(payload.new), ...prev]);
      }
    });

    return () => {
      cleanupSubscription(channel);
    };
  }, [leadId]);

  const transformActivity = (data: any): Activity => ({
    id: data.id,
    type: validateActivityType(data.type),
    date: data.created_at,
    notes: data.notes || '',
    outcome: data.outcome || '',
    startTime: data.start_time,
    endTime: data.end_time,
    assignedTo: data.assigned_to || '',
    nextAction: data.next_action || '',
    contactPerson: data.contact_person || '',
    location: data.location || '',
    callType: data.call_type as 'incoming' | 'outgoing' | undefined
  });

  const validateActivityType = (type: string): Activity['type'] => {
    const validTypes: Activity['type'][] = ['call', 'meeting', 'email', 'note', 'status_change'];
    return validTypes.includes(type as Activity['type']) 
      ? (type as Activity['type']) 
      : 'note';
  };

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched activities:", data);
      setActivities(data.map(transformActivity));
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activities,
    isLoading,
    refreshActivities: fetchActivities
  };
};