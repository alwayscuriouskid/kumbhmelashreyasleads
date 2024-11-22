import { Button } from "@/components/ui/button";
import NoteCard from "./NoteCard";
import { Note } from "@/types/notes";

interface NotesContentProps {
  filteredNotes: Note[];
  handleUpdateNote: (note: Note) => void;
  categories: string[];
  tags: string[];
  onAddCategory: (category: string) => void;
  setIsCreateOpen: (open: boolean) => void;
}

export const NotesContent = ({
  filteredNotes,
  handleUpdateNote,
  categories,
  tags,
  onAddCategory,
  setIsCreateOpen,
}: NotesContentProps) => {
  return (
    <div className="relative min-h-[calc(100vh-12rem)] notes-container">
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
        <div className="relative w-full h-full">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
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