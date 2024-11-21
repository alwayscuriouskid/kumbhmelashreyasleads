import { useState } from "react";
import { Todo, Tag } from "@/types/todo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onUpdate: (todo: Todo) => void;
  onDelete: (id: string) => void;
  availableTags: Tag[];
  onAddTag: (name: string) => Tag;
}

export const TodoItem = ({
  todo,
  onToggleComplete,
  onUpdate,
  onDelete,
  availableTags,
  onAddTag,
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleSave = () => {
    onUpdate({
      ...todo,
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      todo.priority === "high" ? "border-red-500/20" :
      todo.priority === "medium" ? "border-yellow-500/20" :
      "border-green-500/20"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
          className="mt-1"
        />
        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="font-medium"
              />
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="text-sm text-muted-foreground"
              />
            </div>
          ) : (
            <>
              <h3 className={cn(
                "font-medium",
                todo.completed && "line-through text-muted-foreground"
              )}>
                {todo.title}
              </h3>
              <p className="text-sm text-muted-foreground">{todo.description}</p>
            </>
          )}
          <div className="flex flex-wrap gap-2">
            {todo.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
            <Badge variant={todo.priority === "high" ? "destructive" : "outline"}>
              {todo.priority}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditedTitle(todo.title);
                  setEditedDescription(todo.description);
                  setIsEditing(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};