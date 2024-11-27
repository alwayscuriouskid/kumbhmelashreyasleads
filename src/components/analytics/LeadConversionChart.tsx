import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LeadConversionChart = () => {
  const { data: conversionData } = useQuery({
    queryKey: ['lead-conversion-trends'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('created_at, conversion_status')
        .order('created_at');

      if (error) throw error;

      // Group leads by month and calculate conversion rates
      const monthlyData = leads.reduce((acc: Record<string, any>, lead) => {
        const month = new Date(lead.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { total: 0, converted: 0 };
        }
        acc[month].total++;
        if (lead.conversion_status === 'converted') {
          acc[month].converted++;
        }
        return acc;
      }, {});

      // Transform for chart
      return Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
        name: month,
        conversions: Math.round((data.converted / data.total) * 100)
      }));
    }
  });

  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Conversion Trends (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={conversionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="conversions" stroke="#3b82f6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadConversionChart;