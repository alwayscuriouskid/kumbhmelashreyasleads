import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { hour: '9AM', calls: 4, meetings: 1, emails: 3 },
  { hour: '10AM', calls: 2, meetings: 2, emails: 5 },
  { hour: '11AM', calls: 3, meetings: 1, emails: 2 },
  { hour: '12PM', calls: 1, meetings: 3, emails: 4 },
  { hour: '1PM', calls: 2, meetings: 0, emails: 1 },
  { hour: '2PM', calls: 5, meetings: 2, emails: 3 },
  { hour: '3PM', calls: 3, meetings: 1, emails: 2 },
  { hour: '4PM', calls: 4, meetings: 2, emails: 4 },
  { hour: '5PM', calls: 2, meetings: 1, emails: 3 },
];

const DailyActivityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calls" fill="#3b82f6" name="Calls" />
              <Bar dataKey="meetings" fill="#22c55e" name="Meetings" />
              <Bar dataKey="emails" fill="#f59e0b" name="Emails" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyActivityChart;