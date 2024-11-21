import { useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Lead } from "@/types/leads";
import LeadRow from "@/components/leads/LeadRow";

const mockLeads: Lead[] = [
  {
    id: "1",
    date: "2024-02-20",
    clientName: "ABC Corp",
    location: "Mumbai Central",
    contactPerson: "John Doe",
    phone: "+91 9876543210",
    email: "john@abccorp.com",
    requirement: {
      hoardings: 5,
      electricPoles: 100,
      chargingPoints: 10
    },
    status: "pending",
    remarks: "Interested in prime locations",
    nextFollowUp: "2024-02-25",
    budget: "₹500,000",
    followUps: [
      {
        id: "f1",
        date: "2024-02-18",
        notes: "Initial meeting - Client showed interest in hoardings",
        outcome: "Positive response",
        nextFollowUpDate: "2024-02-25"
      }
    ]
  },
  {
    id: "2",
    date: "2024-02-21",
    clientName: "XYZ Ltd",
    location: "Andheri East",
    contactPerson: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane@xyzltd.com",
    requirement: {
      entryGates: 2,
      watchTowers: 1,
      skyBalloons: 1
    },
    status: "approved",
    remarks: "Contract signed",
    budget: "₹750,000",
    followUps: [] // Added empty followUps array
  }
];

const Leads = () => {
  const [leads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    clientName: true,
    location: true,
    contactPerson: true,
    phone: true,
    email: true,
    requirements: true,
    status: true,
    remarks: true,
    nextFollowUp: true,
    budget: true
  });

  const filteredLeads = statusFilter === "all" 
    ? leads 
    : leads.filter(lead => lead.status === statusFilter);

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 border rounded-lg space-y-4">
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
                  <SelectItem value="followup">Follow Up</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1">
                <Input placeholder="Search by client name, location, or contact person..." />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Visible Columns:</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(visibleColumns).map(([column, isVisible]) => (
                  <div key={column} className="flex items-center space-x-2">
                    <Checkbox 
                      id={column} 
                      checked={isVisible}
                      onCheckedChange={() => toggleColumn(column as keyof typeof visibleColumns)}
                    />
                    <label htmlFor={column} className="text-sm capitalize">
                      {column.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <ScrollArea className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                {visibleColumns.date && <TableHead>Date</TableHead>}
                {visibleColumns.clientName && <TableHead>Client Name</TableHead>}
                {visibleColumns.location && <TableHead>Location</TableHead>}
                {visibleColumns.contactPerson && <TableHead>Contact Person</TableHead>}
                {visibleColumns.phone && <TableHead>Phone</TableHead>}
                {visibleColumns.email && <TableHead>Email</TableHead>}
                {visibleColumns.requirements && <TableHead>Requirements</TableHead>}
                {visibleColumns.status && <TableHead>Status</TableHead>}
                {visibleColumns.remarks && <TableHead>Remarks</TableHead>}
                {visibleColumns.nextFollowUp && <TableHead>Next Follow Up</TableHead>}
                {visibleColumns.budget && <TableHead>Budget</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <LeadRow 
                  key={lead.id} 
                  lead={lead} 
                  visibleColumns={visibleColumns}
                />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default Leads;
