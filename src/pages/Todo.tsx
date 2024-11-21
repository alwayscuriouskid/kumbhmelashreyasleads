import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateTodoDialog } from "@/components/todo/CreateTodoDialog";
import { TodoList } from "@/components/todo/TodoList";
import { useTodos } from "@/hooks/useTodos";
import { Priority } from "@/types/todo";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { startOfToday, startOfTomorrow, endOfTomorrow, isWithinInterval } from "date-fns";

const TodoFilters = ({ search, setSearch, selectedTags, toggleTag, selectedPriority, setSelectedPriority, deadlineFilter, setDeadlineFilter, tags }) => {
  return (
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
              <Select value={deadlineFilter} onValueChange={(value: "all" | "overdue" | "upcoming" | "none" | "today" | "tomorrow") => setDeadlineFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by deadline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
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
  );
};

const Todo = () => {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority | "all">("all");
  const [deadlineFilter, setDeadlineFilter] = useState<"all" | "overdue" | "upcoming" | "none" | "today" | "tomorrow">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { todos, tags, addTodo, updateTodo, deleteTodo, toggleTodoComplete, addTag } = useTodos();

  const filterTodos = (todoList) => {
    return todoList.filter((todo) => {
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
        const today = startOfToday();
        const tomorrow = startOfTomorrow();
        const tomorrowEnd = endOfTomorrow();
        
        switch (deadlineFilter) {
          case "overdue":
            return deadline < now;
          case "upcoming":
            const weekFromNow = new Date();
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            return deadline > now && deadline <= weekFromNow;
          case "today":
            return isWithinInterval(deadline, { start: today, end: tomorrow });
          case "tomorrow":
            return isWithinInterval(deadline, { start: tomorrow, end: tomorrowEnd });
          default:
            return true;
        }
      };

      return matchesSearch && matchesTags && matchesPriority && matchesDeadline();
    });
  };

  const activeTodos = filterTodos(todos.filter(todo => !todo.completed));
  const completedTodos = filterTodos(todos.filter(todo => todo.completed));

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
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <TodoFilters
        search={search}
        setSearch={setSearch}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        deadlineFilter={deadlineFilter}
        setDeadlineFilter={setDeadlineFilter}
        tags={tags}
      />

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <TodoList
            todos={activeTodos}
            onToggleComplete={toggleTodoComplete}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            availableTags={tags}
            onAddTag={addTag}
          />
        </TabsContent>
        <TabsContent value="completed">
          <TodoList
            todos={completedTodos}
            onToggleComplete={toggleTodoComplete}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            availableTags={tags}
            onAddTag={addTag}
          />
        </TabsContent>
      </Tabs>

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