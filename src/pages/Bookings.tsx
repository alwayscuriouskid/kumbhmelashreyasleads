import { useBookings } from "@/hooks/useInventory";
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
import { format } from "date-fns";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TableColumnToggle } from "@/components/shared/TableColumnToggle";
import { CreateBookingDialog } from "@/components/bookings/CreateBookingDialog";

const Bookings = () => {
  const { data: bookings, isLoading, refetch } = useBookings();
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamMemberFilter, setTeamMemberFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<Date>();
  const [visibleColumns, setVisibleColumns] = useState({
    itemType: true,
    customer: true,
    teamMember: true,
    startDate: true,
    endDate: true,
    paymentStatus: true,
    status: true,
    inventoryDetails: true,
  });

  const columns = [
    { key: "itemType", label: "Item Type" },
    { key: "customer", label: "Customer" },
    { key: "teamMember", label: "Team Member" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "status", label: "Status" },
    { key: "inventoryDetails", label: "Inventory Details" },
  ];

  // Get unique team members
  const teamMembers = Array.from(new Set(bookings?.map(booking => booking.team_member_name) || []));

  // Filter bookings
  const filteredBookings = bookings?.filter(booking => {
    if (statusFilter !== "all" && booking.status !== statusFilter) return false;
    if (teamMemberFilter !== "all" && booking.team_member_name !== teamMemberFilter) return false;
    if (searchQuery && !booking.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (dateRange && new Date(booking.start_date).toDateString() !== dateRange.toDateString()) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <CreateBookingDialog onSuccess={refetch} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
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
                  <SelectItem value="tentative">Tentative</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={teamMemberFilter} onValueChange={setTeamMemberFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  {teamMembers.map(member => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[250px]"
              />

              <DatePicker
                selected={dateRange}
                onSelect={setDateRange}
                placeholderText="Filter by date"
              />
            </div>

            <TableColumnToggle
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={(key) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }))}
            />

            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.itemType && <TableHead>Item Type</TableHead>}
                  {visibleColumns.customer && <TableHead>Customer</TableHead>}
                  {visibleColumns.teamMember && <TableHead>Team Member</TableHead>}
                  {visibleColumns.startDate && <TableHead>Start Date</TableHead>}
                  {visibleColumns.endDate && <TableHead>End Date</TableHead>}
                  {visibleColumns.paymentStatus && <TableHead>Payment Status</TableHead>}
                  {visibleColumns.status && <TableHead>Status</TableHead>}
                  {visibleColumns.inventoryDetails && <TableHead>Inventory Details</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings?.map((booking) => (
                    <TableRow key={booking.id}>
                      {visibleColumns.itemType && (
                        <TableCell>
                          {booking.inventory_items?.inventory_types?.name}
                        </TableCell>
                      )}
                      {visibleColumns.customer && (
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.teamMember && <TableCell>{booking.team_member_name}</TableCell>}
                      {visibleColumns.startDate && (
                        <TableCell>
                          {format(new Date(booking.start_date), "PPP")}
                        </TableCell>
                      )}
                      {visibleColumns.endDate && (
                        <TableCell>
                          {format(new Date(booking.end_date), "PPP")}
                        </TableCell>
                      )}
                      {visibleColumns.paymentStatus && (
                        <TableCell>
                          <Badge
                            variant={
                              booking.payment_status === "paid"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {booking.payment_status}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.status && (
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "confirmed"
                                ? "default"
                                : booking.status === "tentative"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.inventoryDetails && (
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              Type: {booking.inventory_items?.inventory_types?.name}
                            </div>
                            {booking.payment_amount && (
                              <div className="text-sm text-muted-foreground">
                                Amount: ₹{booking.payment_amount}
                              </div>
                            )}
                          </div>
                        </TableCell>
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

export default Bookings;
