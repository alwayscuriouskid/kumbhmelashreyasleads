import { useState, useEffect } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/notes";
import { DEFAULT_NOTE_SIZE } from "@/utils/notePositioning";
import { NotesHeader } from "@/components/notes/NotesHeader";
import { NotesContent } from "@/components/notes/NotesContent";
import CreateNoteDialog from "@/components/notes/CreateNoteDialog";
import { useToast } from "@/components/ui/use-toast";

const Notes = () => {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    tags: string[];
  }>({
    categories: [],
    tags: [],
  });

  const { 
    notes, 
    categories, 
    tags, 
    addCategory, 
    setCategories, 
    setTags,
    createNote,
    updateNote,
    deleteNote,
    fetchNotes 
  } = useNotes();

  const { toast } = useToast();

  useEffect(() => {
    console.log("Fetching notes...");
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategories = 
      selectedFilters.categories.length === 0 ||
      (note.category && selectedFilters.categories.includes(note.category));
    
    const matchesTags = 
      selectedFilters.tags.length === 0 ||
      note.tags?.some(tag => selectedFilters.tags.includes(tag));

    return matchesSearch && matchesCategories && matchesTags;
  });

  const handleCreateNote = async (noteData: Omit<Note, "id" | "created_at">) => {
    try {
      console.log("Creating new note:", noteData);
      const newNote = await createNote({
        ...noteData,
        ...DEFAULT_NOTE_SIZE,
      });
      
      console.log("Note created successfully:", newNote);
      setIsCreateOpen(false);
      toast({
        title: "Success",
        description: "Note created successfully",
      });
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    try {
      console.log("Updating note:", updatedNote);
      await updateNote(updatedNote);
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      console.log("Deleting note:", noteId);
      await deleteNote(noteId);
      toast({
        title: "Success",
        description: "Note moved to trash",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter(category => category !== categoryToDelete));
    setSelectedFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToDelete)
    }));
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
    setSelectedFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  const toggleFilter = (type: 'categories' | 'tags', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      addCategory(category);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-screen">
      <NotesHeader
        search={search}
        setSearch={setSearch}
        setIsCreateOpen={setIsCreateOpen}
        categories={categories}
        tags={tags}
        selectedFilters={selectedFilters}
        toggleFilter={toggleFilter}
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
        onDeleteNote={handleDeleteNote}
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