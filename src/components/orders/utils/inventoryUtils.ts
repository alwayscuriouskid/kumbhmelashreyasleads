import { supabase } from "@/integrations/supabase/client";
import { OrderItem } from "@/types/inventory";

export const updateInventoryQuantities = async (
  orderItems: OrderItem[],
  action: 'approve' | 'reject'
) => {
  try {
    console.log('Updating inventory quantities:', { orderItems, action });

    for (const item of orderItems) {
      // First get current quantities
      const { data: currentItem, error: getError } = await supabase
        .from('inventory_items')
        .select('quantity, available_quantity, reserved_quantity')
        .eq('id', item.inventory_item_id)
        .single();

      if (getError) throw getError;

      const quantity = Number(item.quantity) || 0;
      const currentReserved = Number(currentItem.reserved_quantity) || 0;
      const currentAvailable = Number(currentItem.available_quantity) || 0;
      
      // Calculate new quantities based on action
      const updates = action === 'approve' ? {
        available_quantity: currentAvailable - quantity,
        reserved_quantity: currentReserved + quantity
      } : {
        available_quantity: currentAvailable + quantity,
        reserved_quantity: currentReserved - quantity
      };

      console.log('Updating inventory item:', {
        itemId: item.inventory_item_id,
        updates
      });

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', item.inventory_item_id);

      if (updateError) throw updateError;
    }

    return true;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

export const updateInventoryPaymentStatus = async (orderItems: OrderItem[]) => {
  try {
    for (const item of orderItems) {
      // Get current quantities
      const { data: currentItem, error: getError } = await supabase
        .from('inventory_items')
        .select('reserved_quantity, sold_quantity')
        .eq('id', item.inventory_item_id)
        .single();

      if (getError) throw getError;

      const quantity = Number(item.quantity) || 0;
      const currentReserved = Number(currentItem.reserved_quantity) || 0;
      const currentSold = Number(currentItem.sold_quantity) || 0;

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({
          reserved_quantity: currentReserved - quantity,
          sold_quantity: currentSold + quantity
        })
        .eq('id', item.inventory_item_id);

      if (updateError) throw updateError;
    }

    return true;
  } catch (error) {
    console.error('Error updating inventory payment status:', error);
    throw error;
  }
};