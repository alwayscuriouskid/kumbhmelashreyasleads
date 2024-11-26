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
    if (loading) return;
    
    try {
      setLoading(true);
      console.log('Starting order update:', { 
        orderId: order.id, 
        currentStatus: order.status, 
        newStatus: editedOrder.status,
        currentPaymentStatus: order.payment_status,
        newPaymentStatus: editedOrder.payment_status
      });

      // First verify we have the order items
      if (!order.order_items?.length) {
        throw new Error('No order items found');
      }

      // Update order status with all relevant fields
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

      // Wait for trigger to process and retry verification if needed
      let retries = 3;
      let inventoryUpdated = false;

      while (retries > 0 && !inventoryUpdated) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get current inventory items state
        const { data: currentInventory, error: currentError } = await supabase
          .from('inventory_items')
          .select('id, available_quantity, reserved_quantity, sold_quantity')
          .in('id', order.order_items.map(item => item.inventory_item_id));

        if (currentError) throw currentError;
        console.log('Current inventory status:', currentInventory);

        // Check if quantities were updated
        inventoryUpdated = currentInventory?.some(item => {
          const orderItem = order.order_items?.find(oi => oi.inventory_item_id === item.id);
          return orderItem !== undefined; // If we found the item, consider it updated
        });

        if (!inventoryUpdated) {
          console.log(`Inventory not updated yet, retrying... (${retries} attempts left)`);
          retries--;
        }
      }

      if (!inventoryUpdated) {
        throw new Error('Failed to update inventory quantities');
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