import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Order } from "@/types/inventory";
import { EditableCell } from "@/components/inventory/EditableCell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Edit2, Save, X } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface OrdersTableRowProps {
  order: Order;
  visibleColumns: Record<string, boolean>;
  teamMembers: any[];
  onOrderUpdate: () => void;
}

export const OrdersTableRow = ({ 
  order, 
  visibleColumns, 
  teamMembers,
  onOrderUpdate 
}: OrdersTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Partial<Order>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setEditedValues(order);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(editedValues)
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });
      
      setIsEditing(false);
      onOrderUpdate();
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
    setEditedValues({});
  };

  const handleChange = (field: keyof Order, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStatusCell = () => {
    if (isEditing) {
      return (
        <Select 
          value={editedValues.status || order.status} 
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="ending">Ending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    return (
      <Badge variant={order.status === "approved" ? "default" : "secondary"}>
        {order.status}
      </Badge>
    );
  };

  const renderPaymentStatusCell = () => {
    if (isEditing) {
      return (
        <Select 
          value={editedValues.payment_status || order.payment_status} 
          onValueChange={(value) => handleChange('payment_status', value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partially_pending">Partially Pending</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    return (
      <Badge variant={
        order.payment_status === "finished" 
          ? "default" 
          : order.payment_status === "partially_pending" 
          ? "secondary" 
          : "destructive"
      }>
        {order.payment_status}
      </Badge>
    );
  };

  return (
    <TableRow>
      {visibleColumns.orderId && <TableCell>{order.id}</TableCell>}
      {visibleColumns.date && (
        <TableCell>
          {format(new Date(order.created_at), "PPP")}
        </TableCell>
      )}
      {visibleColumns.customer && (
        <TableCell>
          <div className="space-y-1">
            <EditableCell
              value={isEditing ? editedValues.customer_name || '' : order.customer_name || ''}
              isEditing={isEditing}
              onChange={(value) => handleChange('customer_name', value)}
            />
          </div>
        </TableCell>
      )}
      {visibleColumns.teamMember && (
        <TableCell>
          {teamMembers?.find(member => member.id === order.team_member_id)?.name}
        </TableCell>
      )}
      {visibleColumns.totalAmount && (
        <TableCell>₹{order.total_amount}</TableCell>
      )}
      {visibleColumns.paymentStatus && (
        <TableCell>{renderPaymentStatusCell()}</TableCell>
      )}
      {visibleColumns.orderStatus && (
        <TableCell>{renderStatusCell()}</TableCell>
      )}
      {visibleColumns.paymentConfirmation && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedValues.payment_confirmation || '' : order.payment_confirmation || ''}
            isEditing={isEditing}
            onChange={(value) => handleChange('payment_confirmation', value)}
          />
        </TableCell>
      )}
      {visibleColumns.nextPaymentDate && (
        <TableCell>
          {isEditing ? (
            <DatePicker
              selected={editedValues.next_payment_date ? new Date(editedValues.next_payment_date) : undefined}
              onSelect={(date) => handleChange('next_payment_date', date?.toISOString())}
              placeholderText="Select date"
            />
          ) : (
            order.next_payment_date ? format(new Date(order.next_payment_date), "PPP") : "-"
          )}
        </TableCell>
      )}
      {visibleColumns.nextPaymentDetails && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedValues.next_payment_details || '' : order.next_payment_details || ''}
            isEditing={isEditing}
            onChange={(value) => handleChange('next_payment_details', value)}
          />
        </TableCell>
      )}
      <TableCell className="sticky right-0 bg-background/80 backdrop-blur-sm">
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};