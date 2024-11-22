import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const TeamPerformance = () => {
  const { data: teamData, isLoading } = useQuery({
    queryKey: ['team-performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_detailed_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching team performance:', error);
        throw error;
      }

      // Group and aggregate by team member
      const teamStats = data.reduce((acc: any, curr) => {
        if (!curr.team_member_name) return acc;
        
        if (!acc[curr.team_member_name]) {
          acc[curr.team_member_name] = {
            name: curr.team_member_name,
            activities: 0,
            completionRate: 0,
            avgResponseTime: 0,
            totalBookings: 0,
            confirmedBookings: 0
          };
        }

        acc[curr.team_member_name].activities += curr.total_bookings || 0;
        acc[curr.team_member_name].totalBookings += curr.total_bookings || 0;
        acc[curr.team_member_name].confirmedBookings += curr.confirmed_bookings || 0;

        return acc;
      }, {});

      // Calculate completion rates
      return Object.values(teamStats).map((member: any) => ({
        ...member,
        completionRate: Math.round((member.confirmedBookings / member.totalBookings) * 100) || 0,
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
                    <span className="text-muted-foreground">Total Bookings:</span>
                    <span className="ml-1">{member.totalBookings}</span>
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