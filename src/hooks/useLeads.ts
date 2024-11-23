import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadDB, dbToFrontend, frontendToDB } from "@/types/leads";
import { useToast } from "@/hooks/use-toast";

// Dummy data for development preview
const dummyLeads: Lead[] = [
  {
    id: "1",
    date: new Date().toISOString().split('T')[0],
    clientName: "ABC Corp",
    location: "Mumbai",
    contactPerson: "Raj Kumar",
    phone: "9876543210",
    email: "raj@abccorp.com",
    requirement: {
      hoardings: 5,
      entryGates: 2,
      foodStalls: 3
    },
    status: "prospect",
    remarks: "Interested in event setup",
    budget: "₹500,000",
    leadSource: "Website",
    nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextAction: "Schedule meeting",
    followUpOutcome: "Positive initial contact",
    followUps: [],
    activities: [
      {
        id: "a1",
        type: "call",
        date: new Date().toISOString(),
        outcome: "Initial contact made",
        notes: "Client showed interest in our services",
        assignedTo: "John Smith",
        contactPerson: "Raj Kumar",
        description: "Follow-up call about proposal"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    date: new Date().toISOString().split('T')[0],
    clientName: "XYZ Ltd",
    location: "Delhi",
    contactPerson: "Priya Singh",
    phone: "8765432109",
    email: "priya@xyzltd.com",
    requirement: {
      ledHoardingSpots: 3,
      skyBalloons: 1,
      webSeries: 1
    },
    status: "negotiation",
    remarks: "Budget discussion pending",
    budget: "₹750,000",
    leadSource: "Referral",
    nextFollowUp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextAction: "Follow up on proposal",
    followUpOutcome: "Reviewing proposal",
    followUps: [],
    activities: [
      {
        id: "a2",
        type: "meeting",
        date: new Date().toISOString(),
        outcome: "Proposal presented",
        notes: "Client requested detailed pricing",
        assignedTo: "Sarah Johnson",
        contactPerson: "Priya Singh",
        description: "Initial requirements gathering"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useLeads = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: leads = dummyLeads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      console.log("Fetching leads from database");
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        return dummyLeads;
      }

      const fetchedLeads = (data as LeadDB[]).map(dbToFrontend);
      console.log("Fetched leads:", fetchedLeads);
      return fetchedLeads.length > 0 ? fetchedLeads : dummyLeads;
    }
  });

  const addLead = useMutation({
    mutationFn: async (newLead: Partial<Lead>) => {
      console.log("Adding new lead:", newLead);
      try {
        const dbLead = frontendToDB(newLead);
        console.log("Converted lead for DB:", dbLead);
        
        const { data, error } = await supabase
          .from('leads')
          .insert(dbLead)
          .select()
          .single();

        if (error) {
          console.error("Error adding lead:", error);
          throw error;
        }

        return dbToFrontend(data as LeadDB);
      } catch (error) {
        console.error("Error in addLead mutation:", error);
        if (error instanceof Error) {
          throw new Error(`Failed to add lead: ${error.message}`);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead Added",
        description: "New lead has been successfully added.",
      });
    },
    onError: (error) => {
      console.error("Error in addLead mutation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateLead = useMutation({
    mutationFn: async (updatedLead: Lead) => {
      console.log("Updating lead:", updatedLead);
      try {
        const dbLead = frontendToDB(updatedLead);
        console.log("Converted lead for DB update:", dbLead);

        const { data, error } = await supabase
          .from('leads')
          .update(dbLead)
          .eq('id', updatedLead.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating lead:", error);
          throw error;
        }

        return dbToFrontend(data as LeadDB);
      } catch (error) {
        console.error("Error in updateLead mutation:", error);
        if (error instanceof Error) {
          throw new Error(`Failed to update lead: ${error.message}`);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "Lead Updated",
        description: "Lead has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Error in updateLead mutation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    leads,
    isLoading,
    addLead,
    updateLead
  };
};
