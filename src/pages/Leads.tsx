import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Lead } from "@/types/leads";
import LeadsHeader from "@/components/leads/LeadsHeader";
import LeadsFilters from "@/components/leads/LeadsFilters";
import LeadsTable from "@/components/leads/LeadsTable";
import LeadForm from "@/components/leads/LeadForm";
import ImportLeadsDialog from "@/components/leads/ImportLeadsDialog";
import { useLeads } from "@/hooks/useLeads";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Leads = () => {
  const { leads, isLoading, error, addLead, updateLead } = useLeads();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [locationFilter, setLocationFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [customStatuses, setCustomStatuses] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    date: false,
    clientName: true,
    location: false,
    contactPerson: false,
    phone: false,
    email: false,
    requirements: true,
    status: true,
    teamMember: true,
    leadRef: false,
    leadSource: false,
    priceQuoted: false,
    activityType: false,
    activityOutcome: false,
    activityNextAction: false,
    activityNextActionDate: false
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current auth session in Leads:", session?.user?.email, error);
    };
    checkAuth();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('Real-time update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['leads'] });
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const handleAddLead = async (newLead: Partial<Lead>) => {
    await addLead.mutateAsync({
      ...newLead,
      requirement: newLead.requirement || {},
      date: newLead.date || new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    await updateLead.mutateAsync(updatedLead);
  };

  const handleAddCustomStatus = (status: string) => {
    setCustomStatuses(prev => [...prev, status]);
  };

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const filteredLeads = leads
    .filter(lead => statusFilter === "all" || lead.status === statusFilter)
    .filter(lead => {
      if (dateFilter) {
        const leadDate = new Date(lead.date);
        return leadDate.toDateString() === dateFilter.toDateString();
      }
      return true;
    })
    .filter(lead => 
      locationFilter ? lead.location.toLowerCase().includes(locationFilter.toLowerCase()) : true
    )
    .filter(lead =>
      searchQuery
        ? lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-lg">Loading leads...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error in Leads component:", error);
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="text-lg text-red-500">
          Error loading leads. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)] pr-6">
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

      <ImportLeadsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={() => {
          queryClient.invalidateQueries({ queryKey: ['leads'] });
        }}
      />

      <LeadsHeader 
        onAddNew={() => setShowAddForm(true)}
        onImport={() => setShowImportDialog(true)}
      />

      <LeadsFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />

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
