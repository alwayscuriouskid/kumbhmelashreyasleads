import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Note } from "@/types/notes";

interface NoteTagsProps {
  isEditing: boolean;
  editedNote: Note;
  newTag: string;
  setNewTag: (tag: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  availableTags: string[];
}

export const NoteTags = ({
  isEditing,
  editedNote,
  newTag,
  setNewTag,
  handleAddTag,
  handleRemoveTag,
}: NoteTagsProps) => {
  return (
    <>
      {isEditing ? (
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddTag}
              disabled={!newTag}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {editedNote.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        editedNote.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))
      )}
    </>
  );
};