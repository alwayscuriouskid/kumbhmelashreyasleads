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

    // 3. If order is being approved, update inventory
    if (newStatus === 'approved' && oldStatus !== 'approved') {
      console.log('Order approved - updating inventory quantities');
      
      for (const item of order.order_items || []) {
        console.log('Updating inventory item:', item.inventory_item_id);
        
        // Get current inventory state
        const { data: currentInventory, error: inventoryError } = await supabase
          .from('inventory_items')
          .select('quantity, available_quantity')
          .eq('id', item.inventory_item_id)
          .single();

        if (inventoryError) {
          console.error('Error fetching inventory item:', inventoryError);
          throw inventoryError;
        }

        const newQuantity = (currentInventory.quantity || 0) - item.quantity;
        const newAvailable = (currentInventory.available_quantity || 0) - item.quantity;

        // Update inventory
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({ 
            quantity: newQuantity,
            available_quantity: newAvailable,
            status: newQuantity <= 0 ? 'sold' : 'available'
          })
          .eq('id', item.inventory_item_id);

        if (updateError) {
          console.error('Error updating inventory:', updateError);
          throw updateError;
        }

        console.log('Successfully updated inventory item:', item.inventory_item_id);
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