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
        value={value ? new Date(value) : undefined}
        onChange={(date) => onChange(date?.toISOString() || null)}
        className="w-[160px]"
      />
    );
  }
  return <span>{value ? format(new Date(value), "PPP") : "-"}</span>;
};