import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit2 } from "lucide-react";
import { Note } from "@/types/notes";

interface NoteCardProps {
  note: Note;
}

const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        {note.category && (
          <span className="text-xs text-muted-foreground">{note.category}</span>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {note.tags?.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
};

export default NoteCard;