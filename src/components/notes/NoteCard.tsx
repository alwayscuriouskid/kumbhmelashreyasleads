import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical, Edit2, Check, X, Plus } from "lucide-react";
import { Note } from "@/types/notes";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface NoteCardProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  categories: string[];
  tags: string[];
}

const NoteCard = ({ note, onUpdate, categories, tags }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [newTag, setNewTag]I'll help implement inline note editing, tag/category management, and resizable notes while preserving all other functionality.

<lov-code>
Let's modify the necessary files to add these features:

1. First, let's update the NoteCard component to make it editable and resizable:

<lov-write file_path="src/components/notes/NoteCard.tsx">
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical, Edit2, Check, X, Plus } from "lucide-react";
import { Note } from "@/types/notes";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface NoteCardProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  categories: string[];
  tags: string[];
}

const NoteCard = ({ note, onUpdate, categories, tags }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!editedNote.title.trim() || !editedNote.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onUpdate(editedNote);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Note updated successfully",
    });
  };

  const handleAddTag = () => {
    if (newTag && !editedNote.tags?.includes(newTag)) {
      setEditedNote({
        ...editedNote,
        tags: [...(editedNote.tags || []), newTag],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedNote({
      ...editedNote,
      tags: editedNote.tags?.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <ResizablePanel defaultSize={100} minSize={30} maxSize={200}>
      <Card className="group hover:border-primary/50 transition-colors h-full">
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between">
            {isEditing ? (
              <Input
                value={editedNote.title}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, title: e.target.value })
                }
                className="text-base font-semibold"
                placeholder="Note Title"
              />
            ) : (
              <CardTitle className="text-base line-clamp-1">
                {note.title}
              </CardTitle>
            )}
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleSave}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedNote(note);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {isEditing && (
            <Select
              value={editedNote.category}
              onValueChange={(value) =>
                setEditedNote({ ...editedNote, category: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!isEditing && editedNote.category && (
            <span className="text-xs text-muted-foreground">
              {editedNote.category}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editedNote.content}
              onChange={(e) =>
                setEditedNote({ ...editedNote, content: e.target.value })
              }
              className="min-h-[100px] text-sm"
              placeholder="Note Content"
            />
          ) : (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {note.content}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {isEditing ? (
            <div className="w-full space-y-2">
              <div className="flex gap-2">
                <Select value={newTag} onValueChange={setNewTag}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {tags
                      .filter((tag) => !editedNote.tags?.includes(tag))
                      .map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddTag}
                  disabled={!newTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editedNote.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            editedNote.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))
          )}
        </CardFooter>
      </Card>
    </ResizablePanel>
  );
};

export default NoteCard;