import { useState } from "react";
import { SalesFilters, DateRangeType } from "./filters/SalesFilters";
import { SalesCharts } from "./charts/SalesCharts";
import { SalesMetrics } from "./metrics/SalesMetrics";
import { useSalesData, InventoryPerformanceType } from "./analytics/useSalesData";

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

  const inventoryTypesArray = Object.values(salesData.inventoryPerformance) as InventoryPerformanceType[];

  // Calculate total inventory quantity for the selected type
  const selectedInventoryData = selectedInventoryType !== 'all' 
    ? salesData.inventoryPerformance[selectedInventoryType]
    : null;

  const totalInventoryQuantity = selectedInventoryData
    ? selectedInventoryData.totalSold + selectedInventoryData.availableQuantity
    : inventoryTypesArray.reduce((sum, type) => sum + type.totalSold + type.availableQuantity, 0);

  // Calculate additional metrics for selected inventory type
  const selectedInventoryMetrics = selectedInventoryType !== 'all' ? (() => {
    const selectedInventory = salesData.inventoryPerformance[selectedInventoryType];
    if (!selectedInventory) return null;

    const totalAmountVsLanding = selectedInventory.revenue - (selectedInventory.totalSold * selectedInventory.landingCost);
    const totalAmountVsMin = selectedInventory.revenue - (selectedInventory.totalSold * selectedInventory.minimumPrice);
    
    const totalPLVsLanding = ((selectedInventory.revenue - (selectedInventory.totalSold * selectedInventory.landingCost)) / 
      (selectedInventory.totalSold * selectedInventory.landingCost) * 100).toFixed(2);
    
    const totalPLVsMin = ((selectedInventory.revenue - (selectedInventory.totalSold * selectedInventory.minimumPrice)) / 
      (selectedInventory.totalSold * selectedInventory.minimumPrice) * 100).toFixed(2);

    return {
      totalAmountVsLanding,
      totalAmountVsMin,
      totalPLVsLanding,
      totalPLVsMin
    };
  })() : undefined;

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
          inventoryTypes={inventoryTypesArray}
        />

        <SalesMetrics
          totalRevenue={salesData.totalRevenue}
          totalSales={salesData.totalSales}
          totalAvailableInventory={salesData.totalAvailableInventory}
          selectedInventoryMetrics={selectedInventoryMetrics}
          selectedInventoryType={selectedInventoryType}
          totalInventoryQuantity={totalInventoryQuantity}
        />

        <SalesCharts
          teamPerformance={salesData.teamPerformance}
          inventoryPerformance={inventoryTypesArray}
        />
      </div>
    </div>
  );
};