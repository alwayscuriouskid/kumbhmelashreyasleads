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
  return (
    <TableColumnToggle
      columns={columns}
      visibleColumns={visibleColumns}
      onToggleColumn={onToggleColumn}
    />
  );
};