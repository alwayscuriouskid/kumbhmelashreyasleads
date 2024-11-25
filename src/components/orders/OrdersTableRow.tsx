import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/inventory/EditableCell";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/inventory";
import { PaymentConfirmationCell } from "./cells/PaymentConfirmationCell";
import { NextPaymentDateCell } from "./cells/NextPaymentDateCell";
import { ActionCell } from "./cells/ActionCell";
import { InventoryItemsCell } from "./cells/InventoryItemsCell";
import { OrderStatusCell } from "./cells/OrderStatusCell";
import { PaymentStatusCell } from "./cells/PaymentStatusCell";
import { updateInventoryQuantities, updateInventoryPaymentStatus } from "./utils/inventoryUtils";
import { updateOrderStatus } from "./utils/orderStatusUtils";

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
      
      console.log('Current order state:', order);
      console.log('Edited order state:', editedOrder);
      
      // Check if status is actually changing
      if (order.status === editedOrder.status && order.payment_status === editedOrder.payment_status) {
        console.log('No status changes detected');
        setIsEditing(false);
        return;
      }

      // Get order items for inventory updates
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          quantity,
          inventory_item_id,
          price
        `)
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;
      
      if (!orderItems || orderItems.length === 0) {
        throw new Error('No order items found');
      }

      // Update order status
      await updateOrderStatus(order.id, editedOrder.status, editedOrder.payment_status);

      // Handle inventory updates based on status changes
      if (order.status !== editedOrder.status) {
        if (order.status === 'pending' && editedOrder.status === 'approved') {
          await updateInventoryQuantities(orderItems, 'approve');
        } else if (order.status === 'approved' && editedOrder.status === 'rejected') {
          await updateInventoryQuantities(orderItems, 'reject');
        }
      }

      // Handle payment status changes
      if (order.payment_status !== editedOrder.payment_status && 
          ['partially_paid', 'finished'].includes(editedOrder.payment_status || '')) {
        await updateInventoryPaymentStatus(orderItems);
      }

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