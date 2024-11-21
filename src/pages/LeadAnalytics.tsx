import { Card } from "@/components/ui/card";
import LeadMetrics from "@/components/analytics/LeadMetrics";
import LeadStatusChart from "@/components/analytics/LeadStatusChart";
import LeadSourceChart from "@/components/analytics/LeadSourceChart";
import ActivityTimeline from "@/components/analytics/ActivityTimeline";

const LeadAnalytics = () => {
  console.log("Rendering LeadAnalytics page"); // Added for debugging

  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
      <h1 className="text-3xl font-bold mb-6">Lead Analytics Dashboard</h1>
      
      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <LeadMetrics />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <LeadStatusChart />
        </Card>
        <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <LeadSourceChart />
        </Card>
      </div>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ActivityTimeline />
      </Card>
    </div>
  );
};

export default LeadAnalytics;