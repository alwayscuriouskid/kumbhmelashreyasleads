import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface EditableStatusCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const EditableStatusCell = ({ value, isEditing, onChange }: EditableStatusCellProps) => {
  if (isEditing) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge variant={value === "approved" ? "default" : "secondary"}>
      {value}
    </Badge>
  );
};