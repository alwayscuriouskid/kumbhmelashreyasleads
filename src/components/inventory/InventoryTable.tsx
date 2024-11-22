import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Save, Trash2, X } from "lucide-react";
import { useInventoryItems, useInventoryTypes, useSectors } from "@/hooks/useInventory";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const InventoryTable = () => {
  const { data: items, refetch } = useInventoryItems();
  const { data: types } = useInventoryTypes();
  const { data: sectors } = useSectors();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<any>({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
          dimensions: editedValues.dimensions
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
      item.sectors?.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "all" || item.type_id === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <select
          className="border rounded p-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          {types?.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="sold">Sold</option>
        </select>
      </div>

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
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.inventory_types?.name}</TableCell>
                <TableCell>
                  {item.sectors?.zones?.name} / {item.sectors?.name}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      value={editedValues.current_price}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        current_price: e.target.value
                      })}
                    />
                  ) : (
                    `₹${item.current_price}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      value={editedValues.min_price}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        min_price: e.target.value
                      })}
                    />
                  ) : (
                    `₹${item.min_price}`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      value={editedValues.ltc}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        ltc: e.target.value
                      })}
                    />
                  ) : (
                    item.ltc
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editedValues.dimensions}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        dimensions: e.target.value
                      })}
                    />
                  ) : (
                    item.dimensions
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <select
                      className="border rounded p-1"
                      value={editedValues.status}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        status: e.target.value
                      })}
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="sold">Sold</option>
                    </select>
                  ) : (
                    <Badge
                      variant={
                        item.status === "available"
                          ? "default"
                          : item.status === "booked"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {item.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};