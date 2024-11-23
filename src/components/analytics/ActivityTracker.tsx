import { Activity } from "@/types/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ActivityForm } from "./ActivityForm";

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
      // First update the leads table
      const { error: leadError } = await supabase
        .from('leads')
        .update({
          next_action: activity.nextAction,
          follow_up_outcome: activity.outcome,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (leadError) {
        console.error("Error updating lead with activity data:", leadError);
        throw leadError;
      }

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
      throw error;
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