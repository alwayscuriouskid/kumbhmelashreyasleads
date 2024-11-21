import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  availableTags,
}: NoteTagsProps) => {
  return (
    <>
      {isEditing ? (
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Select value={newTag} onValueChange={setNewTag}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add Tag" />
              </SelectTrigger>
              <SelectContent>
                {availableTags
                  .filter((tag) => !editedNote.tags?.includes(tag))
                  .map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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