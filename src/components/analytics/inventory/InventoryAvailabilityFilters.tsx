import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useZones, useInventoryTypes, useSectors } from "@/hooks/useInventory";
import { Card } from "@/components/ui/card";

interface InventoryAvailabilityFiltersProps {
  zoneFilter: string;
  sectorFilter: string;
  typeFilter: string;
  onZoneFilterChange: (value: string) => void;
  onSectorFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export const InventoryAvailabilityFilters = ({
  zoneFilter,
  sectorFilter,
  typeFilter,
  onZoneFilterChange,
  onSectorFilterChange,
  onTypeFilterChange,
}: InventoryAvailabilityFiltersProps) => {
  const { data: zones } = useZones();
  const { data: sectors } = useSectors();
  const { data: types } = useInventoryTypes();

  const filteredSectors = sectors?.filter(
    sector => zoneFilter === "all" || sector.zone_id === zoneFilter
  );

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-4">
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={zoneFilter} onValueChange={onZoneFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            {zones?.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={sectorFilter} 
          onValueChange={onSectorFilterChange}
          disabled={zoneFilter === "all"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {filteredSectors?.map((sector) => (
              <SelectItem key={sector.id} value={sector.id}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};