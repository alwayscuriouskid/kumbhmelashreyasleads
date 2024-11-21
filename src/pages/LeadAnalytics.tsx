import { Card } from "@/components/ui/card";
import LeadMetrics from "@/components/analytics/LeadMetrics";
import LeadStatusChart from "@/components/analytics/LeadStatusChart";
import LeadSourceChart from "@/components/analytics/LeadSourceChart";
import ActivityTimeline from "@/components/analytics/ActivityTimeline";
import ActivityFilters from "@/components/analytics/ActivityFilters";
import DailyActivityChart from "@/components/analytics/DailyActivityChart";
import WeeklyActivityChart from "@/components/analytics/WeeklyActivityChart";
import TeamPerformance from "@/components/analytics/TeamPerformance";
import TeamActivityTable from "@/components/analytics/TeamActivityTable";
import { useState } from "react";

interface Filters {
  timeRange: string;
  teamMember?: string;
  startDate?: Date;
  endDate?: Date;
}

const LeadAnalytics = () => {
  const [filters, setFilters] = useState<Filters>({
    timeRange: "today",
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
  };

  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Analytics Dashboard</h1>
      </div>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ActivityFilters onFilterChange={handleFilterChange} />
      </Card>
      
      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <LeadMetrics />
      </Card>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TeamActivityTable 
          selectedDate={filters.startDate} 
          selectedTeamMember={filters.teamMember}
        />
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