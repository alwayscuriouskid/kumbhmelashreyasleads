import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  onChange: (value: string) => void;
  onEditToggle?: () => void;
  type?: "text" | "number";
  placeholder?: string;
}

export const EditableCell = ({
  value,
  isEditing,
  onChange,
  onEditToggle,
  type = "text",
  placeholder = "Click to edit"
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    if (inputValue !== value) {
      onChange(inputValue.toString());
    }
    onEditToggle?.();
  };

  if (isEditing) {
    return (
      <Input
        type={type}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
      {value || placeholder}
    </div>
  );
};