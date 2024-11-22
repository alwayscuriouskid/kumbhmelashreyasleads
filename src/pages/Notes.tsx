import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NoteCard from "@/components/notes/NoteCard";
import CreateNoteDialog from "@/components/notes/CreateNoteDialog";
import { useNotes } from "@/hooks/useNotes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiltersSection } from "@/components/notes/FiltersSection";
import { Note } from "@/types/notes";
import { calculateNextPosition, DEFAULT_NOTE_SIZE } from "@/utils/notePositioning";
import { NotesHeader } from "@/components/notes/NotesHeader";
import { NotesContent } from "@/components/notes/NotesContent";

const Notes = () => {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { notes, setNotes, categories, tags, addCategory, setCategories, setTags } = useNotes();

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  const handleCreateNote = (noteData: Omit<Note, "id" | "createdAt">) => {
    const position = calculateNextPosition(notes);
    
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      position,
      ...DEFAULT_NOTE_SIZE,
    };
    
    setNotes(prevNotes => [...prevNotes, newNote]);
    console.log("New note created:", newNote);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
    console.log("Note updated:", updatedNote);
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      addCategory(category);
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter(category => category !== categoryToDelete));
    setNotes(notes.map(note => ({
      ...note,
      category: note.category === categoryToDelete ? undefined : note.category
    })));
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
    setNotes(notes.map(note => ({
      ...note,
      tags: note.tags?.filter(tag => tag !== tagToDelete)
    })));
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-screen">
      <NotesHeader
        search={search}
        setSearch={setSearch}
        setIsCreateOpen={setIsCreateOpen}
        categories={categories}
        tags={tags}
        handleDeleteCategory={handleDeleteCategory}
        handleDeleteTag={handleDeleteTag}
      />

      <NotesContent
        filteredNotes={filteredNotes}
        handleUpdateNote={handleUpdateNote}
        categories={categories}
        tags={tags}
        onAddCategory={handleAddCategory}
        setIsCreateOpen={setIsCreateOpen}
      />

      <CreateNoteDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        categories={categories}
        tags={tags}
        onAddCategory={handleAddCategory}
        onCreateNote={handleCreateNote}
      />
    </div>
  );
};

export default Notes;