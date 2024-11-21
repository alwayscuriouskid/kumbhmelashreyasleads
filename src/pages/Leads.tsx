import { useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";

interface Lead {
  id: string;
  date: string;
  clientName: string;
  location: string;
  requirement: {
    hoardings?: number;
    entryGates?: number;
    electricPoles?: number;
    watchTowers?: number;
    chargingPoints?: number;
    skyBalloons?: number;
  };
  status: "pending" | "approved" | "rejected";
  remarks: string;
}

const mockLeads: Lead[] = [
  {
    id: "1",
    date: "2024-02-20",
    clientName: "ABC Corp",
    location: "Mumbai Central",
    requirement: {
      hoardings: 5,
      electricPoles: 100,
      chargingPoints: 10
    },
    status: "pending",
    remarks: "Interested in prime locations"
  },
  {
    id: "2",
    date: "2024-02-21",
    clientName: "XYZ Ltd",
    location: "Andheri East",
    requirement: {
      entryGates: 2,
      watchTowers: 1,
      skyBalloons: 1
    },
    status: "approved",
    remarks: "Contract signed"
  }
];

const Leads = () => {
  const [leads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLeads = statusFilter === "all" 
    ? leads 
    : leads.filter(lead => lead.status === statusFilter);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <div className="flex gap-4">
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
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>{lead.date}</TableCell>
                  <TableCell className="font-medium">{lead.clientName}</TableCell>
                  <TableCell>{lead.location}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {lead.requirement.hoardings && (
                        <div>Hoardings: {lead.requirement.hoardings}</div>
                      )}
                      {lead.requirement.entryGates && (
                        <div>Entry Gates: {lead.requirement.entryGates}</div>
                      )}
                      {lead.requirement.electricPoles && (
                        <div>Electric Poles: {lead.requirement.electricPoles}</div>
                      )}
                      {lead.requirement.watchTowers && (
                        <div>Watch Towers: {lead.requirement.watchTowers}</div>
                      )}
                      {lead.requirement.chargingPoints && (
                        <div>Charging Points: {lead.requirement.chargingPoints}</div>
                      )}
                      {lead.requirement.skyBalloons && (
                        <div>Sky Balloons: {lead.requirement.skyBalloons}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                      lead.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{lead.remarks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Leads;