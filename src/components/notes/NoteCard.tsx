import { useState } from "react";
import { Note } from "@/types/notes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NoteCardActions } from "./NoteCardActions";
import EditNoteDialog from "./EditNoteDialog";
import { NoteCardContent } from "./NoteCardContent";
import { NoteHeader } from "./NoteHeader";

interface NoteCardProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: () => void;
  categories: string[];
  tags: string[];
  onAddCategory: (category: string) => void;
}

const NoteCard = ({
  note,
  onUpdate,
  onDelete,
  categories,
  tags,
  onAddCategory,
}: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState<Note>(note);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleUpdateNote = (updatedNote: Note) => {
    console.log("Updating note:", updatedNote);
    try {
      onUpdate(updatedNote);
      setEditedNote(updatedNote);
      setIsEditDialogOpen(false);
      console.log("Note update handler called successfully");
    } catch (error) {
      console.error("Error in handleUpdateNote:", error);
    }
  };

  const handleEditClick = () => {
    console.log("Edit button clicked for note:", note.id);
    setEditedNote(note); // Reset to original note data when opening dialog
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Card className="group p-4 space-y-4 bg-background border-border hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground">{note.title}</h3>
          <NoteCardActions
            onEdit={handleEditClick}
            onDelete={onDelete}
            onExpand={() => {}}
          />
        </div>
        
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {note.content}
        </p>

        {note.category && (
          <Badge variant="outline" className="mr-2">
            {note.category}
          </Badge>
        )}

        <div className="flex flex-wrap gap-2">
          {note.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>

      <EditNoteDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        note={note}
        categories={categories}
        tags={tags}
        onAddCategory={onAddCategory}
        onUpdateNote={handleUpdateNote}
      />
    </>
  );
};

export default NoteCard;