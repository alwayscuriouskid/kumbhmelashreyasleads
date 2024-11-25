import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Note } from "@/types/notes";
import { useState } from "react";

interface NoteTagsProps {
  isEditing: boolean;
  editedNote: Note;
  tags: string[];
  onUpdate: (note: Note) => void;
}

export const NoteTags = ({
  isEditing,
  editedNote,
  tags,
  onUpdate,
}: NoteTagsProps) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag && !editedNote.tags?.includes(newTag)) {
      onUpdate({
        ...editedNote,
        tags: [...(editedNote.tags || []), newTag],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({
      ...editedNote,
      tags: editedNote.tags?.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <>
      {isEditing ? (
        <div className="w-full space-y-2">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add tag (press Enter)"
              className="flex-1"
              list="available-tags"
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
          <datalist id="available-tags">
            {tags.map((tag) => (
              <option key={tag} value={tag} />
            ))}
          </datalist>
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
        <div className="flex flex-wrap gap-2">
          {editedNote.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </>
  );
};