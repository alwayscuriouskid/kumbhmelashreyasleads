import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryTypes, useZones } from "@/hooks/useInventory";
import { Card } from "@/components/ui/card";
import { InventoryColumnToggle } from "./InventoryColumnToggle";

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  zoneFilter: string;
  onZoneFilterChange: (value: string) => void;
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnKey: string) => void;
}

export const InventoryFilters = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  zoneFilter,
  onZoneFilterChange,
  visibleColumns,
  onToggleColumn,
}: InventoryFiltersProps) => {
  const { data: types } = useInventoryTypes();
  const { data: zones } = useZones();

  const columns = [
    { key: "type", label: "Type" },
    { key: "zone", label: "Zone" },
    { key: "sector", label: "Sector" },
    { key: "currentPrice", label: "Current Price" },
    { key: "minPrice", label: "Min Price" },
    { key: "ltc", label: "LTC" },
    { key: "dimensions", label: "Dimensions" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "availableQuantity", label: "Available Quantity" },
    { key: "sku", label: "SKU" },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-background">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-xs bg-background"
          />
          
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-[180px] bg-background">
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
            <SelectTrigger className="w-[180px] bg-background">
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
        </div>
      </Card>

      <InventoryColumnToggle
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
      />
    </div>
  );
};