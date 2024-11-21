import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TodoList } from "@/components/todo/TodoList";
import { useTodos } from "@/hooks/useTodos";

const CompletedTasks = () => {
  const [search, setSearch] = useState("");
  const { todos, updateTodo, deleteTodo, toggleTodoComplete, tags, addTag } = useTodos();

  const completedTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase());
    return todo.completed && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Completed Tasks</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search completed tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <TodoList
        todos={completedTodos}
        onToggleComplete={toggleTodoComplete}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        availableTags={tags}
        onAddTag={addTag}
      />
    </div>
  );
};

export default CompletedTasks;