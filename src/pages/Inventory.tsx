import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useInventoryItems } from "@/hooks/useInventory";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { CreateInventoryDialog } from "@/components/inventory/CreateInventoryDialog";
import { CreateTypeDialog } from "@/components/inventory/CreateTypeDialog";
import { CreateZoneDialog } from "@/components/inventory/CreateZoneDialog";
import { CreateSectorDialog } from "@/components/inventory/CreateSectorDialog";

const Inventory = () => {
  const { data: items, refetch } = useInventoryItems();

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex gap-2">
          <CreateTypeDialog onSuccess={refetch} />
          <CreateZoneDialog onSuccess={refetch} />
          <CreateSectorDialog onSuccess={refetch} />
          <CreateInventoryDialog onSuccess={refetch} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items?.length ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;