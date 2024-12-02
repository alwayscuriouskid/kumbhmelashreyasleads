import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const SalesAnalytics = () => {
  const { data: salesData } = useQuery({
    queryKey: ["sales-projection-analytics"],
    queryFn: async () => {
      // Fetch sales entries with inventory details
      const { data: entries, error } = await supabase
        .from("sales_projection_entries")
        .select(`
          *,
          sales_projection_inventory (
            name,
            landing_cost,
            minimum_price
          )
        `);

      if (error) throw error;

      // Calculate analytics
      const teamPerformance = entries.reduce((acc: any, entry) => {
        if (!acc[entry.team_location]) {
          acc[entry.team_location] = {
            team: entry.team_location,
            totalSales: 0,
            totalRevenue: 0,
          };
        }
        acc[entry.team_location].totalSales += entry.quantity_sold;
        acc[entry.team_location].totalRevenue +=
          entry.quantity_sold * entry.selling_price;
        return acc;
      }, {});

      const inventoryPerformance = entries.reduce((acc: any, entry) => {
        const name = entry.sales_projection_inventory.name;
        if (!acc[name]) {
          acc[name] = {
            name,
            totalSold: 0,
            revenue: 0,
          };
        }
        acc[name].totalSold += entry.quantity_sold;
        acc[name].revenue += entry.quantity_sold * entry.selling_price;
        return acc;
      }, {});

      return {
        teamPerformance: Object.values(teamPerformance),
        inventoryPerformance: Object.values(inventoryPerformance),
        totalRevenue: entries.reduce(
          (sum: number, entry: any) =>
            sum + entry.quantity_sold * entry.selling_price,
          0
        ),
        totalSales: entries.reduce(
          (sum: number, entry: any) => sum + entry.quantity_sold,
          0
        ),
      };
    },
  });

  if (!salesData) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{salesData.totalRevenue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.totalSales} units</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Sales by team location</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData.teamPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalSales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>Sales by inventory type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData.inventoryPerformance}
                  dataKey="totalSold"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {salesData.inventoryPerformance.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};