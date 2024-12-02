import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const TEAM_LOCATIONS = ["Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore"];

interface SalesFormData {
  inventory_id: string;
  quantity_sold: string;
  selling_price: string;
  team_location: string;
}

export interface SalesEntryFormProps {
  inventoryTypes: any[];
  onClose: () => void;
  onSuccess: () => void;
}

export const SalesEntryForm = ({ inventoryTypes, onClose, onSuccess }: SalesEntryFormProps) => {
  const [formData, setFormData] = useState<SalesFormData>({
    inventory_id: "",
    quantity_sold: "",
    selling_price: "",
    team_location: "",
  });

  const queryClient = useQueryClient();

  const createSalesMutation = useMutation({
    mutationFn: async (data: SalesFormData) => {
      const { data: result, error } = await supabase
        .from("sales_projection_entries")
        .insert([
          {
            inventory_id: data.inventory_id,
            quantity_sold: parseInt(data.quantity_sold),
            selling_price: parseFloat(data.selling_price),
            team_location: data.team_location,
          },
        ]);

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-projection-entries"] });
      onClose();
      onSuccess();
      setFormData({
        inventory_id: "",
        quantity_sold: "",
        selling_price: "",
        team_location: "",
      });
      toast({
        title: "Success",
        description: "Sales entry recorded successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSalesMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inventory_id">Inventory Type</Label>
        <Select
          value={formData.inventory_id}
          onValueChange={(value) =>
            setFormData({ ...formData, inventory_id: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select inventory type" />
          </SelectTrigger>
          <SelectContent>
            {inventoryTypes?.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        Record Sale
      </Button>
    </form>
  );
};