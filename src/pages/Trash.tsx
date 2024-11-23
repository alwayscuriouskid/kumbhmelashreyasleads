import { useState, useEffect } from "react";
import { Note } from "@/types/notes";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import NoteCard from "@/components/notes/NoteCard";

const Trash = () => {
  const [trashedNotes, setTrashedNotes] = useState<Note[]>([]);
  const { categories, tags, addCategory, updateNote, restoreNote } = useNotes();

  useEffect(() => {
    loadTrashedNotes();
  }, []);

  const loadTrashedNotes = async () => {
    const { fetchTrashedNotes } = useNotes();
    const notes = await fetchTrashedNotes();
    setTrashedNotes(notes);
  };

  const handleRestore = async (noteId: string) => {
    await restoreNote(noteId);
    setTrashedNotes(prev => prev.filter(note => note.id !== noteId));
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-screen">
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4">
        <h1 className="text-2xl font-bold">Trash</h1>
      </div>

      <div className="notes-container">
        {trashedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Trash2 className="h-12 w-12 mb-2" />
            <p>No notes in trash</p>
          </div>
        ) : (
          <div className="grid-notes-layout">
            {trashedNotes.map((note) => (
              <div key={note.id} className="relative group">
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRestore(note.id)}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <NoteCard
                  note={note}
                  onUpdate={updateNote}
                  categories={categories}
                  tags={tags}
                  onAddCategory={addCategory}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trash;