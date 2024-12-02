import { supabase } from "@/integrations/supabase/client";
import { OrderItem } from "@/types/inventory";

export const updateInventoryQuantities = async (
  orderItems: OrderItem[],
  action: 'approve' | 'reject'
) => {
  try {
    console.log('Updating inventory quantities:', { orderItems, action });

    for (const item of orderItems) {
      const { data: currentItem, error: getError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('id', item.inventory_item_id)
        .single();

      if (getError) throw getError;

      const quantity = Number(item.quantity) || 0;
      const currentReserved = Number(currentItem.reserved_quantity) || 0;
      const currentAvailable = Number(currentItem.available_quantity) || 0;
      
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update(action === 'approve' ? {
          available_quantity: currentAvailable - quantity,
          reserved_quantity: currentReserved + quantity,
          sector_id: currentItem.sector_id, // Include required fields
          type_id: currentItem.type_id,
          current_price: currentItem.current_price,
          min_price: currentItem.min_price,
          status: currentItem.status
        } : {
          available_quantity: currentAvailable + quantity,
          reserved_quantity: currentReserved - quantity,
          sector_id: currentItem.sector_id, // Include required fields
          type_id: currentItem.type_id,
          current_price: currentItem.current_price,
          min_price: currentItem.min_price,
          status: currentItem.status
        })
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
      const { data: currentItem, error: getError } = await supabase
        .from('inventory_items')
        .select('*')
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
          sold_quantity: currentSold + quantity,
          sector_id: currentItem.sector_id, // Include required fields
          type_id: currentItem.type_id,
          current_price: currentItem.current_price,
          min_price: currentItem.min_price,
          status: currentItem.status
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