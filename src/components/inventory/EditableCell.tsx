import { Input } from "@/components/ui/input";

interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  onChange: (value: string) => void;
  onEditToggle?: () => void;
  type?: "text" | "number";
}

export const EditableCell = ({
  value,
  isEditing,
  onChange,
  onEditToggle,
  type = "text",
}: EditableCellProps) => {
  if (isEditing) {
    return (
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onEditToggle}
        className="w-full"
        autoFocus
      />
    );
  }

  return (
    <div 
      onClick={onEditToggle}
      className="cursor-pointer p-2 hover:bg-accent rounded"
    >
      {value || "Click to add update"}
    </div>
  );
};