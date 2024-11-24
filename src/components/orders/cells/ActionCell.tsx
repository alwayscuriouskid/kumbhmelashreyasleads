import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";

interface ActionCellProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const ActionCell = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  disabled,
}: ActionCellProps) => {
  return (
    <div className="flex justify-end gap-0.5">
      {isEditing ? (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSave}
            className="h-7 w-7 p-0"
            disabled={disabled}
          >
            <Save className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-7 w-7 p-0"
            disabled={disabled}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
          className="h-7 w-7 p-0"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};