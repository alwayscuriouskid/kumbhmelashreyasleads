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
      console.log("Fetching latest activity data for lead:", leadId);
      const { data: latestActivity, error: activityError } = await supabase
        .from('activities')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (activityError) {
        console.error("Error fetching latest activity:", activityError);
        return;
      }

      if (!latestActivity) {
        console.log("No activities found for lead");
        return;
      }

      console.log("Latest activity data:", latestActivity);

      // Update lead with latest activity data
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          activity_type: latestActivity.type,
          activity_outcome: latestActivity.outcome,
          activity_next_action: latestActivity.next_action,
          activity_next_action_date: latestActivity.next_action_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (updateError) {
        console.error("Error updating lead:", updateError);
        throw updateError;
      }

      if (onLeadUpdate) {
        onLeadUpdate({
          activityType: latestActivity.type,
          activityOutcome: latestActivity.outcome,
          activityNextAction: latestActivity.next_action,
          activityNextActionDate: latestActivity.next_action_date
        });
      }

      console.log("Lead updated successfully with latest activity data");
    } catch (error) {
      console.error("Failed to update lead with latest data:", error);
      // Don't show error toast here as it's handled in handleActivitySubmit
    }
  };

  const handleActivitySubmit = async (formData: Partial<Activity>) => {
    console.log("Submitting new activity:", formData);
    
    try {
      // First store the activity
      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .insert({
          lead_id: leadId,
          type: formData.type,
          notes: formData.notes,
          outcome: formData.outcome,
          start_time: formData.startTime,
          end_time: formData.endTime,
          assigned_to: formData.assignedTo,
          next_action: formData.nextAction,
          next_action_date: formData.next_action_date,
          location: formData.location,
          call_type: formData.callType,
          contact_person: formData.contactPerson
        })
        .select()
        .single();

      if (activityError) {
        console.error("Error creating activity:", activityError);
        throw activityError;
      }

      // Immediately update the lead with the latest activity data
      const { error: leadError } = await supabase
        .from('leads')
        .update({
          activity_type: formData.type,
          activity_outcome: formData.outcome,
          activity_next_action: formData.nextAction,
          activity_next_action_date: formData.next_action_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadError) {
        console.error("Error updating lead:", leadError);
        // Don't throw here, as activity was created successfully
        toast({
          title: "Partial Success",
          description: "Activity created but lead update failed. Please refresh.",
          variant: "default",
        });
      } else {
        toast({
          title: "Activity Logged",
          description: `New ${formData.type} activity has been recorded.`,
        });
      }

      if (!activityData) {
        throw new Error("No activity data returned");
      }

      const activity: Activity = {
        id: activityData.id,
        date: new Date().toISOString(),
        ...formData as Activity
      };
      
      onActivityAdd(activity);

      // Trigger a lead update
      if (onLeadUpdate && !leadError) {
        onLeadUpdate({
          activityType: formData.type,
          activityOutcome: formData.outcome,
          activityNextAction: formData.nextAction,
          activityNextActionDate: formData.next_action_date
        });
      }
    } catch (error) {
      console.error("Error submitting activity:", error);
      toast({
        title: "Error",
        description: "Failed to submit activity. Please try again.",
        variant: "destructive",
      });
      return; // Exit early on error
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