import { useRef, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Note } from "@/types/notes";
import { useToast } from "@/hooks/use-toast";
import { NoteHeader } from "./NoteHeader";
import { NoteTags } from "./NoteTags";
import { MINIMUM_NOTE_SIZE } from "@/utils/notePositioning";
import { useNotes } from "@/hooks/useNotes";
import { Badge } from "@/components/ui/badge";
import { NoteCardContent } from "./NoteCardContent";
import { NoteCardActions } from "./NoteCardActions";
import EditNoteDialog from "./EditNoteDialog";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { deleteNote } = useNotes();
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    await deleteNote(note.id);
    toast({
      title: "Success",
      description: "Note moved to trash",
    });
  };

  return (
    <>
      <div 
        ref={nodeRef} 
        style={{ 
          width: note.width || 300,
        }}
        className="animate-fade-in"
      >
        <Card className="note-card group hover:border-primary/50 transition-colors bg-background/90 backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold line-clamp-1">{note.title}</h3>
                {note.category && (
                  <span className="text-xs text-muted-foreground">
                    {note.category}
                  </span>
                )}
              </div>
              <NoteCardActions
                onEdit={() => setIsEditDialogOpen(true)}
                onDelete={handleDelete}
                onExpand={() => setIsExpanded(true)}
                isDeleted={!!note.deleted_at}
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="note-content">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              {note.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </div>

      <EditNoteDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        note={note}
        categories={categories}
        tags={tags}
        onAddCategory={onAddCategory}
        onUpdateNote={onUpdate}
      />

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