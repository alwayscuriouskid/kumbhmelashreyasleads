import { TableCell } from "@/components/ui/table";
import { InventoryItem } from "@/types/inventory";

interface InventoryQuantityColumnsProps {
  item: InventoryItem;
  visibleColumns: Record<string, boolean>;
  isEditing: boolean;
  onEditValue?: (field: string, value: string) => void;
}

export const InventoryQuantityColumns = ({
  item,
  visibleColumns,
  isEditing,
  onEditValue,
}: InventoryQuantityColumnsProps) => {
  // Calculate quantities
  const totalQuantity = item.quantity || 0;
  const availableQuantity = item.available_quantity || totalQuantity;
  const reservedQuantity = (item.bookings?.filter(b => b.status === 'reserved').length || 0);
  const soldQuantity = (item.bookings?.filter(b => b.status === 'sold').length || 0);
  const maintenanceQuantity = (item.bookings?.filter(b => b.status === 'maintenance').length || 0);

  return (
    <>
      {visibleColumns.totalQuantity && (
        <TableCell>{totalQuantity}</TableCell>
      )}
      {visibleColumns.availableQuantity && (
        <TableCell>{availableQuantity}</TableCell>
      )}
      {visibleColumns.reservedQuantity && (
        <TableCell>{reservedQuantity}</TableCell>
      )}
      {visibleColumns.soldQuantity && (
        <TableCell>{soldQuantity}</TableCell>
      )}
      {visibleColumns.maintenanceQuantity && (
        <TableCell>{maintenanceQuantity}</TableCell>
      )}
    </>
  );
};