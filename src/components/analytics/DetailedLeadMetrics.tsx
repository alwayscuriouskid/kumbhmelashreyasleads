import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";

const DetailedLeadMetrics = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['detailed-lead-metrics', timeRange, startDate, endDate],
    queryFn: async () => {
      console.log("Fetching detailed lead metrics with filters:", { timeRange, startDate, endDate });
      
      // For preview, return dummy data
      return {
        totalLeads: 120,
        activeLeads: 85,
        conversionRate: 24,
        avgBudget: 650000,
        requirementTypes: {
          hoardings: 45,
          entryGates: 32,
          ledHoardingSpots: 28,
          foodStalls: 25,
          skyBalloons: 20,
          webSeries: 15,
          changingRooms: 12,
          activationZoneStalls: 10
        }
      };
    }
  });

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Lead Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((metrics?.activeLeads || 0) / (metrics?.totalLeads || 1) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics?.activeLeads} active out of {metrics?.totalLeads} total leads
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Avg. Budget Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{(metrics?.avgBudget || 0).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Average budget per lead
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">Requirements</CardTitle>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            {timeRange === "custom" && (
              <div className="flex gap-2">
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  placeholderText="Start date"
                />
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  placeholderText="End date"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {metrics?.requirementTypes && Object.entries(metrics.requirementTypes)
              .sort(([, a], [, b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex justify-between items-center p-2 rounded-lg border">
                  <span className="text-sm capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-bold">{count}</span>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedLeadMetrics;