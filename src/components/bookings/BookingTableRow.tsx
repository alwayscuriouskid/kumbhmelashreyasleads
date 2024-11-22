import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { EditableCell } from "../inventory/EditableCell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ActionCell } from "../orders/cells/ActionCell";

interface BookingTableRowProps {
  booking: any;
  visibleColumns: Record<string, boolean>;
  onBookingUpdate: () => void;
}

export const BookingTableRow = ({ booking, visibleColumns, onBookingUpdate }: BookingTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState(booking);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues(booking);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update(editedValues)
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
      
      setIsEditing(false);
      onBookingUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues(booking);
  };

  const handleChange = (field: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <TableRow>
      {visibleColumns.itemType && (
        <TableCell>
          {booking.inventory_items?.inventory_types?.name}
        </TableCell>
      )}
      {visibleColumns.customer && (
        <TableCell>
          <div className="space-y-1">
            <EditableCell
              value={editedValues.customer_name || ''}
              isEditing={isEditing}
              onChange={(value) => handleChange('customer_name', value)}
            />
            <EditableCell
              value={editedValues.customer_email || ''}
              isEditing={isEditing}
              onChange={(value) => handleChange('customer_email', value)}
            />
          </div>
        </TableCell>
      )}
      {visibleColumns.teamMember && (
        <TableCell>{booking.team_member_name}</TableCell>
      )}
      {visibleColumns.startDate && (
        <TableCell>
          {isEditing ? (
            <DatePicker
              selected={new Date(editedValues.start_date)}
              onSelect={(date) => handleChange('start_date', date?.toISOString())}
            />
          ) : (
            format(new Date(booking.start_date), "PPP")
          )}
        </TableCell>
      )}
      {visibleColumns.endDate && (
        <TableCell>
          {isEditing ? (
            <DatePicker
              selected={new Date(editedValues.end_date)}
              onSelect={(date) => handleChange('end_date', date?.toISOString())}
            />
          ) : (
            format(new Date(booking.end_date), "PPP")
          )}
        </TableCell>
      )}
      {visibleColumns.status && (
        <TableCell>
          {isEditing ? (
            <Select
              value={editedValues.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tentative">Tentative</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge
              variant={
                booking.status === "confirmed"
                  ? "default"
                  : booking.status === "tentative"
                  ? "secondary"
                  : "destructive"
              }
            >
              {booking.status}
            </Badge>
          )}
        </TableCell>
      )}
      {visibleColumns.inventoryDetails && (
        <TableCell>
          <div className="space-y-1">
            <div className="text-sm">
              Type: {booking.inventory_items?.inventory_types?.name}
            </div>
            {booking.payment_amount && (
              <div className="text-sm text-muted-foreground">
                Amount: ₹{booking.payment_amount}
              </div>
            )}
          </div>
        </TableCell>
      )}
      <TableCell className="sticky right-0 bg-background/80 backdrop-blur-sm">
        <ActionCell
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </TableCell>
    </TableRow>
  );
};