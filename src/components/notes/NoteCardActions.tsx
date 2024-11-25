import { Button } from "@/components/ui/button";
import { Trash2, Maximize2 } from "lucide-react";

interface NoteCardActionsProps {
  onDelete: () => void;
  onExpand: () => void;
  isDeleted: boolean;
}

export const NoteCardActions = ({
  onDelete,
  onExpand,
  isDeleted,
}: NoteCardActionsProps) => {
  return (
    <div className="note-actions flex gap-1 opacity-0 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onExpand}
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      {!isDeleted && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};