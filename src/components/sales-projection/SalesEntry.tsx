import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

const TEAM_LOCATIONS = ["Mumbai", "Delhi", "Chennai", "Kolkata", "Bangalore"];

export const SalesEntry = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    inventory_id: "",
    quantity_sold: "",
    selling_price: "",
    team_location: "",
  });

  const queryClient = useQueryClient();

  const { data: inventoryTypes } = useQuery({
    queryKey: ["sales-projection-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_projection_inventory")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: salesEntries } = useQuery({
    queryKey: ["sales-projection-entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_projection_entries")
        .select(`
          *,
          sales_projection_inventory (
            name,
            landing_cost,
            minimum_price
          )
        `)
        .order("sale_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createSalesMutation = useMutation({
    mutationFn: async (formData: typeof formData) => {
      const { data, error } = await supabase
        .from("sales_projection_entries")
        .insert([
          {
            inventory_id: formData.inventory_id,
            quantity_sold: parseInt(formData.quantity_sold),
            selling_price: parseFloat(formData.selling_price),
            team_location: formData.team_location,
          },
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-projection-entries"] });
      setOpen(false);
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

  const calculateProfitLoss = (
    sellingPrice: number,
    quantity: number,
    landingCost: number,
    minPrice: number
  ) => {
    const totalSelling = sellingPrice * quantity;
    const totalLanding = landingCost * quantity;
    const totalMin = minPrice * quantity;

    const vsLanding = ((totalSelling - totalLanding) / totalLanding) * 100;
    const vsMin = ((totalSelling - totalMin) / totalMin) * 100;

    return {
      vsLanding: vsLanding.toFixed(2),
      vsMin: vsMin.toFixed(2),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Sales Entries</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Sale
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Inventory Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Selling Price</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>P/L vs Landing</TableHead>
              <TableHead>P/L vs Min</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesEntries?.map((entry) => {
              const profitLoss = calculateProfitLoss(
                entry.selling_price,
                entry.quantity_sold,
                entry.sales_projection_inventory.landing_cost,
                entry.sales_projection_inventory.minimum_price
              );

              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.sale_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{entry.sales_projection_inventory.name}</TableCell>
                  <TableCell>{entry.quantity_sold}</TableCell>
                  <TableCell>₹{entry.selling_price}</TableCell>
                  <TableCell>{entry.team_location}</TableCell>
                  <TableCell
                    className={
                      parseFloat(profitLoss.vsLanding) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {profitLoss.vsLanding}%
                  </TableCell>
                  <TableCell
                    className={
                      parseFloat(profitLoss.vsMin) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {profitLoss.vsMin}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};