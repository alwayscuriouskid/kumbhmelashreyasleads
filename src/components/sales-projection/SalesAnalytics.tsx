import { useState } from "react";
import { SalesFilters, DateRangeType } from "./filters/SalesFilters";
import { SalesCharts } from "./charts/SalesCharts";
import { SalesMetrics } from "./metrics/SalesMetrics";
import { useSalesData } from "./analytics/useSalesData";

export const SalesAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRangeType>("today");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedInventoryType, setSelectedInventoryType] = useState<string>("all");

  const { data: salesData, isLoading } = useSalesData(
    dateRange,
    startDate,
    endDate,
    selectedInventoryType
  );

  if (!salesData) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lead Analytics Dashboard</h1>
      </div>

      <div className="space-y-4">
        <SalesFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedInventoryType={selectedInventoryType}
          setSelectedInventoryType={setSelectedInventoryType}
          inventoryTypes={salesData.inventoryPerformance}
        />

        <SalesMetrics
          totalRevenue={salesData.totalRevenue}
          totalSales={salesData.totalSales}
          totalAvailableInventory={salesData.totalAvailableInventory}
        />

        <SalesCharts
          teamPerformance={salesData.teamPerformance}
          inventoryPerformance={salesData.inventoryPerformance}
        />
      </div>
    </div>
  );
};