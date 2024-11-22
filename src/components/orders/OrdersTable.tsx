import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Order } from "@/types/inventory";
import { EditableCell } from "@/components/inventory/EditableCell";
import { TableActions } from "@/components/inventory/TableActions";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  visibleColumns: Record<string, boolean>;
  teamMembers: any[];
  onOrderUpdate: () => void;
}

export const OrdersTable = ({ orders, isLoading, visibleColumns, teamMembers, onOrderUpdate }: OrdersTableProps) => {
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Order>>({});

  const handleEdit = (orderId: string, order: Order) => {
    setEditingOrder(orderId);
    setEditedValues(order);
  };

  const handleSave = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(editedValues)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });
      
      setEditingOrder(null);
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
    setEditingOrder(null);
    setEditedValues({});
  };

  const handleCellChange = (field: keyof Order, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.orderId && <TableHead>Order ID</TableHead>}
          {visibleColumns.date && <TableHead>Date</TableHead>}
          {visibleColumns.customer && <TableHead>Customer</TableHead>}
          {visibleColumns.teamMember && <TableHead>Team Member</TableHead>}
          {visibleColumns.totalAmount && <TableHead>Total Amount</TableHead>}
          {visibleColumns.paymentStatus && <TableHead>Payment Status</TableHead>}
          {visibleColumns.orderStatus && <TableHead>Order Status</TableHead>}
          {visibleColumns.inventoryItems && <TableHead>Inventory Items</TableHead>}
          {visibleColumns.paymentConfirmation && <TableHead>Payment Confirmation</TableHead>}
          {visibleColumns.nextPaymentDate && <TableHead>Next Payment Date</TableHead>}
          {visibleColumns.nextPaymentDetails && <TableHead>Next Payment Details</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={12} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : (
          orders?.map((order) => (
            <TableRow key={order.id}>
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
                      value={editingOrder === order.id ? editedValues.customer_name || '' : order.customer_name || ''}
                      isEditing={editingOrder === order.id}
                      onChange={(value) => handleCellChange('customer_name', value)}
                    />
                    <EditableCell
                      value={editingOrder === order.id ? editedValues.customer_email || '' : order.customer_email || ''}
                      isEditing={editingOrder === order.id}
                      onChange={(value) => handleCellChange('customer_email', value)}
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
                <TableCell>
                  <EditableCell
                    value={editingOrder === order.id ? editedValues.total_amount || order.total_amount : order.total_amount}
                    isEditing={editingOrder === order.id}
                    onChange={(value) => handleCellChange('total_amount', value)}
                    type="number"
                  />
                </TableCell>
              )}
              {visibleColumns.paymentStatus && (
                <TableCell>
                  <Badge
                    variant={
                      order.payment_status === "paid"
                        ? "default"
                        : order.payment_status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {order.payment_status}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.orderStatus && (
                <TableCell>
                  <Badge
                    variant={
                      order.status === "approved"
                        ? "default"
                        : order.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.inventoryItems && (
                <TableCell>
                  <div className="space-y-1">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="text-sm">
                        {item.inventory_items?.inventory_types?.name} - ₹{item.price}
                      </div>
                    ))}
                  </div>
                </TableCell>
              )}
              {visibleColumns.paymentConfirmation && (
                <TableCell>
                  <EditableCell
                    value={editingOrder === order.id ? editedValues.payment_confirmation || '' : order.payment_confirmation || ''}
                    isEditing={editingOrder === order.id}
                    onChange={(value) => handleCellChange('payment_confirmation', value)}
                  />
                </TableCell>
              )}
              {visibleColumns.nextPaymentDate && (
                <TableCell>
                  {order.next_payment_date && format(new Date(order.next_payment_date), "PPP")}
                </TableCell>
              )}
              {visibleColumns.nextPaymentDetails && (
                <TableCell>
                  <EditableCell
                    value={editingOrder === order.id ? editedValues.next_payment_details || '' : order.next_payment_details || ''}
                    isEditing={editingOrder === order.id}
                    onChange={(value) => handleCellChange('next_payment_details', value)}
                  />
                </TableCell>
              )}
              <TableCell>
                <TableActions
                  isEditing={editingOrder === order.id}
                  onEdit={() => handleEdit(order.id, order)}
                  onSave={() => handleSave(order.id)}
                  onCancel={handleCancel}
                  onDelete={() => {}}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};