import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Priority, Tag } from "@/types/todo";
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

interface TodoFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
  selectedPriority: Priority | "all";
  setSelectedPriority: (value: Priority | "all") => void;
  deadlineFilter: "all" | "overdue" | "upcoming" | "none" | "today" | "tomorrow";
  setDeadlineFilter: (value: "all" | "overdue" | "upcoming" | "none" | "today" | "tomorrow") => void;
  tags: Tag[];
}

const TodoFilters = ({
  search,
  setSearch,
  selectedTags,
  toggleTag,
  selectedPriority,
  setSelectedPriority,
  deadlineFilter,
  setDeadlineFilter,
  tags,
}: TodoFiltersProps) => {
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

export default TodoFilters;