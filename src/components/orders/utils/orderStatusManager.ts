import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/types/inventory";

export const updateOrderStatus = async (
  orderId: string,
  newStatus: 'pending' | 'approved' | 'rejected',
  currentStatus: string
) => {
  console.log('Updating order status:', {
    orderId,
    currentStatus,
    newStatus
  });

  try {
    // First get the order details with items
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          inventory_item_id,
          inventory_items (
            id,
            quantity,
            available_quantity,
            reserved_quantity,
            sold_quantity
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (fetchError) throw fetchError;

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    console.log('Order status updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updateOrderPaymentStatus = async (
  orderId: string,
  newPaymentStatus: 'pending' | 'partially_pending' | 'finished'
) => {
  console.log('Updating order payment status:', {
    orderId,
    newPaymentStatus
  });

  try {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    console.log('Payment status updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};