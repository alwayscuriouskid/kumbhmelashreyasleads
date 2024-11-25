import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order, OrderItem } from "@/types/inventory";

export const updateOrderStatus = async (
  orderId: string, 
  newStatus: "pending" | "approved" | "rejected",
  newPaymentStatus: string | null = null
) => {
  console.log('Updating order status:', { orderId, newStatus, newPaymentStatus });
  
  try {
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
      .single();

    if (error) throw error;

    console.log('Order update successful:', data);
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updateOrderPaymentStatus = async (
  orderId: string,
  newPaymentStatus: 'pending' | 'partially_pending' | 'finished'
) => {
  console.log('Updating order payment status:', { orderId, newPaymentStatus });
  
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select('*, order_items(*, inventory_items(*, inventory_types(*)))')
      .single();

    if (error) throw error;

    console.log('Payment status update successful:', data);
    return data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
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
    // First handle order status change if any
    if (order.status !== editedOrder.status) {
      await updateOrderStatus(order.id, editedOrder.status as "pending" | "approved" | "rejected");
      
      toast({
        title: "Success",
        description: `Order status updated to ${editedOrder.status}`,
      });
    }

    // Then handle payment status change if any
    if (order.payment_status !== editedOrder.payment_status) {
      await updateOrderPaymentStatus(
        order.id, 
        editedOrder.payment_status as 'pending' | 'partially_pending' | 'finished'
      );
      
      toast({
        title: "Success",
        description: `Payment status updated to ${editedOrder.payment_status}`,
      });
    }

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