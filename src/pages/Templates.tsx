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

const Templates = () => {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { notes, setNotes, categories, tags, addCategory, setCategories, setTags } = useNotes();
  
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const handleAddCategory = (category) => {
    if (!categories.includes(category)) {
      addCategory(category);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    setCategories(categories.filter(category => category !== categoryToDelete));
    setNotes(notes.map(note => ({
      ...note,
      category: note.category === categoryToDelete ? undefined : note.category
    })));
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
    setNotes(notes.map(note => ({
      ...note,
      tags: note.tags?.filter(tag => tag !== tagToDelete)
    })));
  };

  const handleCreateNote = (noteData: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    setNotes(prevNotes => [...prevNotes, newNote]);
    console.log("New template created:", newNote);
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-screen">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4">
        <h1 className="text-2xl font-bold">Letter Templates</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FiltersSection
                categories={categories}
                tags={tags}
                selectedFilters={{ categories: [], tags: [] }}
                toggleFilter={() => {}}
                handleDeleteCategory={handleDeleteCategory}
                handleDeleteTag={handleDeleteTag}
              />
            </SheetContent>
          </Sheet>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      <div className="relative min-h-[calc(100vh-12rem)] notes-container">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No templates found</p>
            <Button
              variant="link"
              onClick={() => setIsCreateOpen(true)}
              className="mt-2"
            >
              Create your first template
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
                onAddCategory={handleAddCategory}
              />
            ))}
          </div>
        )}
      </div>

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

export default Templates;