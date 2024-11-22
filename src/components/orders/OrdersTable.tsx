import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types/inventory";
import { OrdersTableHeader } from "./OrdersTableHeader";
import { OrdersTableRow } from "./OrdersTableRow";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  visibleColumns: Record<string, boolean>;
  teamMembers: any[];
  onOrderUpdate: () => void;
}

export const OrdersTable = ({ 
  orders, 
  isLoading, 
  visibleColumns,
  teamMembers,
  onOrderUpdate 
}: OrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <OrdersTableHeader visibleColumns={visibleColumns} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={12} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={12} className="text-center">
              No orders found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <OrdersTableRow
              key={order.id}
              order={order}
              visibleColumns={visibleColumns}
              teamMembers={teamMembers}
              onOrderUpdate={onOrderUpdate}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};