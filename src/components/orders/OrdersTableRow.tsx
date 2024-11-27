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

  const handleInputChange = (field: keyof Order, value: any) => {
    setEditedOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      console.log('Saving order changes:', editedOrder);

      const { error } = await supabase
        .from('orders')
        .update({
          customer_name: editedOrder.customer_name,
          discounted_price: editedOrder.discounted_price,
          payment_status: editedOrder.payment_status,
          status: editedOrder.status,
          payment_confirmation: editedOrder.payment_confirmation,
          next_payment_date: editedOrder.next_payment_date,
          next_payment_details: editedOrder.next_payment_details,
          additional_details: editedOrder.additional_details,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      setIsEditing(false);
      onOrderUpdate();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TableRow>
      <OrderRowCells
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        visibleColumns={visibleColumns}
        teamMembers={teamMembers}
        onChange={handleInputChange}
      />
      <OrderRowActions
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        isUpdating={isUpdating}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSuccess={handleSave}
      />
    </TableRow>
  );
};