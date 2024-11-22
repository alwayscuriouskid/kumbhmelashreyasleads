import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFiles } from "@/hooks/useFiles";
import { FileList } from "./FileList";
import { ArrowLeft, Upload, Search, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { folders, addFile, deleteFile, addTag, addTagToFile, removeTagFromFile, tags } = useFiles();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const folder = folders.find(f => f.id === folderId);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!folder) return;
    
    for (const file of acceptedFiles) {
      try {
        console.log('Uploading file:', file.name);
        
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const filePath = `${folder.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Add file metadata to database
        await addFile(folder.id, {
          name: file.name,
          type: folder.type,
          folderId: folder.id,
          size: file.size,
        });

        console.log('File uploaded successfully:', filePath);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    toast({
      title: "Files uploaded",
      description: `Successfully uploaded ${acceptedFiles.length} files`,
    });
  }, [folder, addFile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (!folder) {
    return <div>Folder not found</div>;
  }

  const filteredFiles = folder.files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
      file.tags.some(tag => selectedTags.includes(tag.id));
    return matchesSearch && matchesTags;
  });

  const updatedFolder = { ...folder, files: filteredFiles };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/files')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Folders
        </Button>
        <h1 className="text-2xl font-bold">{folder.name}</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
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
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files here, or click to select files"
        }
        </p>
      </div>

      <FileList
        folders={[updatedFolder]}
        onDeleteFolder={() => {}}
        onAddFile={addFile}
        onDeleteFile={deleteFile}
        onAddTag={addTag}
        onAddTagToFile={addTagToFile}
        onRemoveTagFromFile={removeTagFromFile}
        availableTags={tags}
      />
    </div>
  );
};

export default FolderView;