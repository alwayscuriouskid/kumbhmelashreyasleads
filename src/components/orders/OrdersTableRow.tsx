import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EditableCell } from "@/components/inventory/EditableCell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order } from "@/types/inventory";
import { PaymentConfirmationCell } from "./cells/PaymentConfirmationCell";
import { NextPaymentDateCell } from "./cells/NextPaymentDateCell";
import { ActionCell } from "./cells/ActionCell";
import { InventoryItemsCell } from "./cells/InventoryItemsCell";

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
      console.log("Saving order updates:", editedValues);
      
      const { error } = await supabase
        .from('orders')
        .update({
          ...editedValues,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });
      
      setIsEditing(false);
      onOrderUpdate();
    } catch (error: any) {
      console.error("Error updating order:", error);
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
    console.log(`Updating ${field} to:`, value);
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <TableRow>
      {visibleColumns.orderId && <TableCell>{order.id}</TableCell>}
      {visibleColumns.date && (
        <TableCell>
          {new Date(order.created_at).toLocaleDateString()}
        </TableCell>
      )}
      {visibleColumns.customer && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedValues.customer_name || '' : order.customer_name || ''}
            isEditing={isEditing}
            onChange={(value) => handleChange('customer_name', value)}
          />
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
        <TableCell>
          {isEditing ? (
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
          ) : (
            <Badge variant={
              order.payment_status === "finished" 
                ? "default" 
                : order.payment_status === "partially_pending" 
                ? "secondary" 
                : "destructive"
            }>
              {order.payment_status}
            </Badge>
          )}
        </TableCell>
      )}
      {visibleColumns.orderStatus && (
        <TableCell>
          {isEditing ? (
            <Select 
              value={editedValues.status || order.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant={order.status === "approved" ? "default" : "secondary"}>
              {order.status}
            </Badge>
          )}
        </TableCell>
      )}
      {visibleColumns.inventoryItems && (
        <TableCell>
          <InventoryItemsCell items={order.order_items || []} />
        </TableCell>
      )}
      {visibleColumns.paymentConfirmation && (
        <TableCell>
          <PaymentConfirmationCell
            isEditing={isEditing}
            value={editedValues.payment_confirmation || order.payment_confirmation || ''}
            onChange={(value) => handleChange('payment_confirmation', value)}
          />
        </TableCell>
      )}
      {visibleColumns.nextPaymentDate && (
        <TableCell>
          <NextPaymentDateCell
            isEditing={isEditing}
            value={editedValues.next_payment_date || order.next_payment_date}
            onChange={(value) => handleChange('next_payment_date', value)}
          />
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
      {visibleColumns.additionalDetails && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedValues.additional_details || '' : order.additional_details || ''}
            isEditing={isEditing}
            onChange={(value) => handleChange('additional_details', value)}
          />
        </TableCell>
      )}
      <TableCell className="w-[100px]">
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