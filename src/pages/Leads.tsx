import { useState } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lead } from "@/types/leads";
import LeadRow from "@/components/leads/LeadRow";
import { useToast } from "@/components/ui/use-toast";
import LeadsTableFilters from "@/components/leads/LeadsTableFilters";
import LeadForm from "@/components/leads/LeadForm";
import { Input } from "@/components/ui/input";

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
    followUps: []
  }
];

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customStatuses, setCustomStatuses] = useState<string[]>([]);
  const { toast } = useToast();
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

  const handleAddCustomStatus = (status: string) => {
    if (!customStatuses.includes(status)) {
      setCustomStatuses(prev => [...prev, status]);
      toast({
        title: "Status Added",
        description: `New status "${status}" has been added successfully.`,
      });
    }
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    toast({
      title: "Lead Updated",
      description: "The lead has been successfully updated.",
    });
  };

  const handleAddLead = (newLead: Partial<Lead>) => {
    const leadToAdd: Lead = {
      ...newLead as Lead,
      id: `${Date.now()}`,
      followUps: [],
    };
    setLeads(prev => [leadToAdd, ...prev]);
    setShowAddForm(false);
    toast({
      title: "Lead Added",
      description: "The new lead has been successfully added.",
    });
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const filteredLeads = leads
    .filter(lead => statusFilter === "all" || lead.status === statusFilter)
    .filter(lead =>
      searchQuery
        ? lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h1 className="text-2xl font-bold">Leads Management</h1>
            <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowAddForm(true)} className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
            </div>
          </div>

          {/* Add Form Section */}
          {showAddForm && (
            <div className="mb-6">
              <LeadForm
                onSubmit={handleAddLead}
                onCancel={() => setShowAddForm(false)}
                customStatuses={customStatuses}
              />
            </div>
          )}

          {/* Filters Section */}
          <LeadsTableFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            customStatuses={customStatuses}
            onAddCustomStatus={handleAddCustomStatus}
          />

          {/* Table Section with horizontal scroll */}
          <div className="border rounded-lg">
            <ScrollArea className="w-full" type="always">
              <div className="min-w-max">
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <LeadRow 
                        key={lead.id} 
                        lead={lead} 
                        visibleColumns={visibleColumns}
                        onUpdate={handleUpdateLead}
                        customStatuses={customStatuses}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Leads;
