import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface Lead {
  id: string;
  client_name: string;
  contact_person: string;
}

export const LeadSelector = ({ value, onChange, className }: LeadSelectorProps) => {
  const [open, setOpen] = useState(false);

  const { data: leads, isLoading } = useQuery<Lead[]>({
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
        
        console.log('Fetched leads:', data);
        return data || [];
      } catch (error) {
        console.error('Error in leads query:', error);
        return [];
      }
    },
    initialData: [] // Initialize with empty array
  });

  const safeLeads = leads || [];
  const selectedLead = safeLeads.find(lead => lead.id === value);

  if (isLoading) {
    return (
      <Button variant="outline" className={cn("w-full justify-between", className)} disabled>
        Loading leads...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedLead
            ? `${selectedLead.client_name} (${selectedLead.contact_person})`
            : "Select lead..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search leads..." />
          <CommandEmpty>No lead found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {safeLeads.map((lead) => (
              <CommandItem
                key={lead.id}
                onSelect={() => {
                  onChange(lead.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === lead.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {`${lead.client_name} (${lead.contact_person})`}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};