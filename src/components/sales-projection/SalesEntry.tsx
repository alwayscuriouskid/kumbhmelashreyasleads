import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { SalesEntryForm } from "./sales-entry/SalesEntryForm";
import { SalesTable } from "./sales-entry/SalesTable";
import { useSalesCalculations } from "./sales-entry/useSalesCalculations";
import { SalesFilters } from "./sales-entry/SalesFilters";

export const SalesEntry = () => {
  const [open, setOpen] = useState(false);
  const { calculateProfitLoss } = useSalesCalculations();

  // Filter states
  const [selectedInventoryType, setSelectedInventoryType] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: inventoryTypes, refetch: refetchInventory } = useQuery({
    queryKey: ["sales-projection-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales_projection_inventory")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: salesEntries, refetch: refetchSales } = useQuery({
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

  const handleUpdate = () => {
    refetchSales();
    refetchInventory();
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
            <SalesEntryForm 
              inventoryTypes={inventoryTypes || []} 
              onClose={() => setOpen(false)}
              onSuccess={handleUpdate}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SalesFilters
        inventoryTypes={inventoryTypes || []}
        selectedInventoryType={selectedInventoryType}
        setSelectedInventoryType={setSelectedInventoryType}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <SalesTable 
        salesEntries={salesEntries || []} 
        calculateProfitLoss={calculateProfitLoss}
        onUpdate={handleUpdate}
        selectedInventoryType={selectedInventoryType}
        selectedTeam={selectedTeam}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};