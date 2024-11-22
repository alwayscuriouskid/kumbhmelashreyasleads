import { useState, useRef } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/types/notes";
import { useToast } from "@/components/ui/use-toast";
import { NoteHeader } from "./NoteHeader";
import { NoteTags } from "./NoteTags";
import Draggable from "react-draggable";

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
  const [zIndex, setZIndex] = useState(1);
  const { toast } = useToast();
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleDragStart = () => {
    setIsDragging(true);
    setZIndex(prev => prev + 1);
  };

  const handleDragStop = (e: any, data: any) => {
    setIsDragging(false);
    if (Math.abs(data.x - (note.position?.x || 0)) > 5 || Math.abs(data.y - (note.position?.y || 0)) > 5) {
      onUpdate({
        ...editedNote,
        position: { x: data.x, y: data.y }
      });
    }
  };

  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.pageX;
    const startY = e.pageY;
    const startWidth = editedNote.width || 300;
    const startHeight = editedNote.height || 200;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(300, startWidth + (e.pageX - startX));
      const newHeight = Math.max(200, startHeight + (e.pageY - startY));

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

  return (
    <Draggable
      handle=".drag-handle"
      bounds="parent"
      nodeRef={nodeRef}
      onStart={handleDragStart}
      onStop={handleDragStop}
      defaultPosition={note.position || { x: 0, y: 0 }}
      position={isDragging ? undefined : note.position}
    >
      <div 
        ref={nodeRef} 
        className="absolute"
        style={{ 
          zIndex,
          width: editedNote.width || 300,
          height: editedNote.height || 200,
          transition: isDragging ? 'none' : 'all 0.2s ease-out'
        }}
      >
        <Card className="group hover:border-primary/50 transition-colors w-full h-full overflow-hidden rounded-lg relative">
          <div className="absolute inset-x-0 top-0 h-6 bg-background/80 backdrop-blur-sm cursor-move drag-handle" />
          <CardHeader className="space-y-1 pt-8">
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
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResize}
            style={{
              background: 'transparent',
              transform: 'translate(50%, 50%)'
            }}
          />
        </Card>
      </div>
    </Draggable>
  );
};

export default NoteCard;