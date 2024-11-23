import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const StatusSelect = ({ value, onChange, disabled }: StatusSelectProps) => {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full bg-background">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="available">Available</SelectItem>
        <SelectItem value="booked">Booked</SelectItem>
        <SelectItem value="sold">Sold</SelectItem>
        <SelectItem value="maintenance">Maintenance</SelectItem>
        <SelectItem value="reserved">Reserved</SelectItem>
      </SelectContent>
    </Select>
  );
};