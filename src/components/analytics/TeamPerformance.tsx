import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const teamData = [
  { 
    name: "John Doe",
    activities: 45,
    completionRate: 85,
    avgResponseTime: "2.5 hours",
    activeLeads: 12
  },
  { 
    name: "Jane Smith",
    activities: 38,
    completionRate: 92,
    avgResponseTime: "1.8 hours",
    activeLeads: 15
  },
  { 
    name: "Mike Johnson",
    activities: 42,
    completionRate: 78,
    avgResponseTime: "3.2 hours",
    activeLeads: 10
  },
];

const TeamPerformance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-6">
            {teamData.map((member) => (
              <div key={member.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{member.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {member.activities} activities
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span>{member.completionRate}%</span>
                  </div>
                  <Progress value={member.completionRate} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Avg Response Time:</span>
                    <span className="ml-1">{member.avgResponseTime}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Leads:</span>
                    <span className="ml-1">{member.activeLeads}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;