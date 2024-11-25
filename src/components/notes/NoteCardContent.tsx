import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types/notes";

interface NoteCardContentProps {
  note: Note;
  isEditing: boolean;
  editedNote: Note;
  setEditedNote: (note: Note) => void;
}

export const NoteCardContent = ({
  note,
  isEditing,
  editedNote,
  setEditedNote,
}: NoteCardContentProps) => {
  return (
    <div className="note-content px-4">
      {isEditing ? (
        <Textarea
          value={editedNote.content}
          onChange={(e) =>
            setEditedNote({ ...editedNote, content: e.target.value })
          }
          className="min-h-[100px] text-sm resize-none"
          placeholder="Note Content"
        />
      ) : (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {note.content}
        </p>
      )}
    </div>
  );
};