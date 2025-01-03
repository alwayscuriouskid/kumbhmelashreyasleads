import { Activity } from "@/types/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ActivityForm } from "../analytics/ActivityForm";

interface ActivityTrackerProps {
  leadId: string;
  onActivityAdd: (activity: Activity) => void;
  contactPerson: string;
}

const ActivityTracker = ({ leadId, onActivityAdd, contactPerson }: ActivityTrackerProps) => {
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

      // Update the leads table with mapped activity data
      const { error: leadError } = await supabase
        .from('leads')
        .update(leadUpdate)
        .eq('id', leadId);

      if (leadError) {
        console.error("Error updating lead with activity data:", leadError);
        throw leadError;
      }

      // Store the activity in activities table
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
          contact_person: activity.contactPerson
        });

      if (activityError) {
        console.error("Error storing activity:", activityError);
        throw activityError;
      }

      console.log("Successfully updated lead and stored activity");
    } catch (error) {
      console.error("Failed to update lead with activity data:", error);
      toast({
        title: "Error",
        description: "Failed to update lead information",
        variant: "destructive",
      });
    }
  };

  const handleActivitySubmit = async (formData: Partial<Activity>) => {
    console.log("Submitting new activity");
    
    try {
      // First update the lead table and store activity
      await updateLeadWithActivityData(formData);
      
      // Then notify parent component
      const activity: Activity = {
        id: `activity-${Date.now()}`,
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