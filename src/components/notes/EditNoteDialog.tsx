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
import { NoteTagsSection } from "./NoteTagsSection";
import { NoteCategorySection } from "./NoteCategorySection";

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
    console.log("Note received for editing:", note);
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

    console.log("Submitting edited note:", editedNote);
    onUpdateNote(editedNote);
    onOpenChange(false);
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