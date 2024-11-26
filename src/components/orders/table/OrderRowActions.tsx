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
  const handleSave = async () => {
    try {
      // Only proceed if status has changed
      if (order.status === editedOrder.status && 
          order.payment_status === editedOrder.payment_status) {
        toast({
          title: "No changes",
          description: "No changes were made to the order status",
        });
        onCancel();
        return;
      }

      // First update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: editedOrder.status,
          payment_status: editedOrder.payment_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (orderError) throw orderError;

      // Then update inventory quantities based on order items
      const { data: orderItems } = await supabase
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

      if (!orderItems?.length) {
        throw new Error('No order items found');
      }

      // Update each inventory item
      for (const item of orderItems) {
        const quantity = item.quantity;
        const inventoryItem = item.inventory_items;
        
        let updates = {};
        
        // Handle different status transitions
        if (editedOrder.status === 'approved' && order.status !== 'approved') {
          updates = {
            available_quantity: inventoryItem.available_quantity - quantity,
            reserved_quantity: (inventoryItem.reserved_quantity || 0) + quantity
          };
        } else if (editedOrder.status === 'rejected' && order.status === 'approved') {
          updates = {
            available_quantity: inventoryItem.available_quantity + quantity,
            reserved_quantity: (inventoryItem.reserved_quantity || 0) - quantity
          };
        }

        // Handle payment status changes
        if (editedOrder.payment_status === 'finished' && 
            order.payment_status !== 'finished') {
          updates = {
            reserved_quantity: (inventoryItem.reserved_quantity || 0) - quantity,
            sold_quantity: (inventoryItem.sold_quantity || 0) + quantity
          };
        }

        if (Object.keys(updates).length > 0) {
          const { error: inventoryError } = await supabase
            .from('inventory_items')
            .update(updates)
            .eq('id', item.inventory_item_id);

          if (inventoryError) throw inventoryError;
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
    }
  };

  return (
    <ActionCell
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={handleSave}
      onCancel={onCancel}
      disabled={isUpdating}
    />
  );
};