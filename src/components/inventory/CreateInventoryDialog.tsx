import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { InventoryBasicInfo } from "./form/InventoryBasicInfo";
import { InventoryLocationInfo } from "./form/InventoryLocationInfo";
import { InventoryPriceInfo } from "./form/InventoryPriceInfo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CreateInventoryDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type_id: "",
    sector_id: "",
    current_price: "",
    min_price: "",
    ltc: "",
    dimensions: "",
    quantity: "1",
    sku: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type_id || !formData.sector_id) {
      toast({
        title: "Error",
        description: "Type and Sector are required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Submitting inventory item:', formData);
      
      const { error } = await supabase
        .from('inventory_items')
        .insert({
          type_id: formData.type_id,
          sector_id: formData.sector_id,
          current_price: Number(formData.current_price),
          min_price: Number(formData.min_price),
          ltc: formData.ltc ? Number(formData.ltc) : null,
          dimensions: formData.dimensions || null,
          quantity: Number(formData.quantity),
          available_quantity: Number(formData.quantity),
          status: 'available',
          sku: formData.sku || null,
          reserved_quantity: 0,
          sold_quantity: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating inventory item:', error);
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
        <Button className="bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InventoryBasicInfo formData={formData} setFormData={setFormData} />
          <InventoryLocationInfo formData={formData} setFormData={setFormData} />
          <InventoryPriceInfo formData={formData} setFormData={setFormData} />
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <Button type="submit" className="w-full">
            Create Item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};