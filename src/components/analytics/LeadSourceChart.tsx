import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Website', value: 40 },
  { name: 'Referral', value: 30 },
  { name: 'Cold Call', value: 20 },
  { name: 'Social', value: 15 },
  { name: 'Other', value: 10 },
];

const LeadSourceChart = () => {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Leads by Source</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadSourceChart;