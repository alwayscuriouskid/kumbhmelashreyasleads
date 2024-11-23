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
      // First store the activity in activities table
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
          contact_person: activity.contactPerson
        })
        .select()
        .single();

      if (activityError) {
        console.error("Error storing activity:", activityError);
        throw activityError;
      }

      // Prepare lead updates based on activity type
      const leadUpdates = {
        next_action: activity.nextAction,
        follow_up_outcome: activity.outcome,
        next_follow_up: activity.type === 'follow_up' ? activity.nextFollowUp : null,
        updated_at: new Date().toISOString()
      };

      console.log("Updating lead with:", leadUpdates);

      // Update the leads table
      const { error: leadError } = await supabase
        .from('leads')
        .update(leadUpdates)
        .eq('id', leadId);

      if (leadError) {
        console.error("Error updating lead with activity data:", leadError);
        throw leadError;
      }

      // Fetch the updated lead data to ensure we have the latest state
      const { data: updatedLead, error: fetchError } = await supabase
        .from('leads')
        .select('next_action, follow_up_outcome, next_follow_up')
        .eq('id', leadId)
        .single();

      if (fetchError) {
        console.error("Error fetching updated lead:", fetchError);
        throw fetchError;
      }

      console.log("Successfully updated lead:", updatedLead);

      // Notify parent component about lead updates with the fresh data
      if (onLeadUpdate) {
        onLeadUpdate({
          nextAction: updatedLead.next_action,
          followUpOutcome: updatedLead.follow_up_outcome,
          nextFollowUp: updatedLead.next_follow_up
        });
      }
      
      return activityData;
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
    console.log("Submitting new activity:", formData);
    
    try {
      const activityData = await updateLeadWithActivityData(formData);
      
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