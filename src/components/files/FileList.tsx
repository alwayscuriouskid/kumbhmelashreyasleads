import { File, FileTag, FileType, Folder } from "@/types/files";
import { Button } from "@/components/ui/button";
import { File as FileIcon, Tag, Trash2 } from "lucide-react";
import { useState } from "react";

interface FileListProps {
  folders: Folder[];
  onDeleteFolder: (id: string) => void;
  onAddFile: (folderId: string, file: Omit<File, 'id' | 'createdAt' | 'tags'>) => void;
  onDeleteFile: (folderId: string, fileId: string) => void;
  onAddTag: (name: string) => FileTag;
  onAddTagToFile: (folderId: string, fileId: string, tagId: string) => void;
  onRemoveTagFromFile: (folderId: string, fileId: string, tagId: string) => void;
  availableTags: FileTag[];
}

export const FileList = ({
  folders,
  onDeleteFile,
  onAddTag,
  onAddTagToFile,
  onRemoveTagFromFile,
  availableTags,
}: FileListProps) => {
  return (
    <div className="space-y-4">
      {folders.map((folder) => (
        <div key={folder.id} className="space-y-2">
          {folder.files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
            >
              <div className="flex items-center space-x-2">
                <FileIcon className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-1">
                  {file.tags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => onRemoveTagFromFile(folder.id, file.id, tag.id)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.name}
                    </Button>
                  ))}
                </div>
                <select
                  onChange={(e) => {
                    const tagId = e.target.value;
                    if (tagId === "new") {
                      const name = prompt("Enter new tag name");
                      if (name) {
                        const newTag = onAddTag(name);
                        onAddTagToFile(folder.id, file.id, newTag.id);
                      }
                    } else if (tagId) {
                      onAddTagToFile(folder.id, file.id, tagId);
                    }
                  }}
                  className="h-8 rounded-md border border-input bg-background px-2"
                >
                  <option value="">Add tag...</option>
                  {availableTags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                  <option value="new">+ New Tag</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteFile(folder.id, file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};