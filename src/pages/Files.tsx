import { useState } from "react";
import { Search, Plus, Filter, FolderPlus, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFiles } from "@/hooks/useFiles";
import { FileType } from "@/types/files";
import { CreateFolderDialog } from "@/components/files/CreateFolderDialog";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Files = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<FileType | "all">("all");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const { folders, tags, addFolder } = useFiles();
  const navigate = useNavigate();

  const filteredFolders = folders.filter((folder) => {
    const matchesSearch = folder.name.toLowerCase().includes(search.toLowerCase()) ||
      folder.files.some(file => 
        file.name.toLowerCase().includes(search.toLowerCase()) ||
        file.tags.some(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
      );
    
    const matchesType = selectedType === "all" || folder.type === selectedType;
    const matchesTags = selectedTags.length === 0 ||
      folder.files.some(file =>
        file.tags.some(tag => selectedTags.includes(tag.id))
      );

    return matchesSearch && matchesType && matchesTags;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Files</h1>
        <Button onClick={() => setIsCreateFolderOpen(true)}>
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files by name or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">File Type</h3>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as FileType | "all")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="document">Documents</option>
                  <option value="presentation">Presentations</option>
                </select>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedTags(prev =>
                          prev.includes(tag.id)
                            ? prev.filter(id => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredFolders.map((folder) => (
          <Button
            key={folder.id}
            variant="outline"
            size="lg"
            className="h-32 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate(`/files/${folder.id}`)}
          >
            <FolderPlus className="h-8 w-8" />
            <span className="font-medium">{folder.name}</span>
            <span className="text-sm text-muted-foreground">
              ({folder.files.length} files)
            </span>
          </Button>
        ))}
      </div>

      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onCreateFolder={addFolder}
      />
    </div>
  );
};

export default Files;