import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInfoSection } from "../orders/CustomerInfoSection";
import { InventorySelector } from "../orders/InventorySelector";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import { useInventoryItems } from "@/hooks/useInventory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const BookingForm = ({ onSubmit, onCancel }: BookingFormProps) => {
  const { data: inventoryItems } = useInventoryItems();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    assignedTo: "",
    paymentMethod: "",
    notes: "",
  });

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = inventoryItems?.find(item => item.id === itemId);
      const quantity = quantities[itemId] || 1;
      return total + ((item?.current_price || 0) * quantity);
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
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }
    if (!formData.assignedTo) {
      toast({
        title: "Error",
        description: "Please enter the person assigned to this booking",
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

    const bookingData = selectedItems.map(itemId => ({
      ...formData,
      inventory_item_id: itemId,
      quantity: quantities[itemId] || 1,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      teamMemberName: formData.assignedTo,
      payment_amount: (inventoryItems?.find(i => i.id === itemId)?.current_price || 0) * (quantities[itemId] || 1),
    }));

    onSubmit(bookingData);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          <CardTitle>Booking Details</CardTitle>
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
              {selectedItems.map(itemId => {
                const item = inventoryItems?.find(i => i.id === itemId);
                return (
                  <div key={itemId} className="flex items-center gap-4">
                    <span className="flex-grow">{item?.inventory_types?.name} (Available: {item?.available_quantity})</span>
                    <Input
                      type="number"
                      min="1"
                      max={item?.available_quantity}
                      value={quantities[itemId] || 1}
                      onChange={(e) => handleQuantityChange(itemId, parseInt(e.target.value))}
                      className="w-24"
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                selected={startDate}
                onSelect={setStartDate}
                placeholderText="Select start date"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                selected={endDate}
                onSelect={setEndDate}
                placeholderText="Select end date"
              />
            </div>
          </div>

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
            <Label>Total Amount</Label>
            <div className="text-lg font-semibold">₹{calculateTotalAmount()}</div>
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
        <Button type="submit">Create Booking</Button>
      </div>
    </form>
  );
};