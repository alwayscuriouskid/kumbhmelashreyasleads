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
import { useZones } from "@/hooks/useInventory";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateSectorDialogProps {
  onSuccess: () => void;
  children?: React.ReactNode;
}

export const CreateSectorDialog = ({ onSuccess, children }: CreateSectorDialogProps) => {
  const { data: zones } = useZones();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    zone_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.zone_id || !formData.name) {
      toast({
        title: "Error",
        description: "Zone and Name are required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Creating new sector:", formData);
      const { data, error } = await supabase
        .from('sectors')
        .insert({
          name: formData.name,
          description: formData.description || null,
          zone_id: formData.zone_id
        })
        .select('*, zones(*)');

      if (error) throw error;

      console.log("Created sector:", data);
      toast({
        title: "Success",
        description: "Sector created successfully",
      });
      
      setOpen(false);
      setFormData({ name: "", description: "", zone_id: "" });
      onSuccess();
    } catch (error: any) {
      console.error("Error creating sector:", error);
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
            Add Sector
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Add New Sector</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Select 
              value={formData.zone_id} 
              onValueChange={(value) => setFormData({ ...formData, zone_id: value })}
            >
              <SelectTrigger className="w-full bg-background">
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

          <Button type="submit" className="w-full">
            Create Sector
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};