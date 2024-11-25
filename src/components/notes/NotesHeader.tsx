import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FiltersSection } from "./FiltersSection";

interface NotesHeaderProps {
  search: string;
  setSearch: (search: string) => void;
  setIsCreateOpen: (open: boolean) => void;
  categories: string[];
  tags: string[];
  selectedFilters: {
    categories: string[];
    tags: string[];
  };
  toggleFilter: (type: 'categories' | 'tags', value: string) => void;
  handleDeleteCategory: (category: string) => void;
  handleDeleteTag: (tag: string) => void;
}

export const NotesHeader = ({
  search,
  setSearch,
  setIsCreateOpen,
  categories,
  tags,
  selectedFilters,
  toggleFilter,
  handleDeleteCategory,
  handleDeleteTag,
}: NotesHeaderProps) => {
  return (
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
            <FiltersSection
              categories={categories}
              tags={tags}
              selectedFilters={selectedFilters}
              toggleFilter={toggleFilter}
              handleDeleteCategory={handleDeleteCategory}
              handleDeleteTag={handleDeleteTag}
            />
          </SheetContent>
        </Sheet>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>
    </div>
  );
};