import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

const LeadStatusChart = () => {
  const { data: statusData } = useQuery({
    queryKey: ['lead-status-distribution'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('status');

      if (error) throw error;

      // Count leads by status
      const statusCounts = leads.reduce((acc: Record<string, number>, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});

      // Transform for chart
      return Object.entries(statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
        value
      }));
    }
  });

  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {statusData?.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadStatusChart;