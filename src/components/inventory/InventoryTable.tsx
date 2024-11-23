import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useInventoryItems } from "@/hooks/useInventory";
import { EditableCell } from "./EditableCell";
import { StatusCell } from "./StatusCell";
import { TableActions } from "./TableActions";
import { InventoryFilters } from "./InventoryFilters";

export const InventoryTable = () => {
  const { data: items, refetch } = useInventoryItems();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState({
    type: true,
    zone: true,
    sector: true,
    currentPrice: true,
    minPrice: true,
    ltc: true,
    dimensions: true,
    quantity: true,
    availableQuantity: true,
    status: true,
    sku: true,
  });

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditedValues(item);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          current_price: editedValues.current_price,
          min_price: editedValues.min_price,
          status: editedValues.status,
          ltc: editedValues.ltc,
          dimensions: editedValues.dimensions,
          quantity: editedValues.quantity,
          sku: editedValues.sku,
          sector_id: editedValues.sector_id, // Add this line
          type_id: editedValues.type_id // Add this line
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
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesZone && matchesStatus;
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
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        visibleColumns={visibleColumns}
        onToggleColumn={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.type && <TableHead>Type</TableHead>}
              {visibleColumns.zone && <TableHead>Zone</TableHead>}
              {visibleColumns.sector && <TableHead>Sector</TableHead>}
              {visibleColumns.sku && <TableHead>SKU</TableHead>}
              {visibleColumns.currentPrice && <TableHead>Current Price</TableHead>}
              {visibleColumns.minPrice && <TableHead>Min Price</TableHead>}
              {visibleColumns.ltc && <TableHead>LTC</TableHead>}
              {visibleColumns.dimensions && <TableHead>Dimensions</TableHead>}
              {visibleColumns.quantity && <TableHead>Total Quantity</TableHead>}
              {visibleColumns.availableQuantity && <TableHead>Available Quantity</TableHead>}
              {visibleColumns.status && <TableHead>Status</TableHead>}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems?.map((item) => (
              <TableRow key={item.id}>
                {visibleColumns.type && <TableCell>{item.inventory_types?.name}</TableCell>}
                {visibleColumns.zone && <TableCell>{item.sectors?.zones?.name}</TableCell>}
                {visibleColumns.sector && <TableCell>{item.sectors?.name}</TableCell>}
                {visibleColumns.sku && (
                  <TableCell>
                    <EditableCell
                      value={item.sku || ''}
                      isEditing={editingId === item.id}
                      onChange={(value) => setEditedValues({
                        ...editedValues,
                        sku: value
                      })}
                    />
                  </TableCell>
                )}
                {visibleColumns.currentPrice && (
                  <TableCell>
                    <EditableCell
                      value={item.current_price}
                      isEditing={editingId === item.id}
                      onChange={(value) => setEditedValues({
                        ...editedValues,
                        current_price: value
                      })}
                      type="number"
                    />
                  </TableCell>
                )}
                {visibleColumns.minPrice && (
                  <TableCell>
                    <EditableCell
                      value={item.min_price}
                      isEditing={editingId === item.id}
                      onChange={(value) => setEditedValues({
                        ...editedValues,
                        min_price: value
                      })}
                      type="number"
                    />
                  </TableCell>
                )}
                {visibleColumns.ltc && (
                  <TableCell>
                    <EditableCell
                      value={item.ltc || ''}
                      isEditing={editingId === item.id}
                      onChange={(value) => setEditedValues({
                        ...editedValues,
                        ltc: value
                      })}
                      type="number"
                    />
                  </TableCell>
                )}
                {visibleColumns.dimensions && (
                  <TableCell>
                    <EditableCell
                      value={item.dimensions || ''}
                      isEditing={editingId === item.id}
                      onChange={(value) => setEditedValues({
                        ...editedValues,
                        dimensions: value
                      })}
                    />
                  </TableCell>
                )}
                {visibleColumns.quantity && (
                  <TableCell>
                    <EditableCell
                      value={item.quantity}
                      isEditing={editingId === item.id}
                      onChange={(value) => setEditedValues({
                        ...editedValues,
                        quantity: value
                      })}
                      type="number"
                    />
                  </TableCell>
                )}
                {visibleColumns.availableQuantity && (
                  <TableCell>
                    {item.available_quantity || item.quantity}
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell>
                    <StatusCell
                      status={item.status}
                      isEditing={editingId === item.id}
                      onChange={(value) => setEditedValues({
                        ...editedValues,
                        status: value
                      })}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <TableActions
                    isEditing={editingId === item.id}
                    onEdit={() => handleEdit(item)}
                    onSave={handleSave}
                    onCancel={() => setEditingId(null)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};