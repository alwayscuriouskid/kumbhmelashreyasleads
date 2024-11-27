import { TableCell } from "@/components/ui/table";
import { EditableCell } from "@/components/inventory/EditableCell";
import { PaymentStatusCell } from "../cells/PaymentStatusCell";
import { OrderStatusCell } from "../cells/OrderStatusCell";
import { InventoryItemsCell } from "../cells/InventoryItemsCell";
import { NextPaymentDateCell } from "../cells/NextPaymentDateCell";
import { Order } from "@/types/inventory";
import { updateOrderPaymentStatus } from "../utils/paymentStatusManager";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

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
  const [localEditedOrder, setLocalEditedOrder] = useState(editedOrder);

  useEffect(() => {
    setLocalEditedOrder(editedOrder);
  }, [editedOrder]);

  const handlePaymentStatusChange = async (value: string) => {
    try {
      await updateOrderPaymentStatus(order.id, value as 'pending' | 'partially_pending' | 'finished');
      onChange('payment_status', value);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleChange = (field: keyof Order, value: any) => {
    setLocalEditedOrder(prev => ({
      ...prev,
      [field]: value
    }));
    onChange(field, value);
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
              value={localEditedOrder.customer_name || ''}
              onChange={(e) => handleChange('customer_name', e.target.value)}
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
              value={localEditedOrder.discounted_price || ''}
              onChange={(e) => handleChange('discounted_price', parseFloat(e.target.value))}
              className="w-full"
            />
          ) : (
            localEditedOrder.discounted_price ? `₹${localEditedOrder.discounted_price}` : '-'
          )}
        </TableCell>
      )}
      {visibleColumns.totalAmount && (
        <TableCell>₹{order.total_amount}</TableCell>
      )}
      {visibleColumns.paymentStatus && (
        <TableCell>
          <PaymentStatusCell
            value={isEditing ? localEditedOrder.payment_status || 'pending' : order.payment_status || 'pending'}
            isEditing={isEditing}
            onChange={handlePaymentStatusChange}
          />
        </TableCell>
      )}
      {visibleColumns.orderStatus && (
        <TableCell>
          <OrderStatusCell
            value={isEditing ? localEditedOrder.status : order.status}
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
          {isEditing ? (
            <Input
              value={localEditedOrder.payment_confirmation || ''}
              onChange={(e) => handleChange('payment_confirmation', e.target.value)}
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
            value={localEditedOrder.next_payment_date || order.next_payment_date}
            onChange={(value) => handleChange('next_payment_date', value)}
          />
        </TableCell>
      )}
      {visibleColumns.nextPaymentDetails && (
        <TableCell>
          {isEditing ? (
            <Input
              value={localEditedOrder.next_payment_details || ''}
              onChange={(e) => handleChange('next_payment_details', e.target.value)}
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
              value={localEditedOrder.additional_details || ''}
              onChange={(e) => handleChange('additional_details', e.target.value)}
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