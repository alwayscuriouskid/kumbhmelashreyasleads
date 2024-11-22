import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadsFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  visibleColumns: Record<string, boolean>;
  toggleColumn: (column: string) => void;
  customStatuses: string[];
}

const LeadsFilters = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  visibleColumns,
  toggleColumn,
  customStatuses,
}: LeadsFiltersProps) => {
  const defaultStatuses = ["suspect", "prospect", "analysis", "negotiation", "conclusion", "ongoing_order"];
  const allStatuses = [...defaultStatuses, ...customStatuses];

  const formatStatusLabel = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="mb-6 p-4 border rounded-lg space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2 w-full">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {allStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Input
            placeholder="Search by client name, location, or contact person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Visible Columns:</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(visibleColumns).map(([column, isVisible]) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={isVisible}
                onCheckedChange={() => toggleColumn(column)}
              />
              <label htmlFor={column} className="text-sm capitalize">
                {column.replace(/([A-Z])/g, " $1").trim()}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadsFilters;