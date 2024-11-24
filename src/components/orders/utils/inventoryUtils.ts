import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
      let newAvailable;
      if (status === 'approved') {
        newAvailable = currentAvailable - orderQuantity;
      } else if (status === 'rejected' && item.inventory_items?.available_quantity < currentQuantity) {
        // If order is rejected, restore the available quantity
        newAvailable = currentAvailable + orderQuantity;
      } else {
        newAvailable = currentAvailable;
      }

      console.log(`Updating inventory item ${item.inventory_item_id}:`, {
        currentQuantity,
        currentAvailable,
        orderQuantity,
        newQuantity: currentQuantity,
        newAvailable,
        status
      });

      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          available_quantity: newAvailable,
          status: newAvailable <= 0 ? 'sold' : 'available'
        })
        .eq('id', item.inventory_item_id);

      if (updateError) {
        console.error('Error updating inventory:', updateError);
        throw updateError;
      }
    }

    // Update the order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (orderError) throw orderError;

    toast({
      title: "Success",
      description: `Order ${status} and inventory updated successfully`,
    });

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