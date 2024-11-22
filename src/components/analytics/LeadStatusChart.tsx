import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Prospect', value: 45 },
  { name: 'Negotiation', value: 30 },
  { name: 'Analysis', value: 15 },
  { name: 'Conclusion', value: 20 },
  { name: 'Ongoing Order', value: 10 },
];

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

const LeadStatusChart = () => {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Leads by Status</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
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