import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Note } from "@/types/notes";
import { useState, useEffect } from "react";

interface EditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  categories: string[];
  tags: string[];
  onAddCategory: (category: string) => void;
  onUpdateNote: (note: Note) => void;
}

const EditNoteDialog = ({
  open,
  onOpenChange,
  note,
  categories,
  tags,
  onAddCategory,
  onUpdateNote,
}: EditNoteDialogProps) => {
  const [editedNote, setEditedNote] = useState<Note>(note);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editedNote.title.trim() || !editedNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onUpdateNote(editedNote);
    toast({
      title: "Success",
      description: "Note updated successfully",
    });
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag && !editedNote.tags?.includes(newTag)) {
      setEditedNote({
        ...editedNote,
        tags: [...(editedNote.tags || []), newTag],
      });
      setNewTag("");
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      onAddCategory(newCategory);
      setEditedNote({ ...editedNote, category: newCategory });
      setNewCategory("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedNote({
      ...editedNote,
      tags: editedNote.tags?.filter(tag => tag !== tagToRemove),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Note Title"
                value={editedNote.title}
                onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Note Content"
                value={editedNote.content}
                onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                className="min-h-[200px]"
              />
            </div>
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
                      onClick={() => setEditedNote({ ...editedNote, category })}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;