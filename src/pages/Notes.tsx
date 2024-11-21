import { useState } from "react";
import { Search, Plus, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NoteCard from "@/components/notes/NoteCard";
import CreateNoteDialog from "@/components/notes/CreateNoteDialog";
import { useNotes } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/types/notes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

const Notes = () => {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    tags: string[];
  }>({ categories: [], tags: [] });
  
  const { notes, setNotes, categories, tags, addCategory, setCategories, setTags } = useNotes();
  const { toast } = useToast();

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

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      addCategory(category);
      toast({
        title: "Success",
        description: `Category "${category}" has been added`,
      });
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(categories.filter(category => category !== categoryToDelete));
    setNotes(notes.map(note => ({
      ...note,
      category: note.category === categoryToDelete ? undefined : note.category
    })));
    toast({
      title: "Success",
      description: `Category "${categoryToDelete}" has been deleted`,
    });
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
    setNotes(notes.map(note => ({
      ...note,
      tags: note.tags?.filter(tag => tag !== tagToDelete)
    })));
    toast({
      title: "Success",
      description: `Tag "${tagToDelete}" has been deleted`,
    });
  };

  const toggleFilter = (type: 'categories' | 'tags', value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in min-h-screen">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4">
        <h1 className="text-2xl font-bold">Notes</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
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
              <div className="py-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters.categories.includes(category)}
                            onChange={() => toggleFilter('categories', category)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag} className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters.tags.includes(tag)}
                            onChange={() => toggleFilter('tags', tag)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{tag}</span>
                        </label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleDeleteTag(tag)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      <div className="relative min-h-[calc(100vh-12rem)]">
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
      />
    </div>
  );
};

export default Notes;