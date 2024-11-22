import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface Column {
  key: string;
  label: string;
}

interface TableColumnToggleProps {
  columns: Column[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnKey: string) => void;
}

export const TableColumnToggle = ({
  columns,
  visibleColumns,
  onToggleColumn,
}: TableColumnToggleProps) => {
  return (
    <Card className="p-4 bg-background">
      <h3 className="text-sm font-medium mb-4">Visible Columns</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.key} className="flex items-center space-x-2">
            <Checkbox
              id={column.key}
              checked={visibleColumns[column.key]}
              onCheckedChange={() => onToggleColumn(column.key)}
            />
            <Label htmlFor={column.key} className="text-sm">
              {column.label}
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
};