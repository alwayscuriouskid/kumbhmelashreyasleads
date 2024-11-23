import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types/notes";
import { useToast } from "@/components/ui/use-toast";
import { NoteHeader } from "./NoteHeader";
import { NoteTags } from "./NoteTags";
import { MINIMUM_NOTE_SIZE } from "@/utils/notePositioning";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";

interface NoteCardProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
  categories: string[];
  tags: string[];
  onAddCategory: (category: string) => void;
}

const NoteCard = ({ note, onUpdate, categories, tags, onAddCategory }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState(note);
  const [newTag, setNewTag] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const { toast } = useToast();
  const nodeRef = useRef(null);
  const { deleteNote } = useNotes();

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

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

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startY = e.pageY;
    const startWidth = editedNote.width || 300;
    const startHeight = editedNote.height || 200;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(MINIMUM_NOTE_SIZE.width, startWidth + (e.pageX - startX));
      const newHeight = Math.max(MINIMUM_NOTE_SIZE.height, startHeight + (e.pageY - startY));

      setEditedNote(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setIsResizing(false);
      onUpdate(editedNote);
    };

    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDelete = async () => {
    await deleteNote(note.id);
  };

  return (
    <div 
      ref={nodeRef} 
      className="note-card-wrapper"
      style={{ 
        width: editedNote.width || 300,
        height: editedNote.height || 200,
      }}
    >
      <Card className="note-card group hover:border-primary/50 transition-colors w-full h-full overflow-hidden rounded-lg relative">
        <div className="absolute inset-x-0 top-0 h-6 bg-background/80 backdrop-blur-sm" />
        <CardHeader className="space-y-1 pt-8">
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
            {!note.deleted_at && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 140px)' }}>
          {isEditing ? (
            <Textarea
              value={editedNote.content}
              onChange={(e) =>
                setEditedNote({ ...editedNote, content: e.target.value })
              }
              className="min-h-[100px] text-sm resize-none"
              placeholder="Note Content"
            />
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {note.content}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <NoteTags
            isEditing={isEditing}
            editedNote={editedNote}
            newTag={newTag}
            setNewTag={setNewTag}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            availableTags={tags}
          />
        </CardFooter>
        {!note.deleted_at && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResize}
            style={{
              background: 'transparent',
              transform: 'translate(50%, 50%)'
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default NoteCard;