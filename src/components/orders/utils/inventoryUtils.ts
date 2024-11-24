import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const updateInventoryQuantity = async (orderId: string, newStatus: string, oldStatus: string) => {
  try {
    console.log('Updating inventory for order:', orderId, 'changing status from', oldStatus, 'to:', newStatus);
    
    // First verify the order exists
    const { data: orders, error: orderCheckError } = await supabase
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

    if (orderCheckError) {
      console.error('Error checking order:', orderCheckError);
      throw orderCheckError;
    }
    
    if (!orders || orders.length === 0) {
      console.error('Order not found:', orderId);
      throw new Error(`Order ${orderId} not found`);
    }

    const orderCheck = orders[0];

    // Update order status first
    const { data: updatedOrders, error: orderError } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select();

    if (orderError) {
      console.error('Error updating order:', orderError);
      throw orderError;
    }

    if (!updatedOrders || updatedOrders.length === 0) {
      console.error('Failed to update order:', orderId);
      throw new Error('Failed to update order');
    }

    const updatedOrder = updatedOrders[0];

    // Update inventory quantities based on status change
    const orderItems = orderCheck.order_items;
    if (!orderItems?.length) {
      console.log('No order items to update for order:', orderId);
      return updatedOrder;
    }

    for (const item of orderItems) {
      if (!item.inventory_items) {
        console.warn('No inventory item found for order item:', item.inventory_item_id);
        continue;
      }

      const currentQuantity = item.inventory_items.quantity || 0;
      const currentAvailable = item.inventory_items.available_quantity || 0;
      const orderQuantity = item.quantity;
      
      // Calculate new available quantity based on status transition
      let newAvailable = currentAvailable;
      
      if (oldStatus !== 'approved' && newStatus === 'approved') {
        // Order is being approved - decrease available quantity
        newAvailable = currentAvailable - orderQuantity;
      } else if (oldStatus === 'approved' && newStatus !== 'approved') {
        // Order is being un-approved - restore quantity
        newAvailable = currentAvailable + orderQuantity;
      }

      console.log(`Updating inventory item ${item.inventory_item_id}:`, {
        currentQuantity,
        currentAvailable,
        orderQuantity,
        newAvailable,
        oldStatus,
        newStatus
      });

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          available_quantity: newAvailable,
          status: newAvailable <= 0 ? 'sold' : 'available'
        })
        .eq('id', item.inventory_item_id);

      if (updateError) {
        console.error('Error updating inventory item:', updateError);
        // If inventory update fails, attempt to rollback order status
        await supabase
          .from('orders')
          .update({ 
            status: oldStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
          
        throw updateError;
      }
    }

    toast({
      title: "Success",
      description: `Order status updated to ${newStatus} and inventory updated successfully`,
    });

    return updatedOrder;

  } catch (error: any) {
    console.error('Error updating inventory:', error);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
};