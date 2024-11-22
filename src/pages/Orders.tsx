import { useOrders } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateOrderDialog } from "@/components/orders/CreateOrderDialog";
import { useState } from "react";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const filteredOrders = orders?.filter((order) => {
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
            <OrdersFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              paymentStatusFilter={paymentStatusFilter}
              setPaymentStatusFilter={setPaymentStatusFilter}
              teamMemberFilter={teamMemberFilter}
              setTeamMemberFilter={setTeamMemberFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
              teamMembers={teamMembers || []}
              onDateFilterChange={handleDateFilterChange}
            />
            
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <OrdersTable
                orders={filteredOrders || []}
                isLoading={isLoading}
                visibleColumns={visibleColumns}
                teamMembers={teamMembers || []}
                onOrderUpdate={refetch}
              />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;