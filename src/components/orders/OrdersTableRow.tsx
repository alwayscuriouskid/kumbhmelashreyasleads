import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Order } from "@/types/inventory";
import { EditableCell } from "@/components/inventory/EditableCell";
import { TableActions } from "@/components/inventory/TableActions";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

  const handleCellChange = (field: keyof Order, value: string) => {
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
          {format(new Date(order.created_at), "PPP")}
        </TableCell>
      )}
      {visibleColumns.customer && (
        <TableCell>
          <div className="space-y-1">
            <EditableCell
              value={isEditing ? editedValues.customer_name || '' : order.customer_name || ''}
              isEditing={isEditing}
              onChange={(value) => handleCellChange('customer_name', value)}
            />
            <EditableCell
              value={isEditing ? editedValues.customer_email || '' : order.customer_email || ''}
              isEditing={isEditing}
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
            value={isEditing ? editedValues.total_amount?.toString() || '' : order.total_amount?.toString() || ''}
            isEditing={isEditing}
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
      <TableCell className="sticky right-0 bg-background/80 backdrop-blur-sm">
        <TableActions
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={() => {}}
        />
      </TableCell>
    </TableRow>
  );
};