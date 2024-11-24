import { supabase } from "@/integrations/supabase/client";

export const updateInventoryQuantity = async (orderId: string, status: string) => {
  try {
    // Get order items for this order
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*, inventory_items!inner(*)')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    // For each order item, update inventory quantity
    for (const item of orderItems || []) {
      const currentQuantity = item.inventory_items.quantity;
      const orderQuantity = item.quantity;
      
      // Calculate new quantity based on status
      const newQuantity = status === 'approved' 
        ? currentQuantity - orderQuantity 
        : currentQuantity + orderQuantity;

      console.log(`Updating inventory item ${item.inventory_item_id}:`, {
        currentQuantity,
        orderQuantity,
        newQuantity,
        status
      });

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          quantity: newQuantity,
          available_quantity: newQuantity,
          status: newQuantity <= 0 ? 'sold' : 'available'
        })
        .eq('id', item.inventory_item_id);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};