import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditSaleDialog } from "./EditSaleDialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SalesTableProps {
  salesEntries: any[];
  calculateProfitLoss: (
    sellingPrice: number,
    quantity: number,
    landingCost: number,
    minPrice: number
  ) => {
    vsLanding: string;
    vsMin: string;
    profitVsLanding: number;
    profitVsMin: number;
  };
  onUpdate: () => void;
}

export const SalesTable = ({ salesEntries, calculateProfitLoss, onUpdate }: SalesTableProps) => {
  const [editingSale, setEditingSale] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<any>(null);

  const handleDelete = async () => {
    if (!saleToDelete) return;

    try {
      const { error } = await supabase
        .from('sales_projection_entries')
        .delete()
        .eq('id', saleToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sale entry deleted successfully",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSaleToDelete(null);
    }
  };

  return (
    <>
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
              <TableHead>Amount vs Landing</TableHead>
              <TableHead>P/L vs Min</TableHead>
              <TableHead>Amount vs Min</TableHead>
              <TableHead>Actions</TableHead>
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
                      profitLoss.profitVsLanding >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ₹{profitLoss.profitVsLanding.toFixed(2)}
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
                  <TableCell
                    className={
                      profitLoss.profitVsMin >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    ₹{profitLoss.profitVsMin.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingSale(entry)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSaleToDelete(entry);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EditSaleDialog
        sale={editingSale}
        onClose={() => setEditingSale(null)}
        onSuccess={onUpdate}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sale Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};