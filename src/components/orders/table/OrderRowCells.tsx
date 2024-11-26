import { TableCell } from "@/components/ui/table";
import { EditableCell } from "@/components/inventory/EditableCell";
import { PaymentStatusCell } from "../cells/PaymentStatusCell";
import { OrderStatusCell } from "../cells/OrderStatusCell";
import { InventoryItemsCell } from "../cells/InventoryItemsCell";
import { PaymentConfirmationCell } from "../cells/PaymentConfirmationCell";
import { NextPaymentDateCell } from "../cells/NextPaymentDateCell";
import { Order } from "@/types/inventory";
import { updateOrderPaymentStatus } from "../utils/paymentStatusManager";

interface OrderRowCellsProps {
  order: Order;
  editedOrder: Order;
  isEditing: boolean;
  visibleColumns: Record<string, boolean>;
  teamMembers: any[];
  onChange: (field: keyof Order, value: any) => void;
}

export const OrderRowCells = ({
  order,
  editedOrder,
  isEditing,
  visibleColumns,
  teamMembers,
  onChange,
}: OrderRowCellsProps) => {
  const handlePaymentStatusChange = async (value: string) => {
    try {
      await updateOrderPaymentStatus(order.id, value as 'pending' | 'partially_pending' | 'finished');
      onChange('payment_status', value);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  return (
    <>
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
            onChange={(value) => onChange('customer_name', value)}
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
            onChange={handlePaymentStatusChange}
          />
        </TableCell>
      )}
      {visibleColumns.orderStatus && (
        <TableCell>
          <OrderStatusCell
            value={isEditing ? editedOrder.status : order.status}
            isEditing={isEditing}
            onChange={(value) => onChange('status', value)}
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
            onChange={(value) => onChange('payment_confirmation', value)}
          />
        </TableCell>
      )}
      {visibleColumns.nextPaymentDate && (
        <TableCell>
          <NextPaymentDateCell
            isEditing={isEditing}
            value={editedOrder.next_payment_date || order.next_payment_date}
            onChange={(value) => onChange('next_payment_date', value)}
          />
        </TableCell>
      )}
      {visibleColumns.nextPaymentDetails && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedOrder.next_payment_details || '' : order.next_payment_details || ''}
            isEditing={isEditing}
            onChange={(value) => onChange('next_payment_details', value)}
          />
        </TableCell>
      )}
      {visibleColumns.additionalDetails && (
        <TableCell>
          <EditableCell
            value={isEditing ? editedOrder.additional_details || '' : order.additional_details || ''}
            isEditing={isEditing}
            onChange={(value) => onChange('additional_details', value)}
          />
        </TableCell>
      )}
    </>
  );
};