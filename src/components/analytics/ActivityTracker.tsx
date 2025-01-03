import { Activity } from "@/types/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ActivityForm } from "./ActivityForm";

interface ActivityTrackerProps {
  leadId: string;
  onActivityAdd: (activity: Activity) => void;
  contactPerson: string;
  onLeadUpdate?: (updates: any) => void;
}

const ActivityTracker = ({ leadId, onActivityAdd, contactPerson, onLeadUpdate }: ActivityTrackerProps) => {
  const { toast } = useToast();

  const updateLeadWithActivityData = async (activity: Partial<Activity>) => {
    console.log("Updating lead with activity data:", activity);
    
    try {
      // Map activity fields to lead table fields
      const leadUpdate = {
        activity_type: activity.type,
        activity_outcome: activity.outcome,
        activity_next_action: activity.nextAction,
        activity_next_action_date: activity.next_action_date,
        updated_at: new Date().toISOString()
      };

      console.log("Updating lead with mapped data:", leadUpdate);

      // First update the leads table with mapped activity data
      const { error: leadError } = await supabase
        .from('leads')
        .update(leadUpdate)
        .eq('id', leadId)
        .select();

      if (leadError) {
        console.error("Error updating lead with activity data:", leadError);
        throw leadError;
      }

      console.log("Successfully updated lead table");

      // Then store the activity in activities table
      const { error: activityError } = await supabase
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
          next_action_date: activity.next_action_date,
          location: activity.location,
          call_type: activity.callType,
          contact_person: activity.contactPerson,
          is_followup: activity.type === 'follow_up'
        })
        .select();

      if (activityError) {
        console.error("Error storing activity:", activityError);
        throw activityError;
      }

      console.log("Successfully stored activity");
      return true;
    } catch (error) {
      console.error("Failed to update lead with activity data:", error);
      throw error;
    }
  };

  const handleActivitySubmit = async (formData: Partial<Activity>) => {
    console.log("Submitting new activity:", formData);
    
    try {
      // First update the lead table and store activity
      await updateLeadWithActivityData(formData);
      
      // Create the activity object with all required fields
      const activity: Activity = {
        id: `activity-${Date.now()}`,
        date: new Date().toISOString(),
        type: formData.type || 'note',
        notes: formData.notes || '',
        outcome: formData.outcome || '',
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: formData.duration,
        assignedTo: formData.assignedTo || '',
        contactPerson: formData.contactPerson || '',
        location: formData.location,
        callType: formData.callType,
        nextAction: formData.nextAction,
        next_action_date: formData.next_action_date,
        time: new Date().toLocaleTimeString(),
        description: `Activity for ${contactPerson}`,
        teamMember: formData.assignedTo || 'Unassigned',
        activityType: formData.type,
        activityOutcome: formData.outcome,
        activityNextAction: formData.nextAction,
        activityNextActionDate: formData.next_action_date
      };
      
      console.log("Calling onActivityAdd with activity:", activity);
      onActivityAdd(activity);
      
      // Show success notification
      toast({
        title: "Activity Logged",
        description: `New ${formData.type} activity has been recorded.`,
      });

      // Trigger a lead update if callback provided
      if (onLeadUpdate) {
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
      throw error;
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