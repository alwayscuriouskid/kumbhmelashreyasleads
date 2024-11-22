import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import CustomStatusInput from "./CustomStatusInput";

interface LeadsFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  visibleColumns: Record<string, boolean>;
  toggleColumn: (column: string) => void;
  customStatuses: string[];
  onAddCustomStatus: (status: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
}

const LeadsFilters = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  visibleColumns,
  toggleColumn,
  customStatuses,
  onAddCustomStatus,
  dateFilter,
  setDateFilter,
  locationFilter,
  setLocationFilter,
}: LeadsFiltersProps) => {
  return (
    <div className="mb-6 p-4 border rounded-lg space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="space-y-2">
          <CustomStatusInput onAddStatus={onAddCustomStatus} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <DatePicker
            selected={dateFilter}
            onSelect={setDateFilter}
            placeholderText="Filter by date"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div className="flex-1">
          <Input
            placeholder="Search by client name or contact person..."
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