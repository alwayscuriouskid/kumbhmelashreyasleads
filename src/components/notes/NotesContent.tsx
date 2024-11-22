import { Button } from "@/components/ui/button";
import NoteCard from "./NoteCard";
import { Note } from "@/types/notes";
import { useEffect, useRef, useState } from "react";
import { calculateGridPosition } from "@/utils/notePositioning";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getUpdatedNotes = (notes: Note[]) => {
    return notes.map((note, index) => ({
      ...note,
      position: calculateGridPosition(index, containerWidth),
    }));
  };

  useEffect(() => {
    if (containerWidth > 0) {
      const updatedNotes = getUpdatedNotes(filteredNotes);
      updatedNotes.forEach(note => handleUpdateNote(note));
    }
  }, [containerWidth, filteredNotes.length]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[calc(100vh-12rem)] notes-container"
    >
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