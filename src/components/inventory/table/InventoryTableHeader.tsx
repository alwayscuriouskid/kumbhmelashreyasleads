import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InventoryTableHeaderProps {
  visibleColumns: Record<string, boolean>;
}

export const InventoryTableHeader = ({ visibleColumns }: InventoryTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        {visibleColumns.type && <TableHead>Type</TableHead>}
        {visibleColumns.zone && <TableHead>Zone</TableHead>}
        {visibleColumns.sector && <TableHead>Sector</TableHead>}
        {visibleColumns.sku && <TableHead>SKU</TableHead>}
        {visibleColumns.currentPrice && <TableHead>Current Price</TableHead>}
        {visibleColumns.minPrice && <TableHead>Min Price</TableHead>}
        {visibleColumns.ltc && <TableHead>LTC</TableHead>}
        {visibleColumns.dimensions && <TableHead>Dimensions</TableHead>}
        {visibleColumns.totalQuantity && <TableHead>Total Quantity</TableHead>}
        {visibleColumns.availableQuantity && <TableHead>Available</TableHead>}
        {visibleColumns.reservedQuantity && <TableHead>Reserved</TableHead>}
        {visibleColumns.soldQuantity && <TableHead>Sold</TableHead>}
        {visibleColumns.maintenanceQuantity && <TableHead>In Maintenance</TableHead>}
        <TableHead className="w-[30px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};