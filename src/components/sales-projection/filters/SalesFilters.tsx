import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { InventoryType } from "../analytics/useSalesData";

export type DateRangeType = "all" | "today" | "week" | "month" | "custom";

interface SalesFiltersProps {
  dateRange: DateRangeType;
  setDateRange: (value: DateRangeType) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  selectedInventoryType: string;
  setSelectedInventoryType: (value: string) => void;
  inventoryTypes: Array<{ name: string; totalSold: number; revenue: number; availableQuantity: number; }>;
}

export const SalesFilters = ({
  dateRange,
  setDateRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedInventoryType,
  setSelectedInventoryType,
  inventoryTypes,
}: SalesFiltersProps) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Refine your sales analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={dateRange} onValueChange={(value: DateRangeType) => setDateRange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            {dateRange === "custom" && (
              <div className="flex gap-2 mt-2">
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  placeholderText="Start date"
                />
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  placeholderText="End date"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Inventory Type</label>
            <Select value={selectedInventoryType} onValueChange={setSelectedInventoryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select inventory type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {inventoryTypes.map((type) => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};