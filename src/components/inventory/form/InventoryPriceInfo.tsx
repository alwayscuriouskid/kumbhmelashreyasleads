import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface InventoryPriceInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const InventoryPriceInfo = ({ formData, setFormData }: InventoryPriceInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="current_price">Current Price</Label>
        <Input
          id="current_price"
          type="number"
          value={formData.current_price}
          onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
          required
          className="bg-background"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="min_price">Minimum Price</Label>
        <Input
          id="min_price"
          type="number"
          value={formData.min_price}
          onChange={(e) => setFormData({ ...formData, min_price: e.target.value })}
          required
          className="bg-background"
        />
      </div>
    </div>
  );
};