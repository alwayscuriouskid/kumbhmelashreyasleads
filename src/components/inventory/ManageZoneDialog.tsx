import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useZones, useDeleteZone } from "@/hooks/useInventory";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { toast } from "@/components/ui/use-toast";

interface ManageZoneDialogProps {
  children?: React.ReactNode;
}

export const ManageZoneDialog = ({ children }: ManageZoneDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const { data: zones, refetch } = useZones();
  const deleteZone = useDeleteZone();

  const handleDelete = async () => {
    if (!selectedZoneId) return;
    try {
      await deleteZone.mutateAsync(selectedZoneId);
      setDeleteDialogOpen(false);
      refetch();
      toast({
        title: "Success",
        description: "Zone deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting zone:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="outline" className="bg-background text-foreground">
              <Settings2 className="mr-2 h-4 w-4" />
              Manage Zones
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Zones</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {zones?.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-2 rounded border">
                <span>{zone.name}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedZoneId(zone.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Zone"
        description="Are you sure you want to delete this zone? This action cannot be undone."
      />
    </>
  );
};