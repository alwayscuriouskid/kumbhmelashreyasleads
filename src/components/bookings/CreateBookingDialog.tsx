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

  const handleCreateBooking = async (bookings: any[]) => {
    try {
      // Create bookings for each selected item with their quantities
      const bookingPromises = bookings.map(async (booking) => {
        const { error: bookingError } = await supabase
          .from("bookings")
          .insert([
            {
              inventory_item_id: booking.inventory_item_id,
              start_date: booking.startDate,
              end_date: booking.endDate,
              customer_name: booking.customerName,
              customer_email: booking.customerEmail,
              customer_phone: booking.customerPhone,
              customer_address: booking.customerAddress,
              team_member_id: booking.teamMemberId,
              team_member_name: booking.teamMemberName,
              payment_method: booking.paymentMethod,
              payment_amount: booking.payment_amount,
              notes: booking.notes,
              status: "tentative",
              quantity: booking.quantity
            },
          ]);

        if (bookingError) throw bookingError;
      });

      await Promise.all(bookingPromises);

      toast({
        title: "Success",
        description: "Bookings created successfully",
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