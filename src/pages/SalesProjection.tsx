import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryManagement } from "@/components/sales-projection/InventoryManagement";
import { SalesEntry } from "@/components/sales-projection/SalesEntry";
import { SalesAnalytics } from "@/components/sales-projection/SalesAnalytics";

const SalesProjection = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales Projection</h1>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Types</TabsTrigger>
          <TabsTrigger value="sales">Record Sales</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <InventoryManagement />
        </TabsContent>

        <TabsContent value="sales">
          <SalesEntry />
        </TabsContent>

        <TabsContent value="analytics">
          <SalesAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesProjection;