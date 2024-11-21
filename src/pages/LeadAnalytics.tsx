import { Card } from "@/components/ui/card";
import LeadMetrics from "@/components/analytics/LeadMetrics";
import LeadStatusChart from "@/components/analytics/LeadStatusChart";
import LeadSourceChart from "@/components/analytics/LeadSourceChart";
import ActivityTimeline from "@/components/analytics/ActivityTimeline";
import LeadConversionChart from "@/components/analytics/LeadConversionChart";

const LeadAnalytics = () => {
  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
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
        <LeadConversionChart />
      </Card>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ActivityTimeline />
      </Card>
    </div>
  );
};

export default LeadAnalytics;