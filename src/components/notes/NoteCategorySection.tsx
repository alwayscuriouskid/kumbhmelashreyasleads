import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Note } from "@/types/notes";
import { useState } from "react";

interface NoteCategorySectionProps {
  editedNote: Note;
  categories: string[];
  onAddCategory: (category: string) => void;
  onUpdateNote: (note: Note) => void;
}

export const NoteCategorySection = ({
  editedNote,
  categories,
  onAddCategory,
  onUpdateNote,
}: NoteCategorySectionProps) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onAddCategory(newCategory);
      onUpdateNote({ ...editedNote, category: newCategory });
      setNewCategory("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Add category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          list="categories"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCategory}
          disabled={!newCategory}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={editedNote.category === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onUpdateNote({ ...editedNote, category })}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};