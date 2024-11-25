import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const TeamPerformance = () => {
  const { data: teamData, isLoading } = useQuery({
    queryKey: ['team-performance'],
    queryFn: async () => {
      console.log('Fetching team performance data');
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          team_members (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching team performance:', ordersError);
        throw ordersError;
      }

      // Group and aggregate by team member
      const teamStats = orders.reduce((acc: any, curr) => {
        if (!curr.team_member_id || !curr.team_members?.name) return acc;
        
        const memberName = curr.team_members.name;
        
        if (!acc[memberName]) {
          acc[memberName] = {
            name: memberName,
            activities: 0,
            completionRate: 0,
            avgResponseTime: 0,
            totalOrders: 0,
            confirmedOrders: 0
          };
        }

        acc[memberName].activities += 1;
        acc[memberName].totalOrders += 1;
        if (curr.status === 'approved') {
          acc[memberName].confirmedOrders += 1;
        }

        return acc;
      }, {});

      // Calculate completion rates
      return Object.values(teamStats).map((member: any) => ({
        ...member,
        completionRate: Math.round((member.confirmedOrders / member.totalOrders) * 100) || 0,
        avgResponseTime: "2.5 hours" // This could be calculated from actual data if available
      }));
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-6">
            {teamData?.map((member: any) => (
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
                    <span className="text-muted-foreground">Total Orders:</span>
                    <span className="ml-1">{member.totalOrders}</span>
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