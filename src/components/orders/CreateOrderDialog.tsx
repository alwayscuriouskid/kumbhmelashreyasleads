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
import { toast } from "@/components/ui/use-toast";
import { OrderForm } from "./OrderForm";
import { createOrder, createOrderItems, updateInventory } from "./services/orderService";

interface CreateOrderDialogProps {
  onSuccess: () => void;
}

export const CreateOrderDialog = ({ onSuccess }: CreateOrderDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleCreateOrder = async (formData: any) => {
    try {
      const order = await createOrder(formData);
      console.log("Order created:", order);

      await createOrderItems(order.id, formData.selectedItems);
      await updateInventory(formData.selectedItems);

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