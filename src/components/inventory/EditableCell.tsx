import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  onChange: (value: string) => void;
  onEditToggle?: () => void;
  type?: "text" | "number";
  placeholder?: string;
  isDone?: boolean;
  onMarkDone?: () => void;
}

export const EditableCell = ({
  value,
  isEditing,
  onChange,
  onEditToggle,
  type = "text",
  placeholder = "Click to add update",
  isDone,
  onMarkDone
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
      <div className="flex gap-2 items-center">
        <Input
          type={type}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full"
          autoFocus
        />
        {onMarkDone && (
          <Button 
            size="sm" 
            variant={isDone ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onMarkDone();
            }}
            className={isDone ? "bg-green-500 hover:bg-green-600" : ""}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={onEditToggle}
      className={`cursor-pointer p-2 rounded flex items-center justify-between gap-2 ${
        isDone ? "text-green-500" : "hover:bg-accent"
      }`}
    >
      <span>{value || placeholder}</span>
      {value && onMarkDone && (
        <Button
          size="sm"
          variant={isDone ? "default" : "outline"}
          onClick={(e) => {
            e.stopPropagation();
            onMarkDone();
          }}
          className={isDone ? "bg-green-500 hover:bg-green-600" : ""}
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};