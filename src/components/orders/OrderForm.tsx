import { useState, useMemo } from "react";
import { useInventoryItems } from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { InventorySelector } from "./InventorySelector";
import { CustomerInfoSection } from "./CustomerInfoSection";

interface OrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const OrderForm = ({ onSubmit, onCancel }: OrderFormProps) => {
  const { data: inventoryItems } = useInventoryItems();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    assignedTo: "",
    paymentMethod: "",
    paymentTerms: "",
    notes: "",
  });

  // Calculate total bill based on selected items and their quantities
  const totalBill = useMemo(() => {
    return selectedItems.reduce((sum, itemId) => {
      const item = inventoryItems?.find(i => i.id === itemId);
      const quantity = quantities[itemId] || 1;
      return sum + ((item?.current_price || 0) * quantity);
    }, 0);
  }, [selectedItems, quantities, inventoryItems]);

  // Get selected items details for display
  const selectedItemsDetails = useMemo(() => {
    return inventoryItems?.filter(item => selectedItems.includes(item.id)) || [];
  }, [selectedItems, inventoryItems]);

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
    if (!formData.assignedTo) {
      toast({
        title: "Error",
        description: "Please enter an assignee",
        variant: "destructive",
      });
      return;
    }

    // Validate quantities
    for (const itemId of selectedItems) {
      const item = inventoryItems?.find(i => i.id === itemId);
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

    onSubmit({ 
      ...formData, 
      selectedItems,
      quantities,
      totalAmount: totalBill
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerInfoSection
            formData={formData}
            onChange={handleFormChange}
          />
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
              <Label>Selected Items</Label>
              {selectedItemsDetails.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>{item.inventory_types?.name} - {item.sku}</span>
                  <div className="flex items-center gap-4">
                    <span>Available: {item.available_quantity}</span>
                    <Input
                      type="number"
                      min="1"
                      max={item.available_quantity}
                      value={quantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span>₹{item.current_price * (quantities[item.id] || 1)}</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between p-2 font-bold bg-primary/5 rounded">
                <span>Total Bill:</span>
                <span>₹{totalBill}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => handleFormChange("assignedTo", e.target.value)}
              placeholder="Enter assignee name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
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
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => handleFormChange("paymentTerms", e.target.value)}
              placeholder="Enter payment terms"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleFormChange("notes", e.target.value)}
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