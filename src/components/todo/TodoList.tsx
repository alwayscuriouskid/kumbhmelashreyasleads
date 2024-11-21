import { Todo, Tag } from "@/types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  availableTags: Tag[];
  onAddTag: (name: string) => Tag;
}

export const TodoList = ({
  todos,
  onToggleComplete,
  onUpdateTodo,
  onDeleteTodo,
  availableTags,
  onAddTag,
}: TodoListProps) => {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
          availableTags={availableTags}
          onAddTag={onAddTag}
        />
      ))}
    </div>
  );
};