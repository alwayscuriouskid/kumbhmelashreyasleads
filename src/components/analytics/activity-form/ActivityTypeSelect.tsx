import { Activity } from "@/types/leads";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ActivityTypeSelectProps {
  value: Activity["type"];
  onChange: (value: Activity["type"]) => void;
}

export const ActivityTypeSelect = ({ value, onChange }: ActivityTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <label>Activity Type</label>
      <Select 
        value={value} 
        onValueChange={(value: Activity["type"]) => {
          console.log("Activity type changed:", value);
          onChange(value);
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
  );
};