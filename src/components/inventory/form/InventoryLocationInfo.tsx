import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useZones, useSectors } from "@/hooks/useInventory";
import { useState, useEffect } from "react";

interface InventoryLocationInfoProps {
  formData: {
    sector_id: string;
  };
  setFormData: (data: any) => void;
}

export const InventoryLocationInfo = ({ formData, setFormData }: InventoryLocationInfoProps) => {
  const { data: zones } = useZones();
  const { data: sectors, refetch: refetchSectors } = useSectors();
  const [selectedZone, setSelectedZone] = useState<string>("");

  // Filter sectors based on selected zone
  const filteredSectors = sectors?.filter(sector => sector.zone_id === selectedZone);

  // Refetch sectors when component mounts to ensure we have latest data
  useEffect(() => {
    refetchSectors();
  }, []);

  // Reset sector when zone changes
  useEffect(() => {
    if (selectedZone && (!formData.sector_id || !filteredSectors?.some(s => s.id === formData.sector_id))) {
      setFormData({ ...formData, sector_id: "" });
    }
  }, [selectedZone]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Zone</Label>
        <Select 
          value={selectedZone} 
          onValueChange={setSelectedZone}
        >
          <SelectTrigger className="bg-background">
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
        <Label>Sector</Label>
        <Select 
          value={formData.sector_id} 
          onValueChange={(value) => setFormData({ ...formData, sector_id: value })}
          disabled={!selectedZone}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            {filteredSectors?.map((sector) => (
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