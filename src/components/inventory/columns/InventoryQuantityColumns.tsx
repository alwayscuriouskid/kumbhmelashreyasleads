import { TableCell } from "@/components/ui/table";
import { InventoryItem } from "@/types/inventory";
import { EditableCell } from "../EditableCell";

interface InventoryQuantityColumnsProps {
  item: InventoryItem;
  visibleColumns: Record<string, boolean>;
  isEditing: boolean;
  onEditValue: (field: string, value: string) => void;
}

export const InventoryQuantityColumns = ({
  item,
  visibleColumns,
  isEditing,
  onEditValue,
}: InventoryQuantityColumnsProps) => {
  const totalQuantity = item.quantity || 0;
  const availableQuantity = item.available_quantity || 0;
  const reservedQuantity = item.reserved_quantity || 0;
  const soldQuantity = item.sold_quantity || 0;

  return (
    <>
      {visibleColumns.totalQuantity && (
        <TableCell>
          <EditableCell
            value={totalQuantity.toString()}
            isEditing={isEditing}
            onChange={(value) => onEditValue('quantity', value)}
            type="number"
          />
        </TableCell>
      )}
      {visibleColumns.availableQuantity && (
        <TableCell>
          <EditableCell
            value={availableQuantity.toString()}
            isEditing={isEditing}
            onChange={(value) => onEditValue('available_quantity', value)}
            type="number"
          />
        </TableCell>
      )}
      {visibleColumns.reservedQuantity && (
        <TableCell>{reservedQuantity}</TableCell>
      )}
      {visibleColumns.soldQuantity && (
        <TableCell>{soldQuantity}</TableCell>
      )}
    </>
  );
};