import { OrderItem } from "@/types/inventory";

interface InventoryItemsProps {
  items: OrderItem[];
}

export const InventoryItemsCell = ({ items }: InventoryItemsProps) => {
  if (!items?.length) return <span>-</span>;
  
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={index} className="text-sm">
          {item.inventory_items?.inventory_types?.name} 
          {item.inventory_items?.sku ? ` - ${item.inventory_items.sku}` : ''} 
          {` (${item.quantity})`}
        </div>
      ))}
    </div>
  );
};