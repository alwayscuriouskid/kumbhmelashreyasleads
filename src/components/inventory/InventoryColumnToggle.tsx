import { TableColumnToggle } from "@/components/shared/TableColumnToggle";

export const InventoryColumnToggle = ({
  visibleColumns,
  onToggleColumn,
}: {
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnKey: string) => void;
}) => {
  const columns = [
    { key: "type", label: "Type" },
    { key: "zone", label: "Zone" },
    { key: "sector", label: "Sector" },
    { key: "currentPrice", label: "Current Price" },
    { key: "minPrice", label: "Min Price" },
    { key: "ltc", label: "LTC" },
    { key: "dimensions", label: "Dimensions" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "availableQuantity", label: "Available Quantity" },
    { key: "status", label: "Status" },
    { key: "sku", label: "SKU" },
  ];

  return (
    <TableColumnToggle
      columns={columns}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
    />
  );
};