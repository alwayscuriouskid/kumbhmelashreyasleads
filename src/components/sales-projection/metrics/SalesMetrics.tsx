import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesMetricsProps {
  totalRevenue: number;
  totalSales: number;
  totalAvailableInventory: number;
}

export const SalesMetrics = ({ totalRevenue, totalSales, totalAvailableInventory }: SalesMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSales} units</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAvailableInventory} units</div>
        </CardContent>
      </Card>
    </div>
  );
};