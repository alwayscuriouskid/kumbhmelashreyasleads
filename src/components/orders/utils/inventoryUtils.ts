import { supabase } from "@/integrations/supabase/client";

export const updateInventoryQuantity = async (orderId: string, status: string) => {
  try {
    console.log('Updating inventory for order:', orderId, 'with status:', status);
    
    // Get order items for this order
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

    // For each order item, update inventory quantity
    for (const item of orderItems || []) {
      const currentQuantity = item.inventory_items?.quantity || 0;
      const currentAvailable = item.inventory_items?.available_quantity || 0;
      const orderQuantity = item.quantity;
      
      // Calculate new quantities based on status
      const newQuantity = currentQuantity;
      const newAvailable = status === 'approved' 
        ? currentAvailable - orderQuantity 
        : currentAvailable + orderQuantity;

      console.log(`Updating inventory item ${item.inventory_item_id}:`, {
        currentQuantity,
        currentAvailable,
        orderQuantity,
        newQuantity,
        newAvailable,
        status
      });

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          quantity: newQuantity,
          available_quantity: newAvailable,
          status: newAvailable <= 0 ? 'sold' : 'available'
        })
        .eq('id', item.inventory_item_id);

      if (updateError) {
        console.error('Error updating inventory:', updateError);
        throw updateError;
      }
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};