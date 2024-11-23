import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { InventorySelector } from "./InventorySelector";
import { useToast } from "@/components/ui/use-toast";
import { useInventoryItems } from "@/hooks/useInventory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamMemberSelect } from "./TeamMemberSelect";

interface OrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const OrderForm = ({ onSubmit, onCancel }: OrderFormProps) => {
  const { data: inventoryItems } = useInventoryItems();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    teamMemberId: "",
    paymentMethod: "",
    paymentTerms: "",
    notes: "",
  });

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = inventoryItems?.find((item) => item.id === itemId);
      const quantity = quantities[itemId] || 1;
      return total + (item?.current_price || 0) * quantity;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItems.length) {
      toast({
        title: "Error",
        description: "Please select at least one inventory item",
        variant: "destructive",
      });
      return;
    }

    // Validate quantities
    for (const itemId of selectedItems) {
      const item = inventoryItems?.find((i) => i.id === itemId);
      const requestedQuantity = quantities[itemId] || 1;

      if (item && requestedQuantity > (item.available_quantity || 0)) {
        toast({
          title: "Error",
          description: `Only ${item.available_quantity} units available for ${item.inventory_types?.name}`,
          variant: "destructive",
        });
        return;
      }
    }

    const orderData = {
      ...formData,
      selectedItems: selectedItems.map((itemId) => ({
        inventory_item_id: itemId,
        quantity: quantities[itemId] || 1,
        price: inventoryItems?.find((i) => i.id === itemId)?.current_price || 0,
      })),
      totalAmount: calculateTotalAmount(),
    };

    onSubmit(orderData);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerInfoSection formData={formData} onChange={handleFormChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label>Select Items</Label>
            <InventorySelector
              selectedItems={selectedItems}
              onItemSelect={setSelectedItems}
            />
          </div>

          {selectedItems.length > 0 && (
            <div className="space-y-4">
              <Label>Selected Items Quantities</Label>
              {selectedItems.map((itemId) => {
                const item = inventoryItems?.find((i) => i.id === itemId);
                return (
                  <div key={itemId} className="flex items-center gap-4">
                    <span className="flex-grow">
                      {item?.inventory_types?.name} (Available:{" "}
                      {item?.available_quantity})
                    </span>
                    <Input
                      type="number"
                      min="1"
                      max={item?.available_quantity}
                      value={quantities[itemId] || 1}
                      onChange={(e) =>
                        handleQuantityChange(itemId, parseInt(e.target.value))
                      }
                      className="w-24"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-2">
            <Label>Total Amount</Label>
            <div className="text-lg font-semibold">₹{calculateTotalAmount()}</div>
          </div>

          <div className="space-y-2">
            <Label>Assigned To</Label>
            <TeamMemberSelect
              value={formData.teamMemberId}
              onChange={(value) => handleFormChange("teamMemberId", value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleFormChange("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Input
              value={formData.notes}
              onChange={(e) => handleFormChange("notes", e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Order</Button>
      </div>
    </form>
  );
};