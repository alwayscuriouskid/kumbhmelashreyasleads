import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const updateInventoryQuantity = async (orderId: string, newStatus: string, oldStatus: string) => {
  try {
    console.log('Updating inventory for order:', orderId, 'changing status from', oldStatus, 'to:', newStatus);
    
    // Start by getting the order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        quantity,
        inventory_item_id,
        inventory_items (
          quantity,
          available_quantity
        )
      `)
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;
    if (!orderItems?.length) throw new Error('No order items found');

    // Begin transaction by updating order status first
    const { error: orderError, data } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .maybeSingle();

    if (orderError) throw orderError;
    if (!data) throw new Error('Failed to update order status');

    // Then update inventory quantities based on status change
    for (const item of orderItems) {
      const currentQuantity = item.inventory_items?.quantity || 0;
      const currentAvailable = item.inventory_items?.available_quantity || 0;
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

    return data;

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