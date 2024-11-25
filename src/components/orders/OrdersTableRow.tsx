import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/inventory/EditableCell";
import { Order } from "@/types/inventory";
import { PaymentConfirmationCell } from "./cells/PaymentConfirmationCell";
import { NextPaymentDateCell } from "./cells/NextPaymentDateCell";
import { ActionCell } from "./cells/ActionCell";
import { InventoryItemsCell } from "./cells/InventoryItemsCell";
import { OrderStatusCell } from "./cells/OrderStatusCell";
import { PaymentStatusCell } from "./cells/PaymentStatusCell";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      console.log('Attempting to update order:', {
        orderId: order.id,
        currentStatus: order.status,
        newStatus: editedOrder.status,
        currentPaymentStatus: order.payment_status,
        newPaymentStatus: editedOrder.payment_status
      });

      // First update the order
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: editedOrder.status,
          payment_status: editedOrder.payment_status,
          payment_confirmation: editedOrder.payment_confirmation,
          next_payment_date: editedOrder.next_payment_date,
          next_payment_details: editedOrder.next_payment_details,
          additional_details: editedOrder.additional_details,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .select();

      if (error) {
        console.error('Error updating order:', error);
        throw error;
      }

      console.log('Order update response:', data);

      // Fetch the updated order to confirm changes
      const { data: updatedOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated order:', fetchError);
        throw fetchError;
      }

      console.log('Fetched updated order:', updatedOrder);

      if (updatedOrder.status !== editedOrder.status) {
        console.error('Order status not updated correctly');
        throw new Error('Order status update failed');
      }

      setIsEditing(false);
      onOrderUpdate();
      
      toast({
        title: "Success",
        description: "Order updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order",
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
    setEditedOrder(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      console.log('Updated order state:', updated);
      return updated;
    });
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