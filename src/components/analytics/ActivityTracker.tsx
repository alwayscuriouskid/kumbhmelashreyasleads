import { Activity } from "@/types/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ActivityForm } from "./ActivityForm";
import { useEffect } from "react";

interface ActivityTrackerProps {
  leadId: string;
  onActivityAdd: (activity: Activity) => void;
  contactPerson: string;
  onLeadUpdate?: (updates: any) => void;
}

const ActivityTracker = ({ leadId, onActivityAdd, contactPerson, onLeadUpdate }: ActivityTrackerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("Setting up real-time subscriptions for lead:", leadId);
    
    const channel = supabase
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
          console.log("Real-time activity update received:", payload);
          if (payload.new) {
            await updateLeadWithLatestData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leadId]);

  const updateLeadWithLatestData = async () => {
    try {
      console.log("Fetching latest lead data for ID:", leadId);
      const { data: lead, error } = await supabase
        .from('leads')
        .select('activity_type, activity_outcome, activity_next_action, activity_next_action_date')
        .eq('id', leadId)
        .single();

      if (error) {
        console.error("Error fetching lead data:", error);
        return;
      }

      console.log("Fetched latest lead data:", lead);

      if (onLeadUpdate && lead) {
        onLeadUpdate({
          activityType: lead.activity_type,
          activityOutcome: lead.activity_outcome,
          activityNextAction: lead.activity_next_action,
          activityNextActionDate: lead.activity_next_action_date
        });
      }
    } catch (error) {
      console.error("Failed to update lead with latest data:", error);
    }
  };

  const updateLeadWithActivityData = async (activity: Partial<Activity>) => {
    console.log("Updating lead with activity data:", activity);
    
    try {
      // First update the leads table with activity data
      const leadUpdates = {
        activity_type: activity.type,
        activity_outcome: activity.outcome,
        activity_next_action: activity.nextAction,
        activity_next_action_date: activity.next_action_date,
        updated_at: new Date().toISOString()
      };

      console.log("Updating lead with:", leadUpdates);

      const { error: leadError } = await supabase
        .from('leads')
        .update(leadUpdates)
        .eq('id', leadId);

      if (leadError) {
        console.error("Error updating lead:", leadError);
        throw leadError;
      }

      // Then store the activity
      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .insert({
          lead_id: leadId,
          type: activity.type,
          notes: activity.notes,
          outcome: activity.outcome,
          start_time: activity.startTime,
          end_time: activity.endTime,
          assigned_to: activity.assignedTo,
          next_action: activity.nextAction,
          location: activity.location,
          call_type: activity.callType,
          contact_person: activity.contactPerson,
          next_action_date: activity.next_action_date
        })
        .select()
        .single();

      if (activityError) {
        console.error("Error creating activity:", activityError);
        throw activityError;
      }

      await updateLeadWithLatestData();
      
      return activityData;
    } catch (error) {
      console.error("Failed to update lead with activity data:", error);
      throw error;
    }
  };

  const handleActivitySubmit = async (formData: Partial<Activity>) => {
    console.log("Submitting new activity:", formData);
    
    try {
      const activityData = await updateLeadWithActivityData(formData);
      
      if (!activityData) {
        throw new Error("No activity data returned");
      }

      const activity: Activity = {
        id: activityData.id,
        date: new Date().toISOString(),
        ...formData as Activity
      };
      
      onActivityAdd(activity);
      
      toast({
        title: "Activity Logged",
        description: `New ${formData.type} activity has been recorded.`,
      });
    } catch (error) {
      console.error("Error submitting activity:", error);
      toast({
        title: "Error",
        description: "Failed to submit activity. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Log Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityForm 
          onSubmit={handleActivitySubmit}
          contactPerson={contactPerson}
        />
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;