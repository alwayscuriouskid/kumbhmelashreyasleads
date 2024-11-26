import { Card } from "@/components/ui/card";
import TeamActivityTable from "@/components/analytics/TeamActivityTable";

const TeamActivities = () => {
  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Activities</h1>
      </div>

      <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TeamActivityTable />
      </Card>
    </div>
  );
};

export default TeamActivities;