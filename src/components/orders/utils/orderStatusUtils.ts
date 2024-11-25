import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/types/inventory";

export const updateOrderStatus = async (
  orderId: string, 
  status: string,
  paymentStatus: string | null
) => {
  try {
    console.log('Updating order status:', { orderId, status, paymentStatus });
    
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};