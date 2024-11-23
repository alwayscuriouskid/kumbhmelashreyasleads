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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateTypeDialogProps {
  onSuccess: () => void;
  children?: React.ReactNode;
}

export const CreateTypeDialog = ({ onSuccess, children }: CreateTypeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit_type: "",
    base_dimensions: "",
    base_ltc: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('inventory_types')
        .insert([{
          ...formData,
          base_ltc: formData.base_ltc ? Number(formData.base_ltc) : null,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inventory type created successfully",
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
        {children || (
          <Button variant="outline" className="bg-background text-foreground">
            <Plus className="mr-2 h-4 w-4" />
            Add Type
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Add New Inventory Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_type">Unit Type</Label>
            <Input
              id="unit_type"
              value={formData.unit_type}
              onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_dimensions">Base Dimensions</Label>
            <Input
              id="base_dimensions"
              value={formData.base_dimensions}
              onChange={(e) => setFormData({ ...formData, base_dimensions: e.target.value })}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_ltc">Base LTC</Label>
            <Input
              id="base_ltc"
              type="number"
              value={formData.base_ltc}
              onChange={(e) => setFormData({ ...formData, base_ltc: e.target.value })}
              className="bg-background"
            />
          </div>

          <Button type="submit" className="w-full">
            Create Type
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};