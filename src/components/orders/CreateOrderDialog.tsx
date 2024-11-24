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
      console.log("Creating order with data:", formData);

      // First create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            customer_phone: formData.customerPhone,
            customer_address: formData.customerAddress,
            team_member_id: formData.teamMemberId,
            payment_method: formData.paymentMethod,
            notes: formData.notes,
            total_amount: formData.totalAmount,
            status: "pending",
            payment_confirmation: formData.paymentConfirmation,
            next_payment_date: formData.nextPaymentDate,
            next_payment_details: formData.nextPaymentDetails,
            additional_details: formData.additionalDetails,
            lead_id: formData.leadId || null // Ensure lead_id is properly set
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      console.log("Order created:", order);

      // Then create order items and update inventory
      const orderItems = formData.selectedItems.map((item: any) => ({
        order_id: order.id,
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update inventory items quantities
      for (const item of formData.selectedItems) {
        // First get current quantity
        const { data: currentItem, error: getError } = await supabase
          .from("inventory_items")
          .select("quantity")
          .eq("id", item.inventory_item_id)
          .single();

        if (getError) throw getError;

        const newQuantity = currentItem.quantity - item.quantity;

        // Then update with new quantity and status
        const { error: updateError } = await supabase
          .from("inventory_items")
          .update({ 
            quantity: newQuantity,
            status: newQuantity <= 0 ? 'sold' : 'available'
          })
          .eq("id", item.inventory_item_id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Order created successfully",
      });
      
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating order:", error);
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