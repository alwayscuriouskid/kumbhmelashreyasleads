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
import { BookingForm } from "./BookingForm";

interface CreateBookingDialogProps {
  onSuccess: () => void;
}

export const CreateBookingDialog = ({ onSuccess }: CreateBookingDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleCreateBooking = async (formData: any) => {
    try {
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            inventory_item_id: formData.selectedItems[0], // Bookings are for single items
            start_date: formData.startDate,
            end_date: formData.endDate,
            customer_name: formData.customerName,
            customer_email: formData.customerEmail,
            customer_phone: formData.customerPhone,
            customer_address: formData.customerAddress,
            team_member_id: formData.teamMemberId,
            team_member_name: formData.teamMemberName,
            payment_method: formData.paymentMethod,
            payment_amount: formData.paymentAmount,
            notes: formData.notes,
            status: "tentative",
          },
        ]);

      if (bookingError) throw bookingError;

      toast({
        title: "Success",
        description: "Booking created successfully",
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
          <Plus className="mr-2 h-4 w-4" /> Create Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <BookingForm
          onSubmit={handleCreateBooking}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};