import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

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
  placeholder = "Click to add update"
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  useEffect(() => {
    if (value?.toString() !== inputValue) {
      setInputValue(value?.toString() || "");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    onChange(inputValue);
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
      <span>{value || placeholder}</span>
    </div>
  );
};