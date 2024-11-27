import { useState } from "react";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useInventoryItems } from "@/hooks/useInventory";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryTableHeader } from "./table/InventoryTableHeader";
import { InventoryTableBody } from "./table/InventoryTableBody";
import { exportToExcel } from "@/utils/exportUtils";

export const InventoryTable = () => {
  const { data: items, refetch } = useInventoryItems();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState({
    type: true,
    zone: true,
    sector: true,
    currentPrice: true,
    minPrice: true,
    ltc: true,
    dimensions: true,
    totalQuantity: true,
    availableQuantity: true,
    reservedQuantity: true,
    soldQuantity: true,
    sku: true,
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditedValues(item);
  };

  const handleSave = async () => {
    try {
      console.log('Saving inventory item:', editedValues);
      
      const { error } = await supabase
        .from('inventory_items')
        .update({
          current_price: editedValues.current_price,
          min_price: editedValues.min_price,
          ltc: editedValues.ltc,
          dimensions: editedValues.dimensions,
          quantity: editedValues.quantity,
          available_quantity: editedValues.available_quantity,
          sku: editedValues.sku,
          sector_id: editedValues.sector_id,
          type_id: editedValues.type_id
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      
      setEditingId(null);
      refetch();
    } catch (error: any) {
      console.error('Error updating inventory item:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    try {
      const exportData = filteredItems?.map(item => ({
        Type: item.inventory_types?.name,
        Zone: item.sectors?.zones?.name,
        Sector: item.sectors?.name,
        SKU: item.sku,
        'Current Price': item.current_price,
        'Min Price': item.min_price,
        LTC: item.ltc,
        Dimensions: item.dimensions,
        'Total Quantity': item.quantity,
        'Available Quantity': item.available_quantity,
        'Reserved Quantity': item.reserved_quantity,
        'Sold Quantity': item.sold_quantity,
      })) || [];

      exportToExcel(exportData, 'inventory-export');
      toast({
        title: "Export Successful",
        description: "The inventory data has been exported to Excel",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export inventory data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredItems = items?.filter((item) => {
    const matchesSearch = 
      item.inventory_types?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sectors?.zones?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sectors?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku?.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "all" || item.type_id === typeFilter;
    const matchesZone = zoneFilter === "all" || item.sectors?.zones?.id === zoneFilter;

    return matchesSearch && matchesType && matchesZone;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <InventoryFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          zoneFilter={zoneFilter}
          onZoneFilterChange={setZoneFilter}
          visibleColumns={visibleColumns}
          onToggleColumn={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
        />
        <Button 
          onClick={handleExport}
          variant="outline"
          className="ml-4"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="table-container">
        <Table>
          <InventoryTableHeader visibleColumns={visibleColumns} />
          <InventoryTableBody
            filteredItems={filteredItems}
            editingId={editingId}
            editedValues={editedValues}
            visibleColumns={visibleColumns}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
            onDelete={handleDelete}
            setEditedValues={setEditedValues}
          />
        </Table>
      </div>
    </div>
  );
};
