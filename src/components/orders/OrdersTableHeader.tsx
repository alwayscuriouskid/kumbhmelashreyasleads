import { TableHead } from "@/components/ui/table";

interface OrdersTableHeaderProps {
  visibleColumns: Record<string, boolean>;
}

export const OrdersTableHeader = ({ visibleColumns }: OrdersTableHeaderProps) => {
  return (
    <>
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
      <TableHead className="sticky right-0 bg-background z-20">Actions</TableHead>
    </>
  );
};