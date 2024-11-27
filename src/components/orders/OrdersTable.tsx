import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { OrdersTableHeader } from "./OrdersTableHeader";
import { OrdersTableRow } from "./OrdersTableRow";
import { Order } from "@/types/inventory";
import { exportToExcel } from "@/utils/exportUtils";

interface OrdersTableProps {
  orders: Order[];
  teamMembers: any[];
  visibleColumns: Record<string, boolean>;
  onOrderUpdate: () => void;
}

export const OrdersTable = ({ orders, teamMembers, visibleColumns, onOrderUpdate }: OrdersTableProps) => {
  const handleExport = () => {
    try {
      const exportData = orders.map(order => ({
        'Order ID': order.id,
        Status: order.status,
        'Total Amount': order.total_amount,
        'Customer Name': order.customer_name,
        'Customer Email': order.customer_email,
        'Customer Phone': order.customer_phone,
        'Payment Status': order.payment_status,
        'Payment Method': order.payment_method,
        'Payment Date': order.payment_date,
        'Team Member': order.team_member_name,
        'Commission Amount': order.commission_amount,
        'Created At': order.created_at,
        'Updated At': order.updated_at,
      }));

      exportToExcel(exportData, 'orders-export');
      toast({
        title: "Export Successful",
        description: "The orders data has been exported to Excel",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export orders data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={handleExport}
          variant="outline"
          className="mb-4"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <OrdersTableHeader visibleColumns={visibleColumns} />
          <tbody>
            {orders.map((order) => (
              <OrdersTableRow
                key={order.id}
                order={order}
                visibleColumns={visibleColumns}
                teamMembers={teamMembers}
                onOrderUpdate={onOrderUpdate}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};