import { Input } from "@/components/ui/input";

interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "number";
}

export const EditableCell = ({
  value,
  isEditing,
  onChange,
  type = "text",
}: EditableCellProps) => {
  if (isEditing) {
    return (
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    );
  }

  return <span>{value}</span>;
};