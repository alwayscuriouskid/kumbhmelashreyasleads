import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

interface PaymentConfirmationCellProps {
  isEditing: boolean;
  value: string;
  onChange: (value: string) => void;
}

export const PaymentConfirmationCell = ({
  isEditing,
  value,
  onChange,
}: PaymentConfirmationCellProps) => {
  if (isEditing) {
    return (
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter confirmation"
      />
    );
  }
  return <span>{value || "-"}</span>;
};