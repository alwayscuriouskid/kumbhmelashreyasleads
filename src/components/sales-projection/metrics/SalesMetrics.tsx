import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesMetricsProps {
  totalRevenue: number;
  totalSales: number;
  totalAvailableInventory: number;
  selectedInventoryMetrics?: {
    totalAmountVsLanding: number;
    totalAmountVsMin: number;
    totalPLVsLanding: string;
    totalPLVsMin: string;
  };
  selectedInventoryType: string;
}

export const SalesMetrics = ({ 
  totalRevenue, 
  totalSales, 
  totalAvailableInventory,
  selectedInventoryMetrics,
  selectedInventoryType
}: SalesMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
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

      {selectedInventoryType !== 'all' && selectedInventoryMetrics && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount vs Landing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{selectedInventoryMetrics.totalAmountVsLanding.toFixed(2)}</div>
              <p className={`text-sm ${Number(selectedInventoryMetrics.totalPLVsLanding) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedInventoryMetrics.totalPLVsLanding}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount vs Min</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{selectedInventoryMetrics.totalAmountVsMin.toFixed(2)}</div>
              <p className={`text-sm ${Number(selectedInventoryMetrics.totalPLVsMin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedInventoryMetrics.totalPLVsMin}%
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};