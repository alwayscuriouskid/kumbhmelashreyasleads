import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dummyData = [
  {
    date: 'Mon',
    sales: 45,
    revenue: 75000,
    orders: 12
  },
  {
    date: 'Tue',
    sales: 52,
    revenue: 85000,
    orders: 15
  },
  {
    date: 'Wed',
    sales: 48,
    revenue: 78000,
    orders: 14
  },
  {
    date: 'Thu',
    sales: 60,
    revenue: 92000,
    orders: 18
  },
  {
    date: 'Fri',
    sales: 55,
    revenue: 88000,
    orders: 16
  },
  {
    date: 'Sat',
    sales: 40,
    revenue: 65000,
    orders: 10
  },
  {
    date: 'Sun',
    sales: 35,
    revenue: 58000,
    orders: 8
  }
];

const DailyActivityChart = () => {
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['daily-activity-metrics'],
    queryFn: async () => {
      console.log("Fetching daily activity metrics");
      return dummyData;
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