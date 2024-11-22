import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lead } from "@/types/leads";
import { useToast } from "@/components/ui/use-toast";
import LeadsHeader from "@/components/leads/LeadsHeader";
import LeadsFilters from "@/components/leads/LeadsFilters";
import LeadsTable from "@/components/leads/LeadsTable";
import LeadForm from "@/components/leads/LeadForm";

const mockLeads: Lead[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
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
    ],
    activities: [],
    createdAt: "2024-02-20T10:00:00Z",
    updatedAt: "2024-02-20T10:00:00Z",
    score: 75
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
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
    followUps: [],
    activities: [],
    createdAt: "2024-02-21T09:00:00Z",
    updatedAt: "2024-02-21T09:00:00Z",
    score: 90
  }
];

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [customStatuses, setCustomStatuses] = useState<string[]>([]);
  const { toast } = useToast();
  const [visibleColumns, setVisibleColumns] = useState({
    date: false,
    clientName: false,
    location: true,
    contactPerson: true,
    phone: false,
    email: false,
    requirements: false,
    status: false,
    remarks: true,
    nextFollowUp: false,
    budget: false,
    leadRef: true,
    leadSource: true,
    priceQuoted: true,
    nextAction: true,
    followUpOutcome: true
  });

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
  };

  const handleAddLead = (newLead: Partial<Lead>) => {
    const leadToAdd: Lead = {
      ...newLead as Lead,
      id: crypto.randomUUID(), // Generate proper UUID
      followUps: [],
    };
    setLeads(prev => [leadToAdd, ...prev]);
    setShowAddForm(false);
    toast({
      title: "Lead Added",
      description: "The new lead has been successfully added.",
    });
  };

  const handleAddCustomStatus = (status: string) => {
    console.log("Adding new custom status:", status);
    setCustomStatuses(prev => {
      if (!prev.includes(status)) {
        return [...prev, status];
      }
      return prev;
    });
    toast({
      title: "Status Added",
      description: `New status "${status}" has been added successfully.`,
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
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <LeadForm
            onSubmit={handleAddLead}
            onCancel={() => setShowAddForm(false)}
            customStatuses={customStatuses}
            onAddCustomStatus={handleAddCustomStatus}
          />
        </DialogContent>
      </Dialog>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full">
          <LeadsHeader
            onAddNew={() => setShowAddForm(true)}
          />

          <LeadsFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            customStatuses={customStatuses}
          />
        </div>
      </Card>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full">
          <LeadsTable
            leads={filteredLeads}
            visibleColumns={visibleColumns}
            onUpdateLead={handleUpdateLead}
            customStatuses={customStatuses}
          />
        </div>
      </Card>
    </div>
  );
};

export default Leads;
