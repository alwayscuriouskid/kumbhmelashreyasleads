import { useState } from "react";
import { Search, Plus, Filter, LayoutGrid, List, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoList } from "@/components/todo/TodoList";
import { useTodos } from "@/hooks/useTodos";
import { Priority } from "@/types/todo";

const Todo = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { todos, tags, addTodo, updateTodo, deleteTodo, toggleTodoComplete, addTag } = useTodos();

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      todo.tags.some(tag => selectedTags.includes(tag.id));
    
    const matchesPriority = selectedPriority === "all" ||
      todo.priority === selectedPriority;

    return matchesSearch && matchesTags && matchesPriority;
  });

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <List className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          All priorities
        </Button>
        <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag.id)}
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      <TodoList
        todos={filteredTodos}
        onToggleComplete={toggleTodoComplete}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        availableTags={tags}
        onAddTag={addTag}
      />

      <CreateTodoDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateTodo={addTodo}
        availableTags={tags}
        onAddTag={addTag}
      />
    </div>
  );
};

export default Todo;