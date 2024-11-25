import { Button } from "@/components/ui/button";
import NoteCard from "./NoteCard";
import { Note } from "@/types/notes";
import "@/styles/notes.css";

interface NotesContentProps {
  filteredNotes: Note[];
  handleUpdateNote: (note: Note) => void;
  categories: string[];
  tags: string[];
  onAddCategory: (category: string) => void;
  setIsCreateOpen: (open: boolean) => void;
  onDeleteNote?: (noteId: string) => void;
}

export const NotesContent = ({
  filteredNotes,
  handleUpdateNote,
  categories,
  tags,
  onAddCategory,
  setIsCreateOpen,
  onDeleteNote,
}: NotesContentProps) => {
  return (
    <div className="w-full">
      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p>No notes found</p>
          <Button
            variant="link"
            onClick={() => setIsCreateOpen(true)}
            className="mt-2"
          >
            Create your first note
          </Button>
        </div>
      ) : (
        <div className="notes-grid animate-fade-in">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={() => onDeleteNote?.(note.id)}
              categories={categories}
              tags={tags}
              onAddCategory={onAddCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};