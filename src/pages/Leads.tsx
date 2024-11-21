import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Lead } from "@/types/leads";
import { useToast } from "@/components/ui/use-toast";
import LeadsHeader from "@/components/leads/LeadsHeader";
import LeadsFilters from "@/components/leads/LeadsFilters";
import LeadsTable from "@/components/leads/LeadsTable";
import LeadForm from "@/components/leads/LeadForm";

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
    <div className="space-y-4">
      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1400px] mx-auto">
          <LeadsHeader
            onAddNew={() => setShowAddForm(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {showAddForm && (
            <div className="mb-6">
              <LeadForm
                onSubmit={handleAddLead}
                onCancel={() => setShowAddForm(false)}
                customStatuses={customStatuses}
              />
            </div>
          )}

          <LeadsFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            customStatuses={customStatuses}
            onAddCustomStatus={handleAddCustomStatus}
          />
        </div>
      </Card>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <LeadsTable
          leads={filteredLeads}
          visibleColumns={visibleColumns}
          onUpdateLead={handleUpdateLead}
          customStatuses={customStatuses}
        />
      </Card>
    </div>
  );
};

export default Leads;
