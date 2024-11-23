import { Button } from "@/components/ui/button";

interface BookingFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const BookingFormActions = ({ onCancel, isSubmitting }: BookingFormActionsProps) => (
  <div className="flex justify-end gap-4">
    <Button variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" disabled={isSubmitting}>
      Create Booking
    </Button>
  </div>
);