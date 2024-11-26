import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrderStatusCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export const OrderStatusCell = ({ value, isEditing, onChange }: OrderStatusCellProps) => {
  console.log('OrderStatusCell render:', { value, isEditing });
  
  const handleStatusChange = (newValue: string) => {
    console.log('Updating status to:', newValue);
    onChange(newValue);
  };
  
  if (isEditing) {
    return (
      <Select value={value} onValueChange={handleStatusChange}>
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
    <Badge variant={
      value === "approved" 
        ? "default" 
        : value === "rejected" 
        ? "destructive" 
        : "secondary"
    }>
      {value}
    </Badge>
  );
};