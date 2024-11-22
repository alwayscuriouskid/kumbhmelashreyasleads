import { useOrders, useInventoryItems, useInventoryTypes, useSectors, useZones } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { 
  ReceiptText, 
  TrendingUp, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";

const InventoryAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTeamMember, setSelectedTeamMember] = useState("all");

  // Fetch base data
  const { data: orders } = useOrders();
  const { data: items } = useInventoryItems();
  const { data: types } = useInventoryTypes();
  const { data: zones } = useZones();

  // Fetch detailed metrics
  const { data: detailedMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['inventory-detailed-metrics', timeRange],
    queryFn: async () => {
      console.log('Fetching detailed metrics with timeRange:', timeRange);
      const { data, error } = await supabase
        .from('inventory_detailed_metrics')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching metrics:', error);
        throw error;
      }

      console.log('Fetched metrics:', data);
      return data;
    },
  });

  // Calculate summary metrics
  const totalRevenue = detailedMetrics?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;
  const totalItems = items?.length || 0;
  const totalSold = detailedMetrics?.reduce((sum, m) => sum + (m.items_sold || 0), 0) || 0;
  const averagePrice = totalSold > 0 ? totalRevenue / totalSold : 0;

  // Filter metrics based on selections
  const filteredMetrics = detailedMetrics?.filter(metric => {
    if (selectedZone !== "all" && metric.zone_id !== selectedZone) return false;
    if (selectedType !== "all" && metric.type_id !== selectedType) return false;
    if (selectedTeamMember !== "all" && metric.team_member_id !== selectedTeamMember) return false;
    return true;
  });

  // Prepare chart data
  const revenueChartData = filteredMetrics?.map(m => ({
    date: format(new Date(m.date), 'MMM dd'),
    revenue: m.revenue || 0,
    items: m.items_sold || 0,
    orders: m.total_orders || 0,
  }));

  const typeDistribution = items?.reduce((acc, item) => {
    const type = types?.find(t => t.id === item.type_id)?.name || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Analytics</h1>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              {zones?.map(zone => (
                <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types?.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSold}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{averagePrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.2%</div>
            <p className="text-xs text-muted-foreground">
              +8.1% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue & Sales Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#revenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Type Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(typeDistribution || {}).map(([name, value]) => ({
                        name,
                        value,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(typeDistribution || {}).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Type</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="item_type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="items_sold" fill="#8884d8" name="Items Sold" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Zone</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="items_sold" fill="#8884d8" name="Items Sold" />
                    <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels by Type</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={types}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_quantity" fill="#8884d8" name="Total Quantity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="items_sold" stroke="#8884d8" name="Items Sold" />
                    <Line type="monotone" dataKey="total_orders" stroke="#82ca9d" name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="team_member_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_orders" fill="#8884d8" name="Total Orders" />
                    <Bar dataKey="completed_orders" fill="#82ca9d" name="Completed Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue_growth_percent" stroke="#8884d8" name="Growth %" />
                    <Line type="monotone" dataKey="weekly_avg_revenue" stroke="#82ca9d" name="Weekly Avg Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryAnalytics;