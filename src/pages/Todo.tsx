import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoList } from "@/components/todo/TodoList";
import { useTodos } from "@/hooks/useTodos";
import { Priority } from "@/types/todo";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Todo = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "overdue" | "upcoming" | "none">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { todos, tags, addTodo, updateTodo, deleteTodo, toggleTodoComplete, addTag } = useTodos();

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      todo.tags.some(tag => selectedTags.includes(tag.id));
    
    const matchesPriority = selectedPriority === "all" ||
      todo.priority === selectedPriority;

    const matchesDeadline = () => {
      if (deadlineFilter === "all") return true;
      if (deadlineFilter === "none") return !todo.deadline;
      if (!todo.deadline) return false;

      const deadline = new Date(todo.deadline);
      const now = new Date();
      
      if (deadlineFilter === "overdue") {
        return deadline < now;
      }
      
      if (deadlineFilter === "upcoming") {
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return deadline > now && deadline <= weekFromNow;
      }
      
      return true;
    };

    return !todo.completed && matchesSearch && matchesTags && matchesPriority && matchesDeadline();
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
          <Button
            variant="outline"
            onClick={() => navigate("/completed-tasks")}
          >
            View Completed
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Priority</h3>
                <Select value={selectedPriority} onValueChange={(value: Priority | "all") => setSelectedPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Deadline</h3>
                <Select 
                  value={deadlineFilter} 
                  onValueChange={(value: "all" | "overdue" | "upcoming" | "none") => setDeadlineFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="upcoming">Next 7 days</SelectItem>
                    <SelectItem value="none">No deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
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
              </div>
            </div>
          </SheetContent>
        </Sheet>
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