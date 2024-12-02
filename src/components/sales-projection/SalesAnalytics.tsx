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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const SalesAnalytics = () => {
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [minRevenue, setMinRevenue] = useState<string>("");
  const [maxRevenue, setMaxRevenue] = useState<string>("");
  const [selectedInventoryType, setSelectedInventoryType] = useState<string>("all");
  const [minSales, setMinSales] = useState<string>("");
  const [maxSales, setMaxSales] = useState<string>("");

  const { data: salesData } = useQuery({
    queryKey: ["sales-projection-analytics", dateRange, startDate, endDate, minRevenue, maxRevenue, selectedInventoryType, minSales, maxSales],
    queryFn: async () => {
      console.log("Fetching sales data with filters:", {
        dateRange,
        startDate,
        endDate,
        minRevenue,
        maxRevenue,
        selectedInventoryType,
        minSales,
        maxSales
      });

      let query = supabase
        .from("sales_projection_entries")
        .select(`
          *,
          sales_projection_inventory (
            name,
            landing_cost,
            minimum_price
          )
        `);

      // Apply date filters
      if (dateRange !== "all") {
        const now = new Date();
        let start = now;
        let end = now;

        switch (dateRange) {
          case "today":
            start = new Date(now.setHours(0, 0, 0, 0));
            end = new Date(now.setHours(23, 59, 59, 999));
            break;
          case "week":
            start = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            start = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case "custom":
            if (startDate) query = query.gte("sale_date", startDate.toISOString());
            if (endDate) query = query.lte("sale_date", endDate.toISOString());
            break;
        }

        if (dateRange !== "custom") {
          query = query.gte("sale_date", start.toISOString());
          query = query.lte("sale_date", end.toISOString());
        }
      }

      const { data: entries, error } = await query;

      if (error) throw error;

      // Apply revenue and sales filters in memory
      let filteredEntries = entries.filter((entry: any) => {
        const revenue = entry.quantity_sold * entry.selling_price;
        const meetsMinRevenue = !minRevenue || revenue >= parseFloat(minRevenue);
        const meetsMaxRevenue = !maxRevenue || revenue <= parseFloat(maxRevenue);
        const meetsMinSales = !minSales || entry.quantity_sold >= parseFloat(minSales);
        const meetsMaxSales = !maxSales || entry.quantity_sold <= parseFloat(maxSales);
        const meetsInventoryType = selectedInventoryType === "all" || entry.sales_projection_inventory.name === selectedInventoryType;

        return meetsMinRevenue && meetsMaxRevenue && meetsMinSales && meetsMaxSales && meetsInventoryType;
      });

      // Calculate analytics
      const teamPerformance = filteredEntries.reduce((acc: any, entry: any) => {
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

      const inventoryPerformance = filteredEntries.reduce((acc: any, entry: any) => {
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
        totalRevenue: filteredEntries.reduce(
          (sum: number, entry: any) =>
            sum + entry.quantity_sold * entry.selling_price,
          0
        ),
        totalSales: filteredEntries.reduce(
          (sum: number, entry: any) => sum + entry.quantity_sold,
          0
        ),
      };
    },
  });

  if (!salesData) return null;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Refine your sales analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              {dateRange === "custom" && (
                <div className="flex gap-2 mt-2">
                  <DatePicker
                    selected={startDate}
                    onSelect={setStartDate}
                    placeholderText="Start date"
                  />
                  <DatePicker
                    selected={endDate}
                    onSelect={setEndDate}
                    placeholderText="End date"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Revenue Range (₹)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minRevenue}
                  onChange={(e) => setMinRevenue(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxRevenue}
                  onChange={(e) => setMaxRevenue(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sales Range (Units)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minSales}
                  onChange={(e) => setMinSales(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxSales}
                  onChange={(e) => setMaxSales(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Inventory Type</label>
              <Select value={selectedInventoryType} onValueChange={setSelectedInventoryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select inventory type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {salesData.inventoryPerformance.map((item: any) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{salesData.totalRevenue.toFixed(2)}</div>
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