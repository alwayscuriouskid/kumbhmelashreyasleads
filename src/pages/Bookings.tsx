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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

const Bookings = () => {
  const { data: bookings, isLoading } = useBookings();
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamMemberFilter, setTeamMemberFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<Date>();

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
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Booking
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Team Member</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings?.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {booking.inventory_items?.inventory_types?.name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.team_member_name}</TableCell>
                    <TableCell>
                      {format(new Date(booking.start_date), "PPP")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.end_date), "PPP")}
                    </TableCell>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;