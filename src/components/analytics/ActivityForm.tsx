import { useState } from "react";
import { Activity } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMemberSelect } from "@/components/shared/TeamMemberSelect";
import { DatePicker } from "@/components/ui/date-picker";

interface ActivityFormProps {
  onSubmit: (formData: Partial<Activity>) => void;
  contactPerson: string;
}

export const ActivityForm = ({ onSubmit, contactPerson }: ActivityFormProps) => {
  const [activityType, setActivityType] = useState<Activity["type"]>("call");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [nextActionDate, setNextActionDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [callType, setCallType] = useState<"incoming" | "outgoing">("outgoing");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission - Collecting form data:", {
      activityType,
      notes,
      outcome,
      startTime,
      endTime,
      assignedTo,
      nextAction,
      nextActionDate,
      location,
      callType,
      contactPerson
    });

    const formData: Partial<Activity> = {
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
      next_action_date: nextActionDate?.toISOString(),
      ...(activityType === "call" ? { callType } : {}),
    };

    console.log("Submitting activity form with processed data:", formData);
    onSubmit(formData);

    // Reset form
    setNotes("");
    setOutcome("");
    setStartTime("");
    setEndTime("");
    setNextAction("");
    setNextActionDate(undefined);
    setLocation("");
    console.log("Form reset completed");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label>Activity Type</label>
          <Select 
            value={activityType} 
            onValueChange={(value: Activity["type"]) => {
              console.log("Activity type changed:", value);
              setActivityType(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="follow_up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activityType === "call" && (
          <div className="space-y-2">
            <label>Call Type</label>
            <Select 
              value={callType} 
              onValueChange={(value: "incoming" | "outgoing") => {
                console.log("Call type changed:", value);
                setCallType(value);
              }}
            >
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
            onChange={(e) => {
              console.log("Start time changed:", e.target.value);
              setStartTime(e.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <label>End Time</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => {
              console.log("End time changed:", e.target.value);
              setEndTime(e.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <label>Assigned To</label>
          <TeamMemberSelect
            value={assignedTo}
            onChange={(value) => {
              console.log("Team member assigned:", value);
              setAssignedTo(value);
            }}
          />
        </div>

        <div className="space-y-2">
          <label>Location</label>
          <Input
            value={location}
            onChange={(e) => {
              console.log("Location changed:", e.target.value);
              setLocation(e.target.value);
            }}
            placeholder="Enter location (if applicable)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label>Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => {
            console.log("Notes changed:", e.target.value);
            setNotes(e.target.value);
          }}
          placeholder="Enter activity notes..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <label>Outcome</label>
        <Input
          value={outcome}
          onChange={(e) => {
            console.log("Outcome changed:", e.target.value);
            setOutcome(e.target.value);
          }}
          placeholder="Enter activity outcome"
        />
      </div>

      <div className="space-y-2">
        <label>Next Action</label>
        <Input
          value={nextAction}
          onChange={(e) => {
            console.log("Next action changed:", e.target.value);
            setNextAction(e.target.value);
          }}
          placeholder="Enter next action required"
        />
      </div>

      <div className="space-y-2">
        <label>Next Action Date</label>
        <DatePicker
          selected={nextActionDate}
          onSelect={(date) => {
            console.log("Next action date selected:", date);
            setNextActionDate(date);
          }}
          placeholderText="Select next action date"
        />
      </div>

      <Button type="submit" className="w-full">
        Log Activity
      </Button>
    </form>
  );
};