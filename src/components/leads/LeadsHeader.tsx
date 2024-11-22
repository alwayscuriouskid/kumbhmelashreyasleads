import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LeadsHeaderProps {
  onAddNew: () => void;
}

const LeadsHeader = ({ onAddNew }: LeadsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Leads Management</h1>
      <Button onClick={onAddNew} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add New Lead
      </Button>
    </div>
  );
};

export default LeadsHeader;