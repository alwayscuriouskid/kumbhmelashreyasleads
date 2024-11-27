import { Card } from "@/components/ui/card";
import LeadMetrics from "@/components/analytics/LeadMetrics";
import LeadStatusChart from "@/components/analytics/LeadStatusChart";
import LeadConversionChart from "@/components/analytics/LeadConversionChart";
import DetailedLeadMetrics from "@/components/analytics/DetailedLeadMetrics";
import ActivityTimeline from "@/components/analytics/ActivityTimeline";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ActivityFilters from "@/components/analytics/ActivityFilters";

interface Filters {
  timeRange: string;
  startDate?: Date;
  endDate?: Date;
}

const LeadAnalytics = () => {
  const [filters, setFilters] = useState<Filters>({
    timeRange: "today",
  });

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['lead-analytics', filters],
    queryFn: async () => {
      console.log("Fetching analytics data with filters:", filters);
      
      // Fetch leads with related activities and team members
      const { data: leads, error } = await supabase
        .from('leads')
        .select(`
          *,
          activities (
            id,
            type,
            outcome,
            created_at
          ),
          team_members (
            name
          )
        `);

      if (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
      }

      // Filter based on timeRange
      const filteredLeads = leads?.filter(lead => {
        const leadDate = new Date(lead.created_at || '');
        const today = new Date();
        
        switch (filters.timeRange) {
          case "today":
            return leadDate.toDateString() === today.toDateString();
          case "thisWeek": {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return leadDate >= weekAgo;
          }
          case "thisMonth": {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return leadDate >= monthAgo;
          }
          case "custom":
            if (filters.startDate && filters.endDate) {
              return leadDate >= filters.startDate && leadDate <= filters.endDate;
            }
            return true;
          default:
            return true;
        }
      });

      console.log("Filtered analytics data:", filteredLeads);
      return filteredLeads || [];
    }
  });

  const handleFilterChange = (newFilters: Filters) => {
    console.log("Applying new filters:", newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Analytics Dashboard</h1>
      </div>

      <div className="space-y-4">
        <ActivityFilters onFilterChange={handleFilterChange} />
        
        <div className="lg:col-span-2">
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <LeadMetrics />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <LeadStatusChart />
          </Card>
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <LeadConversionChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <DetailedLeadMetrics />
            </Card>
          </div>
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <ActivityTimeline isLoading={isLoading} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadAnalytics;