import { useState, useEffect } from "react";
import { FollowUp, Activity } from "@/types/leads";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FollowUpTabs from "./follow-ups/FollowUpTabs";
import FollowUpList from "./follow-ups/FollowUpList";
import { setupActivitySubscription, cleanupSubscription } from "@/utils/realtimeSubscriptions";

interface LeadFollowUpsProps {
  leadId: string;
  followUps: FollowUp[];
  onFollowUpSubmit?: (followUp: FollowUp) => void;
  onActivityAdd?: (activity: Activity) => void;
  contactPerson?: string;
  onLeadUpdate?: (updates: any) => void;
}

const LeadFollowUps = ({ 
  leadId, 
  followUps = [], 
  onFollowUpSubmit,
  onActivityAdd,
  contactPerson = "",
  onLeadUpdate
}: LeadFollowUpsProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
    
    // Set up real-time subscription
    const channel = setupActivitySubscription((payload) => {
      if (payload.new.lead_id === leadId) {
        console.log('Updating activities with new data');
        setActivities(prev => [transformActivity(payload.new), ...prev]);
      }
    });

    // Cleanup subscription on unmount
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
    const validTypes: Activity['type'][] = ['call', 'meeting', 'email', 'note', 'status_change', 'follow_up'];
    return validTypes.includes(type as Activity['type']) 
      ? (type as Activity['type']) 
      : 'note';
  };

  const fetchActivities = async () => {
    try {
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
    }
  };

  const handleFollowUpSubmit = async (followUp: FollowUp) => {
    if (onFollowUpSubmit) {
      onFollowUpSubmit(followUp);
    }
  };

  const handleActivityAdd = async (activity: Activity) => {
    if (onActivityAdd) {
      onActivityAdd(activity);
    }
    await fetchActivities(); // Refresh activities list
  };

  const handleLeadUpdate = async (updates: any) => {
    console.log("Handling lead update in LeadFollowUps:", updates);
    if (onLeadUpdate) {
      onLeadUpdate(updates);
    }
    await fetchActivities(); // Refresh activities to reflect new updates
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <FollowUpTabs
            leadId={leadId}
            onFollowUpSubmit={handleFollowUpSubmit}
            onActivityAdd={handleActivityAdd}
            contactPerson={contactPerson}
            onLeadUpdate={handleLeadUpdate}
          />
        </CardContent>
      </Card>

      <FollowUpList activities={activities} />
    </div>
  );
};

export default LeadFollowUps;