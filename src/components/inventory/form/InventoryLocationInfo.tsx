import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useZones, useSectors } from "@/hooks/useInventory";
import { useState, useEffect } from "react";

interface InventoryLocationInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const InventoryLocationInfo = ({ formData, setFormData }: InventoryLocationInfoProps) => {
  const { data: zones } = useZones();
  const { data: sectors } = useSectors();
  const [selectedZone, setSelectedZone] = useState("");
  const [filteredSectors, setFilteredSectors] = useState(sectors || []);

  useEffect(() => {
    if (selectedZone && sectors) {
      setFilteredSectors(sectors.filter(sector => sector.zone_id === selectedZone));
      setFormData(prev => ({ ...prev, sector_id: "" }));
    }
  }, [selectedZone, sectors, setFormData]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="zone">Zone</Label>
        <Select value={selectedZone} onValueChange={setSelectedZone}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select Zone" />
          </SelectTrigger>
          <SelectContent>
            {zones?.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sector">Sector</Label>
        <Select 
          value={formData.sector_id} 
          onValueChange={(value) => setFormData({ ...formData, sector_id: value })}
          disabled={!selectedZone}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            {filteredSectors.map((sector) => (
              <SelectItem key={sector.id} value={sector.id}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};