import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Note } from "@/types/notes";
import { useState } from "react";

interface NoteTagsSectionProps {
  editedNote: Note;
  tags: string[];
  onUpdateNote: (note: Note) => void;
}

export const NoteTagsSection = ({
  editedNote,
  tags,
  onUpdateNote,
}: NoteTagsSectionProps) => {
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag && !editedNote.tags?.includes(newTag)) {
      console.log("Adding tag:", newTag);
      onUpdateNote({
        ...editedNote,
        tags: [...(editedNote.tags || []), newTag],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    console.log("Removing tag:", tagToRemove);
    onUpdateNote({
      ...editedNote,
      tags: editedNote.tags?.filter(tag => tag !== tagToRemove),
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Add tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          list="available-tags"
        />
        <Button
          type="button"
          variant="outline"
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
  );
};