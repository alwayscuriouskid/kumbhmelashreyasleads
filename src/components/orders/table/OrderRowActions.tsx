import { useState } from "react";
import { ActionCell } from "../cells/ActionCell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/types/inventory";

interface OrderRowActionsProps {
  order: Order;
  editedOrder: Order;
  isEditing: boolean;
  isUpdating: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSuccess: () => void;
}

export const OrderRowActions = ({
  order,
  editedOrder,
  isEditing,
  isUpdating,
  onEdit,
  onCancel,
  onSuccess,
}: OrderRowActionsProps) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('Starting order update:', { 
        orderId: order.id, 
        currentStatus: order.status, 
        newStatus: editedOrder.status,
        currentPaymentStatus: order.payment_status,
        newPaymentStatus: editedOrder.payment_status
      });

      // First get order items to calculate quantities
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          inventory_item_id,
          inventory_items (
            id,
            available_quantity,
            reserved_quantity,
            sold_quantity
          )
        `)
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;
      console.log('Retrieved order items:', orderItems);

      // Update order status first
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: editedOrder.status,
          payment_status: editedOrder.payment_status,
          payment_confirmation: editedOrder.payment_confirmation,
          next_payment_date: editedOrder.next_payment_date,
          next_payment_details: editedOrder.next_payment_details,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (orderError) throw orderError;
      console.log('Order status updated successfully');

      // Handle inventory updates based on status changes
      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          const inventoryItem = item.inventory_items;
          const quantity = item.quantity;
          let updates = {};

          // Calculate inventory updates based on status changes
          if (editedOrder.status === 'approved' && order.status !== 'approved') {
            console.log('Updating inventory for approved order');
            updates = {
              available_quantity: inventoryItem.available_quantity - quantity,
              reserved_quantity: (inventoryItem.reserved_quantity || 0) + quantity
            };
          } else if (editedOrder.status === 'rejected' && order.status === 'approved') {
            console.log('Updating inventory for rejected order');
            updates = {
              available_quantity: inventoryItem.available_quantity + quantity,
              reserved_quantity: Math.max(0, (inventoryItem.reserved_quantity || 0) - quantity)
            };
          }

          // Handle payment status changes
          if (editedOrder.payment_status === 'finished' && order.payment_status !== 'finished') {
            console.log('Updating inventory for completed payment');
            updates = {
              reserved_quantity: Math.max(0, (inventoryItem.reserved_quantity || 0) - quantity),
              sold_quantity: (inventoryItem.sold_quantity || 0) + quantity
            };
          }

          // Only update if there are changes to make
          if (Object.keys(updates).length > 0) {
            console.log('Applying inventory updates:', { 
              itemId: item.inventory_item_id, 
              updates 
            });
            
            const { error: inventoryError } = await supabase
              .from('inventory_items')
              .update(updates)
              .eq('id', item.inventory_item_id);

            if (inventoryError) throw inventoryError;
          }
        }
      }

      toast({
        title: "Success",
        description: "Order updated successfully",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActionCell
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={handleSave}
      onCancel={onCancel}
      disabled={loading}
    />
  );
};