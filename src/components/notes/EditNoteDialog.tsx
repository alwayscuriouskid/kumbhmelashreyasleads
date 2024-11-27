import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Note } from "@/types/notes";
import { NoteCategorySection } from "./NoteCategorySection";
import { NoteTagsSection } from "./NoteTagsSection";

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
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      console.log("EditNoteDialog opened with note:", note);
      setEditedNote({ ...note });
    }
  }, [note, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting edited note:", editedNote);
    
    if (!editedNote.title.trim() || !editedNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedNote = {
        ...editedNote,
        title: editedNote.title.trim(),
        content: editedNote.content.trim(),
        updated_at: new Date().toISOString(),
      };
      
      await onUpdateNote(updatedNote);
      console.log("Note update successful");
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    } catch (error) {
      console.error("Error updating note in dialog:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
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
                onChange={(e) =>
                  setEditedNote({ ...editedNote, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Note Content"
                value={editedNote.content}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, content: e.target.value })
                }
                className="min-h-[200px]"
              />
            </div>
            
            <NoteCategorySection
              editedNote={editedNote}
              categories={categories}
              onAddCategory={onAddCategory}
              onUpdateNote={setEditedNote}
            />
            
            <NoteTagsSection
              editedNote={editedNote}
              tags={tags}
              onUpdateNote={setEditedNote}
            />
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