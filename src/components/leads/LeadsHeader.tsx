import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

interface LeadsHeaderProps {
  onAddNew: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const LeadsHeader = ({ onAddNew, searchQuery, setSearchQuery }: LeadsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Leads Management</h1>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border w-full"
          />
        </div>
        <Button onClick={onAddNew} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </div>
    </div>
  );
};

export default LeadsHeader;