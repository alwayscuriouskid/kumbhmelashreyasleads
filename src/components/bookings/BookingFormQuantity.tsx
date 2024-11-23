import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/types/inventory";

interface BookingFormQuantityProps {
  item: Omit<InventoryItem, 'status'> & { status: string } | undefined;
  itemId: string;
  quantity: number;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export const BookingFormQuantity = ({
  item,
  itemId,
  quantity,
  onQuantityChange,
}: BookingFormQuantityProps) => {
  return (
    <div key={itemId} className="flex items-center gap-4">
      <span className="flex-grow">
        {item?.inventory_types?.name} (Available: {item?.available_quantity})
      </span>
      <Input
        type="number"
        min="1"
        max={item?.available_quantity}
        value={quantity}
        onChange={(e) => onQuantityChange(itemId, parseInt(e.target.value))}
        className="w-24"
      />
    </div>
  );
};