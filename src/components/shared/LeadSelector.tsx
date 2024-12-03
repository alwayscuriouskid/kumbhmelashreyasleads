import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface LeadSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const LeadSelector = ({ value, onChange, className }: LeadSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: leads = [] } = useQuery({
    queryKey: ['leads-for-selector'],
    queryFn: async () => {
      console.log('Fetching leads for selector');
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('id, client_name, contact_person')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching leads:', error);
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in leads query:', error);
        return [];
      }
    }
  });

  // Filter leads based on search query
  const filteredLeads = leads.filter(lead => 
    lead.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contact_person.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLead = leads.find(lead => lead.id === value);

  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select lead">
            {selectedLead ? `${selectedLead.client_name} (${selectedLead.contact_person})` : "Select lead"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredLeads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>
                {lead.client_name} ({lead.contact_person})
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};