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
    <div className="flex justify-between items-center mb-6 w-full">
      <h1 className="text-2xl font-bold text-white">Leads Management</h1>
      <div className="flex gap-4">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-muted"
          />
        </div>
        <Button onClick={onAddNew} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
      </div>
    </div>
  );
};

export default LeadsHeader;