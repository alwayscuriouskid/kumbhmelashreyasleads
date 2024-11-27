import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";

interface LeadsHeaderProps {
  onAddNew: () => void;
  onImport: () => void;
}

const LeadsHeader = ({ onAddNew, onImport }: LeadsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Leads Management</h1>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button onClick={onAddNew} className="flex-1 sm:flex-none">
          <Plus className="h-4 w-4 mr-2" />
          Add New Lead
        </Button>
        <Button variant="outline" onClick={onImport} className="flex-1 sm:flex-none">
          <Upload className="h-4 w-4 mr-2" />
          Import Leads
        </Button>
      </div>
    </div>
  );
};

export default LeadsHeader;