import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/inventory/EditableCell";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/types/inventory";
import { PaymentConfirmationCell } from "./cells/PaymentConfirmationCell";
import { NextPaymentDateCell } from "./cells/NextPaymentDateCell";
import { ActionCell } from "./cells/ActionCell";
import { InventoryItemsCell } from "./cells/InventoryItemsCell";
import { OrderStatusCell } from "./cells/OrderStatusCell";
import { PaymentStatusCell } from "./cells/PaymentStatusCell";
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
      
      // Log the current state and changes
      console.log('Current order state:', order);
      console.log('Edited order state:', editedOrder);
      
      // Prepare update data
      const updateData = {
        status: editedOrder.status,
        payment_status: editedOrder.payment_status,
        updated_at: new Date().toISOString()
      };
      
      console.log('Sending update to database:', updateData);

      // Update order status
      const { error: updateError, data: updatedOrder } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      console.log('Database update response:', updatedOrder);

      toast({
        title: "Success",
        description: "Order updated successfully",
      });
      
      setIsEditing(false);
      onOrderUpdate(); // Refresh the orders list
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