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

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select('*, order_items(*, inventory_items(*, inventory_types(*)))')
    .maybeSingle();

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Order not found or update failed');
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