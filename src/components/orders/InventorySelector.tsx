import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useInventoryItems } from "@/hooks/useInventory";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventorySelectorProps {
  selectedItems: string[];
  onItemSelect: (itemIds: string[]) => void;
  maxItems?: number;
}

export const InventorySelector = ({ selectedItems, onItemSelect, maxItems }: InventorySelectorProps) => {
  const { data: inventoryItems } = useInventoryItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");

  const filteredItems = inventoryItems?.filter((item) => {
    const matchesSearch = 
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inventory_types?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type_id === typeFilter;
    const matchesZone = zoneFilter === "all" || item.sectors?.zones?.id === zoneFilter;
    const isAvailable = item.status === "available";
    
    return matchesSearch && matchesType && matchesZone && isAvailable;
  });

  const handleItemSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      onItemSelect(selectedItems.filter(id => id !== itemId));
    } else {
      if (maxItems && selectedItems.length >= maxItems) {
        onItemSelect([itemId]); // Replace existing selection
      } else {
        onItemSelect([...selectedItems, itemId]);
      }
    }
  };

  // Get unique types and zones for filters
  const types = Array.from(new Set(inventoryItems?.map(item => ({
    id: item.type_id,
    name: item.inventory_types?.name
  }))));
  
  const zones = Array.from(new Set(inventoryItems?.map(item => ({
    id: item.sectors?.zones?.id,
    name: item.sectors?.zones?.name
  }))));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Search by SKU or Type</Label>
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Label>Filter by Type</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Filter by Zone</Label>
          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredItems?.map((item) => (
          <Card
            key={item.id}
            className={`p-4 cursor-pointer ${
              selectedItems.includes(item.id)
                ? "border-primary bg-primary/5"
                : ""
            }`}
            onClick={() => handleItemSelect(item.id)}
          >
            <div className="font-medium">
              {item.inventory_types?.name} - {item.sku}
            </div>
            <div className="text-sm text-muted-foreground">
              Price: ₹{item.current_price}
            </div>
            <div className="text-sm text-muted-foreground">
              Zone: {item.sectors?.zones?.name}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};