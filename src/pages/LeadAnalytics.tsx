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
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Lead, LeadDB, dbToFrontend } from "@/types/leads";

interface Filters {
  timeRange: string;
  startDate?: Date;
  endDate?: Date;
}

const LeadAnalytics = () => {
  const [filters, setFilters] = useState<Filters>({
    timeRange: "today",
  });

  const getDateRange = (timeRange: string, startDate?: Date, endDate?: Date) => {
    const now = new Date();
    
    switch (timeRange) {
      case "today":
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return {
          start: startOfDay(yesterday),
          end: endOfDay(yesterday)
        };
      case "thisWeek":
        return {
          start: startOfWeek(now),
          end: endOfWeek(now)
        };
      case "lastWeek":
        const lastWeek = subDays(now, 7);
        return {
          start: startOfWeek(lastWeek),
          end: endOfWeek(lastWeek)
        };
      case "thisMonth":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case "custom":
        if (startDate && endDate) {
          return {
            start: startOfDay(startDate),
            end: endOfDay(endDate)
          };
        }
        return null;
      default:
        return null;
    }
  };

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['lead-analytics', filters],
    queryFn: async () => {
      console.log("Fetching analytics data with filters:", filters);
      
      const dateRange = getDateRange(filters.timeRange, filters.startDate, filters.endDate);
      console.log("Calculated date range:", dateRange);

      let query = supabase
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

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start.toISOString())
          .lte('created_at', dateRange.end.toISOString());
      }

      const { data: leads, error } = await query;

      if (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
      }

      console.log("Fetched leads data:", leads);
      
      // Transform the data using dbToFrontend and ensure proper typing
      return (leads || []).map(lead => {
        const transformedLead = dbToFrontend(lead as LeadDB);
        return {
          ...transformedLead,
          activities: lead.activities,
          team_members: lead.team_members
        };
      }) as (Lead & { activities: any[]; team_members: any })[];
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
            <LeadMetrics data={analyticsData} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <LeadStatusChart data={analyticsData} />
          </Card>
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <LeadConversionChart data={analyticsData} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <DetailedLeadMetrics data={analyticsData} />
            </Card>
          </div>
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <ActivityTimeline isLoading={isLoading} data={analyticsData} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadAnalytics;