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

export const InventoryTable = () => {
  const { data: items, refetch } = useInventoryItems();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});

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
          quantity: editedValues.quantity
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Zone/Sector</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Min Price</TableHead>
            <TableHead>LTC</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.inventory_types?.name}</TableCell>
              <TableCell>
                {item.sectors?.zones?.name} / {item.sectors?.name}
              </TableCell>
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
  );
};