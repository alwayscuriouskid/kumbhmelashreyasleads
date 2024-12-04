import { useLeadQueries } from "./leads/useLeadQueries";
import { useLeadMutations } from "./leads/useLeadMutations";

export const useLeads = () => {
  console.log("Initializing useLeads hook");
  const { data: leads = [], isLoading, error } = useLeadQueries();
  const { addLead, updateLead } = useLeadMutations();

  return {
    leads,
    isLoading,
    error,
    addLead,
    updateLead
  };
};