import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamActivityTable from "@/components/analytics/TeamActivityTable";
import PendingActionsTab from "@/components/analytics/PendingActionsTab";

const TeamActivities = () => {
  return (
    <div className="space-y-4 w-full max-w-[calc(100vw-280px)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Activities</h1>
      </div>

      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="pending">Pending Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="activities">
          <Card className="p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TeamActivityTable />
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <PendingActionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamActivities;