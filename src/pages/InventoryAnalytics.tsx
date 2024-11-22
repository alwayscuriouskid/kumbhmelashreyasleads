import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersAnalytics } from "@/components/analytics/inventory/OrdersAnalytics";
import { BookingsAnalytics } from "@/components/analytics/inventory/BookingsAnalytics";
import { StatusAnalytics } from "@/components/analytics/inventory/StatusAnalytics";
import { DetailedInventoryAnalyticsTable } from "@/components/analytics/inventory/DetailedInventoryAnalyticsTable";
import { AnalyticsFilters } from "@/components/analytics/inventory/AnalyticsFilters";

const InventoryAnalytics = () => {
  const [zoneFilter, setZoneFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Analytics</h1>
      </div>

      <AnalyticsFilters
        zoneFilter={zoneFilter}
        typeFilter={typeFilter}
        onZoneFilterChange={setZoneFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <Tabs defaultValue="detailed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="status">Status Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders Analysis</TabsTrigger>
          <TabsTrigger value="bookings">Bookings Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed">
          <DetailedInventoryAnalyticsTable />
        </TabsContent>

        <TabsContent value="status">
          <StatusAnalytics zoneFilter={zoneFilter} typeFilter={typeFilter} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersAnalytics />
        </TabsContent>

        <TabsContent value="bookings">
          <BookingsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryAnalytics;