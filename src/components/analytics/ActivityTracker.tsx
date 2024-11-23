import { useState } from "react";
import { Activity } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TeamMemberSelect } from "@/components/shared/TeamMemberSelect";
import { supabase } from "@/integrations/supabase/client";

interface ActivityTrackerProps {
  leadId: string;
  onActivityAdd: (activity: Activity) => void;
  contactPerson: string;
}

const ActivityTracker = ({ leadId, onActivityAdd, contactPerson }: ActivityTrackerProps) => {
  const { toast } = useToast();
  const [activityType, setActivityType] = useState<Activity["type"]>("call");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [location, setLocation] = useState("");
  const [callType, setCallType] = useState<"incoming" | "outgoing">("outgoing");

  const updateLeadWithActivityData = async (activity: Activity) => {
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

      // Then store the activity in a new activities table entry
      const { error: activityError } = await supabase
        .from('activities')
        .insert({
          lead_id: leadId,
          type: activityType,
          notes,
          outcome,
          start_time: startTime,
          end_time: endTime,
          assigned_to: assignedTo,
          next_action: nextAction,
          location,
          call_type: callType,
          contact_person: contactPerson
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new activity");

    const activity: Activity = {
      id: `activity-${Date.now()}`,
      type: activityType,
      date: new Date().toISOString(),
      startTime,
      endTime,
      duration: startTime && endTime ? 
        (new Date(`2000/01/01 ${endTime}`).getTime() - new Date(`2000/01/01 ${startTime}`).getTime()) / 60000 : 
        undefined,
      outcome,
      notes,
      nextAction,
      assignedTo,
      contactPerson,
      location,
      ...(activityType === "call" ? { callType } : {}),
    };

    console.log("New activity created:", activity);
    
    try {
      // First update the lead table and store activity
      await updateLeadWithActivityData(activity);
      
      // Then notify parent component
      onActivityAdd(activity);
      
      toast({
        title: "Activity Logged",
        description: `New ${activityType} activity has been recorded.`,
      });

      // Reset form
      setNotes("");
      setOutcome("");
      setStartTime("");
      setEndTime("");
      setNextAction("");
      setLocation("");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Activity Type</label>
              <Select value={activityType} onValueChange={(value: Activity["type"]) => setActivityType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activityType === "call" && (
              <div className="space-y-2">
                <label>Call Type</label>
                <Select value={callType} onValueChange={(value: "incoming" | "outgoing") => setCallType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select call type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incoming">Incoming</SelectItem>
                    <SelectItem value="outgoing">Outgoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label>Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label>End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label>Assigned To</label>
              <TeamMemberSelect
                value={assignedTo}
                onChange={setAssignedTo}
              />
            </div>

            <div className="space-y-2">
              <label>Location</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location (if applicable)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label>Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter activity notes..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label>Outcome</label>
            <Input
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Enter activity outcome"
            />
          </div>

          <div className="space-y-2">
            <label>Next Action</label>
            <Input
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="Enter next action required"
            />
          </div>

          <Button type="submit" className="w-full">
            Log Activity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;
