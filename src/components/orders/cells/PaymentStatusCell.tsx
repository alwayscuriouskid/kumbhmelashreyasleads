import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface PaymentStatusCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const PaymentStatusCell = ({ value, isEditing, onChange }: PaymentStatusCellProps) => {
  console.log('Payment status value:', value);
  
  if (isEditing) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="partially_pending">Partially Pending</SelectItem>
          <SelectItem value="finished">Finished</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Badge variant={
      value === "finished" 
        ? "default" 
        : value === "partially_pending" 
        ? "secondary" 
        : "destructive"
    }>
      {value}
    </Badge>
  );
};