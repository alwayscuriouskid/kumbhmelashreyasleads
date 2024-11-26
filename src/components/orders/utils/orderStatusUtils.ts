import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/types/inventory";

export const updateOrderStatus = async (
  orderId: string, 
  newStatus: "pending" | "approved" | "rejected",
  currentStatus: string
) => {
  console.log('Updating order status:', { orderId, currentStatus, newStatus });
  
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

    console.log('Current order data:', order);

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('Order status updated successfully:', updatedOrder);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};
