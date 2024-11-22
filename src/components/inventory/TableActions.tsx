import { Button } from "@/components/ui/button";
import { Edit2, Save, Trash2, X } from "lucide-react";

interface TableActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export const TableActions = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: TableActionsProps) => {
  if (isEditing) {
    return (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" onClick={onSave}>
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="icon" onClick={onEdit}>
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};