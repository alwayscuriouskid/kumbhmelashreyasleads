import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useInventoryTypes, useSectors } from "@/hooks/useInventory";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CreateInventoryDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { data: types } = useInventoryTypes();
  const { data: sectors } = useSectors();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type_id: "",
    sector_id: "",
    current_price: "",
    min_price: "",
    ltc: "",
    dimensions: "",
    status: "available"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert([{
          ...formData,
          current_price: Number(formData.current_price),
          min_price: Number(formData.min_price),
          ltc: Number(formData.ltc)
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Inventory Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              className="w-full border rounded p-2"
              value={formData.type_id}
              onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
              required
            >
              <option value="">Select Type</option>
              {types?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <select
              id="sector"
              className="w-full border rounded p-2"
              value={formData.sector_id}
              onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })}
              required
            >
              <option value="">Select Sector</option>
              {sectors?.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.zones?.name} / {sector.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_price">Current Price</Label>
            <Input
              id="current_price"
              type="number"
              value={formData.current_price}
              onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
              required
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ltc">LTC</Label>
            <Input
              id="ltc"
              type="number"
              value={formData.ltc}
              onChange={(e) => setFormData({ ...formData, ltc: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="w-full border rounded p-2"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Create Item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};