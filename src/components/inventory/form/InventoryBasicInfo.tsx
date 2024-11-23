import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventoryTypes } from "@/hooks/useInventory";

interface InventoryBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const InventoryBasicInfo = ({ formData, setFormData }: InventoryBasicInfoProps) => {
  const { data: types } = useInventoryTypes();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select 
          value={formData.type_id} 
          onValueChange={(value) => setFormData({ ...formData, type_id: value })}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {types?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          required
          className="bg-background"
        />
      </div>
    </div>
  );
};