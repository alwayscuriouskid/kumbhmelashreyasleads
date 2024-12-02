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

export const InventoryManagement = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    total_quantity: "",
    landing_cost: "",
    minimum_price: "",
  });

  const queryClient = useQueryClient();

  const { data: inventoryTypes, isLoading } = useQuery({
    queryKey: ["sales-projection-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_projection_inventory")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createInventoryMutation = useMutation({
    mutationFn: async (formData: typeof formData) => {
      const { data, error } = await supabase
        .from("sales_projection_inventory")
        .insert([
          {
            name: formData.name,
            total_quantity: parseInt(formData.total_quantity),
            landing_cost: parseFloat(formData.landing_cost),
            minimum_price: parseFloat(formData.minimum_price),
          },
        ]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-projection-inventory"] });
      setOpen(false);
      setFormData({
        name: "",
        total_quantity: "",
        landing_cost: "",
        minimum_price: "",
      });
      toast({
        title: "Success",
        description: "Inventory type created successfully",
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
    createInventoryMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Inventory Types</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Inventory Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Type</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_quantity">Total Quantity</Label>
                <Input
                  id="total_quantity"
                  type="number"
                  value={formData.total_quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, total_quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landing_cost">Landing Cost</Label>
                <Input
                  id="landing_cost"
                  type="number"
                  value={formData.landing_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, landing_cost: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum_price">Minimum Price</Label>
                <Input
                  id="minimum_price"
                  type="number"
                  value={formData.minimum_price}
                  onChange={(e) =>
                    setFormData({ ...formData, minimum_price: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Landing Cost</TableHead>
              <TableHead>Minimum Price</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryTypes?.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.total_quantity}</TableCell>
                <TableCell>₹{type.landing_cost}</TableCell>
                <TableCell>₹{type.minimum_price}</TableCell>
                <TableCell>
                  {new Date(type.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};