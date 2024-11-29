import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LeadConversionChartProps {
  data?: any[];
}

const LeadConversionChart = ({ data = [] }: LeadConversionChartProps) => {
  console.log("Rendering LeadConversionChart with data:", data);

  const monthlyData = data.reduce((acc: Record<string, any>, lead) => {
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

  const chartData = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
    name: month,
    conversions: Math.round((data.converted / data.total) * 100)
  }));

  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Conversion Trends (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
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