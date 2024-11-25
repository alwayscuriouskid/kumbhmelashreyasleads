import { useState, useRef } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { useToast } from "@/components/ui/use-toast";
import { NoteHeader } from "./NoteHeader";
import { NoteTags } from "./NoteTags";
import { MINIMUM_NOTE_SIZE } from "@/utils/notePositioning";
import { useNotes } from "@/hooks/useNotes";
import { Badge } from "@/components/ui/badge";
import { NoteCardContent } from "./NoteCardContent";
import { NoteCardActions } from "./NoteCardActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  categories: string[];
  tags: string[];
  onAddCategory: (category: string) => void;
}

const NoteCard = ({
  note,
  onUpdate,
  categories,
  tags,
  onAddCategory,
}: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { deleteNote } = useNotes();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

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

  const handleDelete = async () => {
    await deleteNote(note.id);
    toast({
      title: "Success",
      description: "Note moved to trash",
    });
  };

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.pageX;
    const startY = e.pageY;
    const startWidth = editedNote.width || MINIMUM_NOTE_SIZE.width;
    const startHeight = editedNote.height || MINIMUM_NOTE_SIZE.height;

    const handleMouseMove = (e: MouseEvent) => {
      if (!nodeRef.current || !isResizing) return;

      const newWidth = Math.max(
        MINIMUM_NOTE_SIZE.width,
        startWidth + (e.pageX - startX)
      );
      const newHeight = Math.max(
        MINIMUM_NOTE_SIZE.height,
        startHeight + (e.pageY - startY)
      );

      setEditedNote((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }));

      // Force grid recalculation
      const grid = nodeRef.current.parentElement;
      if (grid) {
        grid.style.display = 'none';
        grid.offsetHeight; // Force reflow
        grid.style.display = 'grid';
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      onUpdate(editedNote);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div 
        ref={nodeRef} 
        style={{ 
          width: editedNote.width || 300,
          transition: isResizing ? 'none' : 'all 0.2s ease-in-out'
        }}
        className="animate-fade-in"
      >
        <Card className="note-card group hover:border-primary/50 transition-colors bg-background/90 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <NoteHeader
                isEditing={isEditing}
                editedNote={editedNote}
                setEditedNote={setEditedNote}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
                categories={categories}
                originalNote={note}
                onAddCategory={onAddCategory}
              />
              <NoteCardActions
                onDelete={handleDelete}
                onExpand={() => setIsExpanded(true)}
                isDeleted={!!note.deleted_at}
              />
            </div>
          </CardHeader>

          <CardContent>
            <NoteCardContent
              note={note}
              isEditing={isEditing}
              editedNote={editedNote}
              setEditedNote={setEditedNote}
            />
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2">
            <NoteTags
              isEditing={isEditing}
              editedNote={editedNote}
              tags={tags}
              onUpdate={(updatedNote) => setEditedNote(updatedNote)}
            />
          </CardFooter>

          {!note.deleted_at && (
            <div
              className="note-resize-handle"
              onMouseDown={handleResize}
            />
          )}
        </Card>
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{note.title}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4">
              <p className="whitespace-pre-wrap">{note.content}</p>
            </div>
            <div className="p-4 border-t">
              {note.category && (
                <Badge className="mr-2">{note.category}</Badge>
              )}
              {note.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="mr-2">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteCard;