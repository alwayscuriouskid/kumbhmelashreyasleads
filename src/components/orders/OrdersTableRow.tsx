import { useState } from "react";
import { TableRow } from "@/components/ui/table";
import { Order } from "@/types/inventory";
import { OrderRowCells } from "./table/OrderRowCells";
import { OrderRowActions } from "./table/OrderRowActions";

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

  const handleSuccess = () => {
    setIsEditing(false);
    onOrderUpdate();
  };

  return (
    <TableRow>
      <OrderRowCells
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        visibleColumns={visibleColumns}
        teamMembers={teamMembers}
        onChange={handleChange}
      />
      <OrderRowActions
        order={order}
        editedOrder={editedOrder}
        isEditing={isEditing}
        isUpdating={isUpdating}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </TableRow>
  );
};