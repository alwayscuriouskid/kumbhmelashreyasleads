import { useState } from "react";
import { TableRow } from "@/components/ui/table";
import { Order } from "@/types/inventory";
import { OrderRowCells } from "./table/OrderRowCells";
import { OrderRowActions } from "./table/OrderRowActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OrdersTableRowProps {
  order: Order;
  visibleColumns: Record<string, boolean>;
  teamMembers: any[];
  onOrderUpdate: () => void;
}

export const OrdersTableRow = ({ 
  order, 
  visibleColumns, 
  teamMembers,
  onOrderUpdate 
}: OrdersTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedOrder(order);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedOrder(order);
  };

  const handleChange = async (field: keyof Order, value: any) => {
    console.log(`Updating ${field} to:`, value);
    
    // Special handling for status changes to ensure inventory updates
    if (field === 'status' || field === 'payment_status') {
      try {
        setIsUpdating(true);
        
        const { error } = await supabase
          .from('orders')
          .update({ [field]: value })
          .eq('id', order.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: `Order ${field.replace('_', ' ')} updated successfully`,
        });

        onOrderUpdate();
      } catch (error: any) {
        console.error('Error updating order:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
        setIsEditing(false);
      }
    } else {
      // For other fields, just update the local state
      setEditedOrder(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    onOrderUpdate();
  };

  return (
    <TableRow>
      <OrderRowCells
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        visibleColumns={visibleColumns}
        teamMembers={teamMembers}
        onChange={handleChange}
      />
      <OrderRowActions
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        isUpdating={isUpdating}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </TableRow>
  );
};