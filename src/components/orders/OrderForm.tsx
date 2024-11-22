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
import { AssignedToSelect } from "./AssignedToSelect"; // Changed from TeamMemberSelect

interface OrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const OrderForm = ({ onSubmit, onCancel }: OrderFormProps) => {
  const { data: inventoryItems } = useInventoryItems();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    assignedTo: "", // Changed from teamMemberId
    paymentMethod: "",
    paymentTerms: "", // Added payment terms
    notes: "",
  });

  // Calculate total bill based on selected items
  const totalBill = useMemo(() => {
    return inventoryItems
      ?.filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + Number(item.current_price), 0) || 0;
  }, [selectedItems, inventoryItems]);

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
        description: "Please select an assignee",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ ...formData, selectedItems });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

          {selectedItemsDetails.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Items</Label>
              <div className="space-y-2">
                {selectedItemsDetails.map(item => (
                  <div key={item.id} className="flex justify-between p-2 bg-muted rounded">
                    <span>{item.inventory_types?.name} - {item.sku}</span>
                    <span>₹{item.current_price}</span>
                  </div>
                ))}
                <div className="flex justify-between p-2 font-bold bg-primary/5 rounded">
                  <span>Total Bill:</span>
                  <span>₹{totalBill}</span>
                </div>
              </div>
            </div>
          )}

          <AssignedToSelect
            value={formData.assignedTo}
            onChange={(value) => handleFormChange("assignedTo", value)}
          />

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
            <Select
              value={formData.paymentTerms}
              onValueChange={(value) => handleFormChange("paymentTerms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate Payment</SelectItem>
                <SelectItem value="net15">Net 15 Days</SelectItem>
                <SelectItem value="net30">Net 30 Days</SelectItem>
                <SelectItem value="net45">Net 45 Days</SelectItem>
                <SelectItem value="net60">Net 60 Days</SelectItem>
              </SelectContent>
            </Select>
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