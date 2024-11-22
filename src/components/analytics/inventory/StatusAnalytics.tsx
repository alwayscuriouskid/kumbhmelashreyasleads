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

export const StatusAnalytics = ({ zoneFilter, typeFilter }: { zoneFilter: string; typeFilter: string }) => {
  const { data: statusMetrics } = useQuery({
    queryKey: ['inventory-status-metrics', zoneFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('inventory_status_metrics')
        .select('*');
      
      if (zoneFilter !== 'all') {
        query = query.eq('zone_id', zoneFilter);
      }
      if (typeFilter !== 'all') {
        query = query.eq('type_id', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const statusData = statusMetrics?.reduce((acc: any[], metric) => {
    const existingStatus = acc.find(item => item.status === metric.status);
    if (existingStatus) {
      existingStatus.value += metric.item_count;
    } else {
      acc.push({
        status: metric.status,
        value: metric.item_count
      });
    }
    return acc;
  }, []) || [];

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