import { useState } from "react";
import { FileType } from "@/types/files";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFolder: (name: string, type: FileType) => void;
}

export const CreateFolderDialog = ({
  open,
  onOpenChange,
  onCreateFolder,
}: CreateFolderDialogProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<FileType>("document");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateFolder(name.trim(), type);
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Folder Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Folder Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as FileType)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="presentation">Presentations</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit">Create Folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};