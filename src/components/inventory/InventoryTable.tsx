import { useState } from "react";
import { Table } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useInventoryItems } from "@/hooks/useInventory";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryTableHeader } from "./table/InventoryTableHeader";
import { InventoryTableBody } from "./table/InventoryTableBody";

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