import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersAnalytics } from "@/components/analytics/inventory/OrdersAnalytics";
import { BookingsAnalytics } from "@/components/analytics/inventory/BookingsAnalytics";
import { StatusAnalytics } from "@/components/analytics/inventory/StatusAnalytics";
import { DetailedInventoryAnalyticsTable } from "@/components/analytics/inventory/DetailedInventoryAnalyticsTable";
import { InventoryAvailabilityFilters } from "@/components/analytics/inventory/InventoryAvailabilityFilters";

const InventoryAnalytics = () => {
  const [zoneFilter, setZoneFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Analytics</h1>
      </div>

      <InventoryAvailabilityFilters
        zoneFilter={zoneFilter}
        sectorFilter={sectorFilter}
        typeFilter={typeFilter}
        onZoneFilterChange={setZoneFilter}
        onSectorFilterChange={setSectorFilter}
        onTypeFilterChange={setTypeFilter}
      />

      <Tabs defaultValue="availability" className="space-y-4">
        <TabsList>
          <TabsTrigger value="availability">Available Inventory</TabsTrigger>
          <TabsTrigger value="status">Status Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders Analysis</TabsTrigger>
          <TabsTrigger value="bookings">Bookings Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
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