import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useFiles } from "@/hooks/useFiles";
import { FileList } from "./FileList";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FolderView = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { folders, addFile, deleteFile, addTag, addTagToFile, removeTagFromFile, tags } = useFiles();

  const folder = folders.find(f => f.id === folderId);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!folder) return;
    
    acceptedFiles.forEach(file => {
      addFile(folder.id, {
        name: file.name,
        type: folder.type,
        folderId: folder.id,
        size: file.size,
      });
    });

    toast({
      title: "Files uploaded",
      description: `Successfully uploaded ${acceptedFiles.length} files`,
    });
  }, [folder, addFile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (!folder) {
    return <div>Folder not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/files')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Folders
        </Button>
        <h1 className="text-2xl font-bold">{folder.name}</h1>
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
        folders={[folder]}
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