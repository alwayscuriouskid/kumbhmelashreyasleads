import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

interface NextPaymentDateCellProps {
  isEditing: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
}

export const NextPaymentDateCell = ({
  isEditing,
  value,
  onChange,
}: NextPaymentDateCellProps) => {
  if (isEditing) {
    return (
      <DatePicker
        selected={value ? new Date(value) : undefined}
        onSelect={(date) => onChange(date?.toISOString() || null)}
        placeholderText="Select date"
      />
    );
  }
  return <span>{value ? format(new Date(value), "PPP") : "-"}</span>;
};