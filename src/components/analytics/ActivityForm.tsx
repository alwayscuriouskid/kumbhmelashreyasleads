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

    onSubmit(formData);

    // Reset form
    setNotes("");
    setOutcome("");
    setStartTime("");
    setEndTime("");
    setNextAction("");
    setNextActionDate(undefined);
    setLocation("");
  };

  return (
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
              <SelectItem value="follow_up">Follow-up</SelectItem>
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

      <div className="space-y-2">
        <label>Next Action Date</label>
        <DatePicker
          selected={nextActionDate}
          onSelect={setNextActionDate}
          placeholderText="Select next action date"
        />
      </div>

      <Button type="submit" className="w-full">
        Log Activity
      </Button>
    </form>
  );
};