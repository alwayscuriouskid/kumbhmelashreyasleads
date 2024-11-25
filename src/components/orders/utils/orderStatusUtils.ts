import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order, OrderItem } from "@/types/inventory";
import { updateInventoryQuantities, updateInventoryPaymentStatus } from "./inventoryUtils";

export const updateOrderStatus = async (
  orderId: string, 
  newStatus: string,
  newPaymentStatus: string | null
) => {
  console.log('Updating order status:', { orderId, newStatus, newPaymentStatus });
  
  const { data, error: updateError } = await supabase
    .from('orders')
    .update({
      status: newStatus,
      payment_status: newPaymentStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select();

  if (updateError) {
    console.error('Error updating order status:', updateError);
    throw updateError;
  }

  if (!data || data.length === 0) {
    throw new Error('Order update failed - no data returned');
  }

  console.log('Order update successful:', data[0]);
  return data[0];
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
      editedOrder.status, 
      editedOrder.payment_status
    );

    if (!updatedOrder) {
      throw new Error('Order update failed');
    }

    // Handle inventory updates based on status changes
    if (order.status !== editedOrder.status) {
      if (order.status === 'pending' && editedOrder.status === 'approved') {
        await updateInventoryQuantities(orderItems, 'approve');
      } else if (order.status === 'approved' && editedOrder.status === 'rejected') {
        await updateInventoryQuantities(orderItems, 'reject');
      }
    }

    // Handle payment status changes
    if (order.payment_status !== editedOrder.payment_status && 
        ['partially_paid', 'finished'].includes(editedOrder.payment_status || '')) {
      await updateInventoryPaymentStatus(orderItems);
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