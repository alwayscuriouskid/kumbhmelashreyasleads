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

export const SalesEntry = () => {
  const [open, setOpen] = useState(false);
  const { calculateProfitLoss } = useSalesCalculations();

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
            />
          </DialogContent>
        </Dialog>
      </div>

      <SalesTable 
        salesEntries={salesEntries || []} 
        calculateProfitLoss={calculateProfitLoss}
      />
    </div>
  );
};