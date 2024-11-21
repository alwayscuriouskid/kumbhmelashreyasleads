import { File, FileTag, Folder } from "@/types/files";
import { Button } from "@/components/ui/button";
import { File as FileIcon, Tag, Trash2, Image, FileText } from "lucide-react";
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
              className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 flex items-center justify-center rounded bg-muted">
                  {file.type === 'image' ? (
                    <Image className="h-6 w-6" />
                  ) : (
                    <FileText className="h-6 w-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium truncate">{file.name}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {file.tags.map((tag) => (
                      <Button
                        key={tag.id}
                        variant="secondary"
                        size="sm"
                        onClick={() => onRemoveTagFromFile(folder.id, file.id, tag.id)}
                        className="h-6"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Button>
                    ))}
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
                      className="h-6 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      <option value="">Add tag...</option>
                      {availableTags.map((tag) => (
                        <option key={tag.id} value={tag.id}>
                          {tag.name}
                        </option>
                      ))}
                      <option value="new">+ New Tag</option>
                    </select>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteFile(folder.id, file.id)}
                  className="flex-shrink-0"
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