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
  placeholder = ""
}: EditableCellProps) => {
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  useEffect(() => {
    if (value?.toString() !== inputValue) {
      setInputValue(value?.toString() || "");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  if (isEditing) {
    return (
      <Input
        type={type}
        value={inputValue}
        onChange={handleChange}
        className="w-full h-8 px-2"
        autoFocus
      />
    );
  }

  return (
    <div 
      onClick={onEditToggle}
      className="cursor-pointer p-2 hover:bg-accent rounded min-h-[32px] flex items-center"
    >
      {value || placeholder}
    </div>
  );
};