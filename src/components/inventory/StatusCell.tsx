import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusCellProps {
  status: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const StatusCell = ({ status, isEditing, onChange }: StatusCellProps) => {
  if (isEditing) {
    return (
      <Select value={status} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="booked">Booked</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge
      variant={
        status === "available"
          ? "default"
          : status === "booked"
          ? "secondary"
          : "destructive"
      }
    >
      {status}
    </Badge>
  );
};