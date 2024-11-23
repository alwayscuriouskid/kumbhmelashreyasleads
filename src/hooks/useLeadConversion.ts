import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useLeadConversion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      leadId, 
      conversionType, 
      status = 'converted' 
    }: { 
      leadId: string; 
      conversionType: 'order' | 'booking'; 
      status?: string;
    }) => {
      console.log('Converting lead:', { leadId, conversionType, status });
      
      const { error } = await supabase
        .from('leads')
        .update({
          conversion_status: status,
          conversion_type: conversionType,
          conversion_date: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads-for-selector'] });
      toast({
        title: "Lead Converted",
        description: "Lead has been successfully converted.",
      });
    },
    onError: (error) => {
      console.error('Error converting lead:', error);
      toast({
        title: "Error",
        description: "Failed to convert lead. Please try again.",
        variant: "destructive",
      });
    }
  });
};