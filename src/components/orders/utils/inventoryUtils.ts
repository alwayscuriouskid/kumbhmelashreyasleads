import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const updateInventoryQuantity = async (orderId: string, newStatus: string, oldStatus: string) => {
  try {
    console.log('Updating inventory for order:', orderId, 'status change from', oldStatus, 'to:', newStatus);
    
    // 1. Get the order and its items
    const { data: orders, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          inventory_item_id,
          inventory_items (
            quantity,
            available_quantity
          )
        )
      `)
      .eq('id', orderId);

    if (orderError || !orders || orders.length === 0) {
      console.error('Error fetching order:', orderError);
      throw new Error('Order not found or error fetching order');
    }

    const order = orders[0];
    console.log('Found order:', order);

    // 2. Update order status
    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateOrderError) {
      console.error('Error updating order status:', updateOrderError);
      throw updateOrderError;
    }

    // 3. Handle inventory updates based on status change
    for (const item of order.order_items || []) {
      let updates = {};
      
      if (newStatus === 'approved' && oldStatus !== 'approved') {
        // Move quantity from available to reserved
        updates = {
          available_quantity: supabase.raw('available_quantity - ?', [item.quantity]),
          reserved_quantity: supabase.raw('COALESCE(reserved_quantity, 0) + ?', [item.quantity])
        };
      } else if (newStatus === 'rejected') {
        // Move quantity from reserved back to available
        updates = {
          available_quantity: supabase.raw('available_quantity + ?', [item.quantity]),
          reserved_quantity: supabase.raw('COALESCE(reserved_quantity, 0) - ?', [item.quantity])
        };
      }

      if (Object.keys(updates).length > 0) {
        const { error: inventoryError } = await supabase
          .from('inventory_items')
          .update(updates)
          .eq('id', item.inventory_item_id);

        if (inventoryError) {
          console.error('Error updating inventory:', inventoryError);
          throw inventoryError;
        }
      }
    }

    toast({
      title: "Success",
      description: `Order ${newStatus} and inventory updated successfully`,
    });

    return order;

  } catch (error: any) {
    console.error('Error in updateInventoryQuantity:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to update order and inventory",
      variant: "destructive",
    });
    throw error;
  }
};