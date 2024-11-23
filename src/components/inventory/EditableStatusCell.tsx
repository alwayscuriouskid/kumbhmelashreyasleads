import { StatusSelect } from "./StatusSelect";
import { Badge } from "@/components/ui/badge";

interface EditableStatusCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const EditableStatusCell = ({ value, isEditing, onChange }: EditableStatusCellProps) => {
  if (isEditing) {
    return <StatusSelect value={value} onChange={onChange} />;
  }

  return (
    <Badge
      variant={
        value === "available"
          ? "default"
          : value === "booked"
          ? "secondary"
          : value === "maintenance"
          ? "destructive"
          : value === "reserved"
          ? "outline"
          : "default"
      }
    >
      {value}
    </Badge>
  );
};