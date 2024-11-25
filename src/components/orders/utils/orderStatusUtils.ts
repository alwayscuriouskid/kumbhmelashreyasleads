import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order, OrderItem } from "@/types/inventory";

export const updateOrderStatus = async (
  orderId: string, 
  newStatus: "pending" | "approved" | "rejected",
  newPaymentStatus: string | null
) => {
  console.log('Updating order status:', { orderId, newStatus, newPaymentStatus });
  
  const updateData: Partial<Order> = {
    status: newStatus,
    updated_at: new Date().toISOString()
  };

  if (newPaymentStatus) {
    console.log('Updating payment_status to:', newPaymentStatus);
    updateData.payment_status = newPaymentStatus;
  }

  const { data, error: updateError } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select('*')
    .single();

  if (updateError) {
    console.error('Error updating order status:', updateError);
    throw updateError;
  }

  if (!data) {
    throw new Error('Order update failed - no data returned');
  }

  console.log('Order update successful:', data);
  return data;
};

export const handleOrderStatusChange = async (
  order: Order,
  editedOrder: Order,
  orderItems: OrderItem[]
) => {
  console.log('Handling order status change:', {
    currentStatus: order.status,
    newStatus: editedOrder.status,
    currentPaymentStatus: order.payment_status,
    newPaymentStatus: editedOrder.payment_status,
    orderItems
  });

  try {
    // Update order status first
    const updatedOrder = await updateOrderStatus(
      order.id, 
      editedOrder.status as "pending" | "approved" | "rejected", 
      editedOrder.payment_status
    );

    if (!updatedOrder) {
      throw new Error('Order update failed');
    }

    // Handle inventory updates based on status changes
    if (order.status !== editedOrder.status) {
      await updateInventoryForStatusChange(order.status, editedOrder.status, orderItems);
    }

    toast({
      title: "Success",
      description: "Order updated successfully",
    });

    return true;
  } catch (error) {
    console.error('Error in handleOrderStatusChange:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to update order",
      variant: "destructive",
    });
    throw error;
  }
};

const updateInventoryForStatusChange = async (
  oldStatus: string,
  newStatus: string,
  orderItems: OrderItem[]
) => {
  console.log('Updating inventory for status change:', {
    oldStatus,
    newStatus,
    orderItems
  });

  for (const item of orderItems) {
    const { data: currentItem, error: getError } = await supabase
      .from('inventory_items')
      .select('quantity, available_quantity, reserved_quantity')
      .eq('id', item.inventory_item_id)
      .single();

    if (getError) throw getError;

    const quantity = Number(item.quantity) || 0;
    let updates = {};

    if (oldStatus === 'pending' && newStatus === 'approved') {
      updates = {
        available_quantity: (currentItem.available_quantity || 0) - quantity,
        reserved_quantity: (currentItem.reserved_quantity || 0) + quantity
      };
    } else if (oldStatus === 'approved' && newStatus === 'rejected') {
      updates = {
        available_quantity: (currentItem.available_quantity || 0) + quantity,
        reserved_quantity: (currentItem.reserved_quantity || 0) - quantity
      };
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', item.inventory_item_id);

      if (updateError) throw updateError;
    }
  }
};