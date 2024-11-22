import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const DailyActivityChart = () => {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['daily-activity-metrics'],
    queryFn: async () => {
      // Fetch data from our inventory_detailed_metrics view
      const { data, error } = await supabase
        .from('inventory_detailed_metrics')
        .select('*')
        .order('date', { ascending: true })
        .limit(7); // Last 7 days

      if (error) {
        console.error('Error fetching daily activity metrics:', error);
        throw error;
      }

      // Transform the data for the chart
      return data.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        sales: item.items_sold || 0,
        revenue: item.revenue || 0,
        orders: item.total_orders || 0
      }));
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
              <Bar dataKey="sales" fill="#3b82f6" name="Items Sold" />
              <Bar dataKey="orders" fill="#22c55e" name="Orders" />
              <Bar dataKey="revenue" fill="#f59e0b" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyActivityChart;