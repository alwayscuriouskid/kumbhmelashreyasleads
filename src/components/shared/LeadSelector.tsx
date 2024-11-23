import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const LeadSelector = ({ value, onChange, className }: LeadSelectorProps) => {
  const { data: leads } = useQuery({
    queryKey: ['leads-for-selector'],
    queryFn: async () => {
      console.log('Fetching leads for selector');
      const { data, error } = await supabase
        .from('leads')
        .select('id, client_name, contact_person')
        .is('conversion_status', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select lead (optional)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">No lead selected</SelectItem>
        {leads?.map((lead) => (
          <SelectItem key={lead.id} value={lead.id}>
            {lead.client_name} ({lead.contact_person})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};