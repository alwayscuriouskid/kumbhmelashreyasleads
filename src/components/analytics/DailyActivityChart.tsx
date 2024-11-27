import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const DailyActivityChart = () => {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['daily-activity-metrics'],
    queryFn: async () => {
      console.log("Fetching daily activity metrics");
      
      const { data: activities, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group activities by date
      const groupedData = activities.reduce((acc: any, activity) => {
        const date = format(new Date(activity.created_at), 'EEE');
        if (!acc[date]) {
          acc[date] = {
            date,
            sales: 0,
            revenue: 0,
            orders: 0
          };
        }
        acc[date].sales++;
        if (activity.type === 'order') {
          acc[date].orders++;
        }
        return acc;
      }, {});

      return Object.values(groupedData);
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="Activities" />
              <Bar dataKey="orders" fill="#22c55e" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyActivityChart;