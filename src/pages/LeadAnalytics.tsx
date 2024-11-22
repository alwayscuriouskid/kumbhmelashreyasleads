import { Card } from "@/components/ui/card";
import LeadMetrics from "@/components/analytics/LeadMetrics";
import LeadStatusChart from "@/components/analytics/LeadStatusChart";
import LeadSourceChart from "@/components/analytics/LeadSourceChart";
import ActivityTimeline from "@/components/analytics/ActivityTimeline";
import ActivityFilters from "@/components/analytics/ActivityFilters";
import DailyActivityChart from "@/components/analytics/DailyActivityChart";
import WeeklyActivityChart from "@/components/analytics/WeeklyActivityChart";
import TeamPerformance from "@/components/analytics/TeamPerformance";
import DetailedLeadMetrics from "@/components/analytics/DetailedLeadMetrics";
import LeadActionNotifications from "@/components/analytics/LeadActionNotifications";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  timeRange: string;
  startDate?: Date;
  endDate?: Date;
}

const LeadAnalytics = () => {
  const [filters, setFilters] = useState<Filters>({
    timeRange: "today",
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['lead-analytics', filters],
    queryFn: async () => {
      console.log("Fetching analytics data with filters:", filters);
      
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');

      if (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
      }

      // Process the data based on filters
      const filteredLeads = leads?.filter(lead => {
        const leadDate = new Date(lead.created_at);
        if (filters.timeRange === "today") {
          const today = new Date();
          return leadDate.toDateString() === today.toDateString();
        }
        // Add more filter conditions as needed
        return true;
      });

      console.log("Filtered analytics data:", filteredLeads);
      return filteredLeads || [];
    }
  });

  console.log("Analytics filters updated:", filters);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Analytics Dashboard</h1>
      </div>

      <ActivityFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <LeadMetrics />
          </Card>
        </div>
        <div>
          <LeadActionNotifications />
        </div>
      </div>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <DetailedLeadMetrics />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyActivityChart />
        <WeeklyActivityChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <LeadStatusChart />
        </Card>
        <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <LeadSourceChart />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeamPerformance />
        <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <ActivityTimeline />
        </Card>
      </div>
    </div>
  );
};

export default LeadAnalytics;