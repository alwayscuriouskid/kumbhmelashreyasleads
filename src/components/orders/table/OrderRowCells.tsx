import { TableCell } from "@/components/ui/table";
import { EditableCell } from "@/components/inventory/EditableCell";
import { PaymentStatusCell } from "../cells/PaymentStatusCell";
import { OrderStatusCell } from "../cells/OrderStatusCell";
import { InventoryItemsCell } from "../cells/InventoryItemsCell";
import { NextPaymentDateCell } from "../cells/NextPaymentDateCell";
import { Order } from "@/types/inventory";
import { updateOrderPaymentStatus } from "../utils/paymentStatusManager";
import { Input } from "@/components/ui/input";

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
          {isEditing ? (
            <Input
              value={editedOrder.customer_name || ''}
              onChange={(e) => onChange('customer_name', e.target.value)}
              className="w-full"
            />
          ) : (
            order.customer_name
          )}
        </TableCell>
      )}
      {visibleColumns.teamMember && (
        <TableCell>
          {teamMembers?.find(member => member.id === order.team_member_id)?.name || order.team_member_name}
        </TableCell>
      )}
      {visibleColumns.discountedPrice && (
        <TableCell>
          {isEditing ? (
            <Input
              type="number"
              value={editedOrder.discounted_price || ''}
              onChange={(e) => onChange('discounted_price', parseFloat(e.target.value))}
              className="w-full"
            />
          ) : (
            order.discounted_price ? `₹${order.discounted_price}` : '-'
          )}
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
          {isEditing ? (
            <Input
              value={editedOrder.payment_confirmation || ''}
              onChange={(e) => onChange('payment_confirmation', e.target.value)}
              className="w-full"
            />
          ) : (
            order.payment_confirmation || '-'
          )}
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
          {isEditing ? (
            <Input
              value={editedOrder.next_payment_details || ''}
              onChange={(e) => onChange('next_payment_details', e.target.value)}
              className="w-full"
            />
          ) : (
            order.next_payment_details || '-'
          )}
        </TableCell>
      )}
      {visibleColumns.additionalDetails && (
        <TableCell>
          {isEditing ? (
            <Input
              value={editedOrder.additional_details || ''}
              onChange={(e) => onChange('additional_details', e.target.value)}
              className="w-full"
            />
          ) : (
            order.additional_details || '-'
          )}
        </TableCell>
      )}
    </>
  );
};