import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const updateOrderPaymentStatus = async (
  orderId: string,
  newPaymentStatus: 'pending' | 'partially_pending' | 'finished'
) => {
  console.log('Updating order payment status:', {
    orderId,
    newPaymentStatus
  });

  try {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        payment_status: newPaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) throw updateError;

    toast({
      title: "Success",
      description: "Payment status updated successfully",
    });

    return true;
  } catch (error: any) {
    console.error('Error updating payment status:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to update payment status",
      variant: "destructive",
    });
    throw error;
  }
};