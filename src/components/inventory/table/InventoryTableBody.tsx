import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "../EditableCell";
import { EditableStatusCell } from "../EditableStatusCell";
import { TableActions } from "../TableActions";
import { InventoryQuantityColumns } from "../columns/InventoryQuantityColumns";
import { InventoryItem } from "@/types/inventory";

interface InventoryTableBodyProps {
  filteredItems: InventoryItem[] | undefined;
  editingId: string | null;
  editedValues: any;
  visibleColumns: Record<string, boolean>;
  onEdit: (item: any) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  setEditedValues: (values: any) => void;
}

export const InventoryTableBody = ({
  filteredItems,
  editingId,
  editedValues,
  visibleColumns,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  setEditedValues,
}: InventoryTableBodyProps) => {
  return (
    <TableBody>
      {filteredItems?.map((item) => (
        <TableRow key={item.id}>
          {visibleColumns.type && <TableCell>{item.inventory_types?.name}</TableCell>}
          {visibleColumns.zone && <TableCell>{item.sectors?.zones?.name}</TableCell>}
          {visibleColumns.sector && <TableCell>{item.sectors?.name}</TableCell>}
          {visibleColumns.sku && (
            <TableCell>
              <EditableCell
                value={item.sku || ''}
                isEditing={editingId === item.id}
                onChange={(value) => setEditedValues({
                  ...editedValues,
                  sku: value
                })}
              />
            </TableCell>
          )}
          {visibleColumns.currentPrice && (
            <TableCell>
              <EditableCell
                value={item.current_price}
                isEditing={editingId === item.id}
                onChange={(value) => setEditedValues({
                  ...editedValues,
                  current_price: value
                })}
                type="number"
              />
            </TableCell>
          )}
          {visibleColumns.minPrice && (
            <TableCell>
              <EditableCell
                value={item.min_price}
                isEditing={editingId === item.id}
                onChange={(value) => setEditedValues({
                  ...editedValues,
                  min_price: value
                })}
                type="number"
              />
            </TableCell>
          )}
          {visibleColumns.ltc && (
            <TableCell>
              <EditableCell
                value={item.ltc || ''}
                isEditing={editingId === item.id}
                onChange={(value) => setEditedValues({
                  ...editedValues,
                  ltc: value
                })}
                type="number"
              />
            </TableCell>
          )}
          {visibleColumns.dimensions && (
            <TableCell>
              <EditableCell
                value={item.dimensions || ''}
                isEditing={editingId === item.id}
                onChange={(value) => setEditedValues({
                  ...editedValues,
                  dimensions: value
                })}
              />
            </TableCell>
          )}
          
          <InventoryQuantityColumns
            item={item}
            visibleColumns={visibleColumns}
            isEditing={editingId === item.id}
            onEditValue={(field, value) => setEditedValues({
              ...editedValues,
              [field]: value
            })}
          />

          {visibleColumns.status && (
            <TableCell>
              <EditableStatusCell
                value={item.status}
                isEditing={editingId === item.id}
                onChange={(value) => setEditedValues({
                  ...editedValues,
                  status: value
                })}
              />
            </TableCell>
          )}
          <TableCell>
            <TableActions
              isEditing={editingId === item.id}
              onEdit={() => onEdit(item)}
              onSave={onSave}
              onCancel={onCancel}
              onDelete={() => onDelete(item.id)}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};