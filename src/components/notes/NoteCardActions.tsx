import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Maximize2 } from "lucide-react";

interface NoteCardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onExpand: () => void;
  isDeleted?: boolean;
}

export const NoteCardActions = ({ onEdit, onDelete, onExpand, isDeleted }: NoteCardActionsProps) => {
  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {!isDeleted && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onExpand}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
};