import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useZones, useInventoryTypes } from "@/hooks/useInventory";

interface AnalyticsFiltersProps {
  zoneFilter: string;
  typeFilter: string;
  onZoneFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export const AnalyticsFilters = ({
  zoneFilter,
  typeFilter,
  onZoneFilterChange,
  onTypeFilterChange,
}: AnalyticsFiltersProps) => {
  const { data: zones } = useZones();
  const { data: types } = useInventoryTypes();

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={zoneFilter} onValueChange={onZoneFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by zone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Zones</SelectItem>
          {zones?.map((zone) => (
            <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {types?.map((type) => (
            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};