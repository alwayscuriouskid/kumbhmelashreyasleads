import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { OrderDateFilters } from "./OrderDateFilters";
import { TableColumnToggle } from "@/components/shared/TableColumnToggle";

interface OrdersFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (value: string) => void;
  teamMemberFilter: string;
  setTeamMemberFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  columns: { key: string; label: string }[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (key: string) => void;
  teamMembers: any[];
  onDateFilterChange: (type: string, date: Date | undefined) => void;
}

export const OrdersFilters = ({
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  teamMemberFilter,
  setTeamMemberFilter,
  searchQuery,
  setSearchQuery,
  columns,
  visibleColumns,
  onToggleColumn,
  teamMembers,
  onDateFilterChange,
}: OrdersFiltersProps) => {
  return (
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

      <OrderDateFilters onDateFilterChange={onDateFilterChange} />

      <TableColumnToggle
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
      />
    </div>
  );
};