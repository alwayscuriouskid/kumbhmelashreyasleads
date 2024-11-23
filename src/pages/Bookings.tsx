import { useBookings } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TableColumnToggle } from "@/components/shared/TableColumnToggle";
import { CreateBookingDialog } from "@/components/bookings/CreateBookingDialog";
import { BookingTableRow } from "@/components/bookings/BookingTableRow";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    status: true,
    inventoryDetails: true,
    paymentAmount: true,
  });

  const columns = [
    { key: "itemType", label: "Item Type" },
    { key: "customer", label: "Customer" },
    { key: "teamMember", label: "Team Member" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status" },
    { key: "inventoryDetails", label: "Inventory Details" },
    { key: "paymentAmount", label: "Payment Amount" },
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
    <div className="p-8 space-y-4 w-full max-w-[calc(100vw-280px)]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <CreateBookingDialog onSuccess={refetch} />
      </div>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="px-0">
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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

            <ScrollArea className="h-[calc(100vh-24rem)] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleColumns.itemType && <TableHead>Item Type</TableHead>}
                    {visibleColumns.customer && <TableHead>Customer</TableHead>}
                    {visibleColumns.teamMember && <TableHead>Team Member</TableHead>}
                    {visibleColumns.startDate && <TableHead>Start Date</TableHead>}
                    {visibleColumns.endDate && <TableHead>End Date</TableHead>}
                    {visibleColumns.status && <TableHead>Status</TableHead>}
                    {visibleColumns.inventoryDetails && <TableHead>Inventory Details</TableHead>}
                    {visibleColumns.paymentAmount && <TableHead>Payment Amount</TableHead>}
                    <TableHead className="sticky right-0 bg-background z-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings?.map((booking) => (
                      <BookingTableRow
                        key={booking.id}
                        booking={booking}
                        visibleColumns={visibleColumns}
                        onBookingUpdate={refetch}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;