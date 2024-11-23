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
import { useSectors, useDeleteSector } from "@/hooks/useInventory";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export const ManageSectorDialog = () => {
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const { data: sectors } = useSectors();
  const deleteSector = useDeleteSector();

  const handleDelete = async () => {
    if (!selectedSectorId) return;
    try {
      await deleteSector.mutateAsync(selectedSectorId);
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Error deleting sector:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-background text-foreground">
            <Settings2 className="mr-2 h-4 w-4" />
            Manage Sectors
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Sectors</DialogTitle>
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