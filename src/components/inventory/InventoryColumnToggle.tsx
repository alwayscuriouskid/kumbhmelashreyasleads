import { TableColumnToggle } from "@/components/shared/TableColumnToggle";

interface Column {
  key: string;
  label: string;
}

interface InventoryColumnToggleProps {
  columns: Column[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnKey: string) => void;
}

export const InventoryColumnToggle = ({
  columns,
  visibleColumns,
  onToggleColumn,
}: InventoryColumnToggleProps) => {
  const defaultColumns: Column[] = [
    { key: "type", label: "Type" },
    { key: "zone", label: "Zone" },
    { key: "sector", label: "Sector" },
    { key: "currentPrice", label: "Current Price" },
    { key: "minPrice", label: "Min Price" },
    { key: "ltc", label: "LTC" },
    { key: "dimensions", label: "Dimensions" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "availableQuantity", label: "Available" },
    { key: "reservedQuantity", label: "Reserved" },
    { key: "soldQuantity", label: "Sold" },
    { key: "maintenanceQuantity", label: "In Maintenance" },
    { key: "sku", label: "SKU" },
  ];

  return (
    <TableColumnToggle
      columns={columns || defaultColumns}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
    />
  );
};