import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', conversions: 65 },
  { name: 'Feb', conversions: 59 },
  { name: 'Mar', conversions: 80 },
  { name: 'Apr', conversions: 81 },
  { name: 'May', conversions: 56 },
  { name: 'Jun', conversions: 55 },
];

const LeadConversionChart = () => {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Conversion Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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