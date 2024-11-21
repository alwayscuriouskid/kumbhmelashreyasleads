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
    setZIndex(prev => prev + 1);
  };

  return (
    <Draggable
      handle=".drag-handle"
      bounds="parent"
      nodeRef={nodeRef}
      onStart={handleDragStart}
      defaultPosition={note.position || { x: 0, y: 0 }}
      onStop={(e, data) => {
        onUpdate({
          ...editedNote,
          position: { x: data.x, y: data.y }
        });
      }}
    >
      <div 
        ref={nodeRef} 
        className="absolute"
        style={{ 
          zIndex,
          width: note.width || 300,
          height: note.height || 'auto'
        }}
      >
        <Card className="group hover:border-primary/50 transition-colors w-full h-full resize overflow-auto rounded-lg">
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
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedNote.content}
                onChange={(e) =>
                  setEditedNote({ ...editedNote, content: e.target.value })
                }
                className="min-h-[100px] text-sm resize-y"
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
        </Card>
      </div>
    </Draggable>
  );
};

export default NoteCard;