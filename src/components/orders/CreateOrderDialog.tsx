import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { OrderForm } from "./OrderForm";

interface CreateOrderDialogProps {
  onSuccess: () => void;
}

export const CreateOrderDialog = ({ onSuccess }: CreateOrderDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleCreateOrder = async (formData: any) => {
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            customer_phone: formData.customerPhone,
            customer_address: formData.customerAddress,
            team_member_id: formData.assignedTo,
            payment_method: formData.paymentMethod,
            payment_terms: formData.paymentTerms,
            notes: formData.notes,
            total_amount: formData.totalAmount,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items with quantities
      const orderItems = formData.selectedItems.map((itemId: string) => ({
        order_id: order.id,
        inventory_item_id: itemId,
        quantity: formData.quantities[itemId] || 1,
        price: formData.quantities[itemId] || 1,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update inventory items status
      const { error: updateError } = await supabase
        .from("inventory_items")
        .update({ status: "booked" })
        .in("id", formData.selectedItems);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Order created successfully",
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <OrderForm
          onSubmit={handleCreateOrder}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};