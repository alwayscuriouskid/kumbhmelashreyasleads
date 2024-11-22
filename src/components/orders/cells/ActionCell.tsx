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
    <div className="flex justify-end space-x-1">
      {isEditing ? (
        <>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSave}
            className="h-8 w-8 p-0 hover:bg-transparent"
          >
            <Save className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="h-8 w-8 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </>
      ) : (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
          className="h-8 w-8 p-0 hover:bg-transparent"
        >
          <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
        </Button>
      )}
    </div>
  );
};