import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TEAM_LOCATIONS = ["Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore"];

interface EditSaleDialogProps {
  sale: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditSaleDialog = ({ sale, onClose, onSuccess }: EditSaleDialogProps) => {
  const [formData, setFormData] = useState({
    quantity_sold: "",
    selling_price: "",
    team_location: "",
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        quantity_sold: sale.quantity_sold.toString(),
        selling_price: sale.selling_price.toString(),
        team_location: sale.team_location,
      });
    }
  }, [sale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("sales_projection_entries")
        .update({
          quantity_sold: parseInt(formData.quantity_sold),
          selling_price: parseFloat(formData.selling_price),
          team_location: formData.team_location,
        })
        .eq('id', sale.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sale entry updated successfully",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!sale) return null;

  return (
    <Dialog open={!!sale} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Sale Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Inventory Type</Label>
            <Input
              value={sale.sales_projection_inventory.name}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity_sold">Quantity Sold</Label>
            <Input
              id="quantity_sold"
              type="number"
              value={formData.quantity_sold}
              onChange={(e) =>
                setFormData({ ...formData, quantity_sold: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="selling_price">Selling Price</Label>
            <Input
              id="selling_price"
              type="number"
              value={formData.selling_price}
              onChange={(e) =>
                setFormData({ ...formData, selling_price: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team_location">Team Location</Label>
            <Select
              value={formData.team_location}
              onValueChange={(value) =>
                setFormData({ ...formData, team_location: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team location" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_LOCATIONS.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Update Sale
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};