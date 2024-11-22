import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";

interface ActionCellProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ActionCell = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: ActionCellProps) => {
  return (
    <div className="flex justify-end space-x-2">
      {isEditing ? (
        <>
          <Button variant="ghost" size="icon" onClick={onSave}>
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};