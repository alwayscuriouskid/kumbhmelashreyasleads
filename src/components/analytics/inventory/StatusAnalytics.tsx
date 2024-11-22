import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface StatusMetric {
  status: string;
  count: number;
}

export const StatusAnalytics = ({ zoneFilter, typeFilter }: { zoneFilter: string; typeFilter: string }) => {
  const { data: statusMetrics } = useQuery<StatusMetric[]>({
    queryKey: ['inventory-status-metrics', zoneFilter, typeFilter],
    queryFn: async () => {
      console.log('Fetching inventory status metrics');
      let query = supabase
        .from('inventory_items')
        .select('status', { count: 'exact', head: false });
      
      if (zoneFilter !== 'all') {
        query = query.eq('sectors.zone_id', zoneFilter);
      }
      if (typeFilter !== 'all') {
        query = query.eq('type_id', typeFilter);
      }

      const { data, error } = await query
        .select('status')
        .select('status', { count: 'exact' })
        .groupBy('status');
      
      if (error) {
        console.error('Error fetching inventory status metrics:', error);
        throw error;
      }
      
      return data.map(row => ({
        status: row.status,
        count: Number(row.count || 0)
      }));
    },
  });

  const statusData = statusMetrics?.map(metric => ({
    status: metric.status,
    value: metric.count
  })) || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};