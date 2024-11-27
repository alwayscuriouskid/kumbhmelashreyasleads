import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useSectors, useDeleteSector } from "@/hooks/useInventory";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { toast } from "@/components/ui/use-toast";

interface ManageSectorDialogProps {
  children?: React.ReactNode;
}

export const ManageSectorDialog = ({ children }: ManageSectorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const { data: sectors, refetch } = useSectors();
  const deleteSector = useDeleteSector();

  const handleDelete = async () => {
    if (!selectedSectorId) return;
    try {
      console.log('Deleting sector:', selectedSectorId);
      await deleteSector.mutateAsync(selectedSectorId);
      await refetch(); // Explicitly refetch after deletion
      setDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Sector deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting sector:', error);
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
              Manage Sectors
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Sectors</DialogTitle>
            <DialogDescription>
              Manage your sectors here. Deleting a sector will remove it permanently.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {sectors?.map((sector) => (
              <div key={sector.id} className="flex items-center justify-between p-2 rounded border">
                <span>{sector.name} ({sector.zones?.name})</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedSectorId(sector.id);
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
        title="Delete Sector"
        description="Are you sure you want to delete this sector? This action cannot be undone."
      />
    </>
  );
};