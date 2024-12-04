import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CallTypeSelectProps {
  value: "incoming" | "outgoing";
  onChange: (value: "incoming" | "outgoing") => void;
}

export const CallTypeSelect = ({ value, onChange }: CallTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <label>Call Type</label>
      <Select 
        value={value} 
        onValueChange={(value: "incoming" | "outgoing") => {
          console.log("Call type changed:", value);
          onChange(value);
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
  );
};