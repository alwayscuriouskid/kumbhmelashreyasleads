import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { day: 'Mon', totalActivities: 12, completedTasks: 8, pendingFollowUps: 4 },
  { day: 'Tue', totalActivities: 15, completedTasks: 10, pendingFollowUps: 5 },
  { day: 'Wed', totalActivities: 18, completedTasks: 12, pendingFollowUps: 6 },
  { day: 'Thu', totalActivities: 14, completedTasks: 9, pendingFollowUps: 5 },
  { day: 'Fri', totalActivities: 16, completedTasks: 11, pendingFollowUps: 5 },
];

const WeeklyActivityChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalActivities" 
                stroke="#3b82f6" 
                name="Total Activities"
              />
              <Line 
                type="monotone" 
                dataKey="completedTasks" 
                stroke="#22c55e" 
                name="Completed Tasks"
              />
              <Line 
                type="monotone" 
                dataKey="pendingFollowUps" 
                stroke="#f59e0b" 
                name="Pending Follow-ups"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyActivityChart;