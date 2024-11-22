import { useOrders } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateOrderDialog } from "@/components/orders/CreateOrderDialog";
import { format } from "date-fns";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { TableColumnToggle } from "@/components/shared/TableColumnToggle";
import { OrderDateFilters } from "@/components/orders/OrderDateFilters";
import type { Order } from "@/types/inventory";

const Orders = () => {
  const { data: orders, isLoading, refetch } = useOrders();
  const { data: teamMembers } = useTeamMembers();
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamMemberFilter, setTeamMemberFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderDate, setOrderDate] = useState<Date>();
  const [nextPaymentDate, setNextPaymentDate] = useState<Date>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [visibleColumns, setVisibleColumns] = useState({
    orderId: true,
    date: true,
    customer: true,
    teamMember: true,
    totalAmount: true,
    paymentStatus: true,
    orderStatus: true,
    inventoryItems: true,
    paymentConfirmation: true,
    nextPaymentDate: true,
    nextPaymentDetails: true,
  });

  const columns = [
    { key: "orderId", label: "Order ID" },
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    { key: "teamMember", label: "Team Member" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "orderStatus", label: "Order Status" },
    { key: "inventoryItems", label: "Inventory Items" },
    { key: "paymentConfirmation", label: "Payment Confirmation" },
    { key: "nextPaymentDate", label: "Next Payment Date" },
    { key: "nextPaymentDetails", label: "Next Payment Details" },
  ];

  const handleDateFilterChange = (type: string, date: Date | undefined) => {
    if (type === "orderDate") {
      setOrderDate(date);
    } else {
      setNextPaymentDate(date);
    }
  };

  // Filter orders
  const filteredOrders = orders?.filter((order: Order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (teamMemberFilter !== "all" && order.team_member_id !== teamMemberFilter) return false;
    if (paymentStatusFilter !== "all" && order.payment_status !== paymentStatusFilter) return false;
    if (searchQuery && !order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (orderDate && new Date(order.created_at).toDateString() !== orderDate.toDateString()) return false;
    if (nextPaymentDate && order.next_payment_date && 
        new Date(order.next_payment_date).toDateString() !== nextPaymentDate.toDateString()) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <CreateOrderDialog onSuccess={refetch} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={teamMemberFilter} onValueChange={setTeamMemberFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  {teamMembers?.map(member => (
                    <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[250px]"
              />
            </div>

            <OrderDateFilters onDateFilterChange={handleDateFilterChange} />

            <TableColumnToggle
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
            />

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders?.map((order) => (
                    <TableRow key={order.id}>
                      {visibleColumns.orderId && <TableCell>{order.id}</TableCell>}
                      {visibleColumns.date && (
                        <TableCell>
                          {format(new Date(order.created_at), "PPP")}
                        </TableCell>
                      )}
                      {visibleColumns.customer && (
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.teamMember && (
                        <TableCell>
                          {teamMembers?.find(member => member.id === order.team_member_id)?.name}
                        </TableCell>
                      )}
                      {visibleColumns.totalAmount && <TableCell>₹{order.total_amount}</TableCell>}
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
                        <TableCell>{order.payment_confirmation}</TableCell>
                      )}
                      {visibleColumns.nextPaymentDate && (
                        <TableCell>
                          {order.next_payment_date && format(new Date(order.next_payment_date), "PPP")}
                        </TableCell>
                      )}
                      {visibleColumns.nextPaymentDetails && (
                        <TableCell>{order.next_payment_details}</TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;