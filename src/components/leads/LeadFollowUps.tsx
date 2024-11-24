import { useState, useEffect } from "react";
import { Activity } from "@/types/leads";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FollowUpTabs from "./follow-ups/FollowUpTabs";
import FollowUpList from "./follow-ups/FollowUpList";

interface LeadFollowUpsProps {
  leadId: string;
  onActivityAdd?: (activity: Activity) => void;
  contactPerson?: string;
  onLeadUpdate?: (updates: any) => void;
}

const LeadFollowUps = ({
  leadId,
  onActivityAdd,
  contactPerson = "",
  onLeadUpdate
}: LeadFollowUpsProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchActivities();
    
    // Set up real-time subscription for both activities and leads
    const activitiesChannel = supabase
      .channel('activities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activities',
          filter: `lead_id=eq.${leadId}`
        },
        async (payload) => {
          console.log('Real-time activity update received:', payload);
          await fetchActivities();
          await fetchAndUpdateLead();
        }
      )
      .subscribe((status) => {
        console.log('Activities subscription status:', status);
      });

    const leadsChannel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `id=eq.${leadId}`
        },
        async () => {
          console.log('Real-time lead update received');
          await fetchAndUpdateLead();
        }
      )
      .subscribe((status) => {
        console.log('Leads subscription status:', status);
      });

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(leadsChannel);
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
    callType: data.call_type as 'incoming' | 'outgoing' | undefined,
    nextFollowUp: data.next_follow_up
  });

  const validateActivityType = (type: string): Activity['type'] => {
    const validTypes: Activity['type'][] = ['call', 'meeting', 'email', 'note', 'status_change', 'follow_up'];
    return validTypes.includes(type as Activity['type']) 
      ? (type as Activity['type']) 
      : 'note';
  };

  const fetchAndUpdateLead = async () => {
    try {
      const { data: lead, error } = await supabase
        .from('leads')
        .select('activity_next_action, activity_outcome, activity_next_action_date')
        .eq('id', leadId)
        .single();

      if (error) throw error;

      if (onLeadUpdate && lead) {
        onLeadUpdate({
          activityNextAction: lead.activity_next_action,
          activityOutcome: lead.activity_outcome,
          activityNextActionDate: lead.activity_next_action_date
        });
      }
    } catch (error) {
      console.error("Error fetching updated lead data:", error);
    }
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

  const handleActivityAdd = async (activity: Activity) => {
    try {
      if (onActivityAdd) {
        onActivityAdd(activity);
      }
      await fetchActivities();
      await fetchAndUpdateLead();
    } catch (error) {
      console.error("Error handling activity add:", error);
    }
  };

  const handleLeadUpdate = async (updates: any) => {
    console.log("Handling lead update in LeadFollowUps:", updates);
    if (onLeadUpdate) {
      onLeadUpdate(updates);
    }
    await fetchActivities();
    await fetchAndUpdateLead();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <FollowUpTabs
            leadId={leadId}
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
