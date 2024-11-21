import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  return (
    <div className="space-y-4 mb-6 p-4 rounded-lg border border-muted bg-background/50">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2 min-w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="followup">Follow Up</SelectItem>
              {customStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2 text-muted-foreground">Visible Columns:</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(visibleColumns).map(([column, isVisible]) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={isVisible}
                onCheckedChange={() => toggleColumn(column)}
              />
              <label htmlFor={column} className="text-sm text-muted-foreground capitalize whitespace-nowrap">
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