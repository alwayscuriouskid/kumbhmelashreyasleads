import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/inventory/EditableCell";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/types/inventory";
import { PaymentConfirmationCell } from "./cells/PaymentConfirmationCell";
import { NextPaymentDateCell } from "./cells/NextPaymentDateCell";
import { ActionCell } from "./cells/ActionCell";
import { InventoryItemsCell } from "./cells/InventoryItemsCell";
import { OrderStatusCell } from "./cells/OrderStatusCell";
import { PaymentStatusCell } from "./cells/PaymentStatusCell";
import { updateInventoryQuantity } from "./utils/inventoryUtils";

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
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedOrder(order);
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      
      // Handle status change and inventory updates first
      if (order.status !== editedOrder.status) {
        console.log("Status changing from", order.status, "to", editedOrder.status);
        const updatedOrder = await updateInventoryQuantity(order.id, editedOrder.status, order.status);
        if (!updatedOrder) throw new Error('Failed to update order status');
      }

      // Then update other order fields if they've changed
      const updates: any = {};
      if (editedOrder.payment_status !== order.payment_status) {
        updates.payment_status = editedOrder.payment_status;
      }
      if (editedOrder.payment_confirmation !== order.payment_confirmation) {
        updates.payment_confirmation = editedOrder.payment_confirmation;
      }
      if (editedOrder.next_payment_date !== order.next_payment_date) {
        updates.next_payment_date = editedOrder.next_payment_date;
      }
      if (editedOrder.next_payment_details !== order.next_payment_details) {
        updates.next_payment_details = editedOrder.next_payment_details;
      }
      if (editedOrder.additional_details !== order.additional_details) {
        updates.additional_details = editedOrder.additional_details;
      }

      // Only update if there are changes other than status
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from('orders')
          .update(updates)
          .eq('id', order.id);

        if (error) throw error;
      }
      
      setIsEditing(false);
      onOrderUpdate();
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedOrder(order);
  };

  const handleChange = (field: keyof Order, value: any) => {
    console.log(`Updating ${field} to:`, value);
    setEditedOrder(prev => ({
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
            value={isEditing ? editedOrder.customer_name || '' : order.customer_name || ''}
            isEditing={isEditing}
            onChange={(value) => handleChange('customer_name', value)}
          />
        </TableCell>
      )}
      {visibleColumns.teamMember && (
        <TableCell>
          {teamMembers?.find(member => member.id === order.team_member_id)?.name || order.team_member_name}
        </TableCell>
      )}
      {visibleColumns.totalAmount && (
        <TableCell>₹{order.total_amount}</TableCell>
      )}
      {visibleColumns.paymentStatus && (
        <TableCell>
          <PaymentStatusCell
            value={isEditing ? editedOrder.payment_status || 'pending' : order.payment_status || 'pending'}
            isEditing={isEditing}
            onChange={(value) => handleChange('payment_status', value)}
          />
        </TableCell>
      )}
      {visibleColumns.orderStatus && (
        <TableCell>
          <OrderStatusCell
            value={isEditing ? editedOrder.status : order.status}
            isEditing={isEditing}
            onChange={(value) => handleChange('status', value)}
          />
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
            value={editedOrder.payment_confirmation || order.payment_confirmation || ''}
            onChange={(value) => handleChange('payment_confirmation', value)}
          />
        </TableCell>
      )}
      {visibleColumns.nextPaymentDate && (
        <TableCell>
          <NextPaymentDateCell
            isEditing={isEditing}
            value={editedOrder.next_payment_date || order.next_payment_date}
            onChange={(value) => handleChange('next_payment_date', value)}
          />
        </TableCell>
      )}
      {visibleColumns.nextPaymentDetails && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedOrder.next_payment_details || '' : order.next_payment_details || ''}
            isEditing={isEditing}
            onChange={(value) => handleChange('next_payment_details', value)}
          />
        </TableCell>
      )}
      {visibleColumns.additionalDetails && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedOrder.additional_details || '' : order.additional_details || ''}
            isEditing={isEditing}
            onChange={(value) => handleChange('additional_details', value)}
          />
        </TableCell>
      )}
      <TableCell>
        <ActionCell
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          disabled={isUpdating}
        />
      </TableCell>
    </TableRow>
  );
};