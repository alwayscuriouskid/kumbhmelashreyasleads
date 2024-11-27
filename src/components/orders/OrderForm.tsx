import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { InventorySelector } from "./InventorySelector";
import { useToast } from "@/components/ui/use-toast";
import { useInventoryItems } from "@/hooks/useInventory";
import { TeamMemberSelect } from "../shared/TeamMemberSelect";
import { LeadSelector } from "../shared/LeadSelector";
import { useLeadConversion } from "@/hooks/useLeadConversion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const OrderForm = ({ onSubmit, onCancel }: OrderFormProps) => {
  const { data: inventoryItems } = useInventoryItems();
  const { toast } = useToast();
  const convertLead = useLeadConversion();
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    teamMemberId: "",
    paymentMethod: "",
    notes: "",
  });

  const calculateTotalAmount = () => {
    const subtotal = selectedItems.reduce((total, itemId) => {
      const item = inventoryItems?.find((item) => item.id === itemId);
      const quantity = quantities[itemId] || 1;
      return total + (item?.current_price || 0) * quantity;
    }, 0);

    const gstAmount = subtotal * 0.18;
    const totalWithGst = subtotal + gstAmount;

    return {
      subtotal,
      gstAmount,
      totalWithGst
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItems.length) {
      toast({
        title: "Error",
        description: "Please select at least one inventory item",
        variant: "destructive",
      });
      return;
    }

    const { subtotal, gstAmount, totalWithGst } = calculateTotalAmount();

    const orderData = {
      ...formData,
      selectedItems: selectedItems.map((itemId) => ({
        inventory_item_id: itemId,
        quantity: quantities[itemId] || 1,
        price: inventoryItems?.find((i) => i.id === itemId)?.current_price || 0,
      })),
      totalAmount: totalWithGst,
      leadId: selectedLeadId || null,
    };

    await onSubmit(orderData);

    // Convert lead if one was selected
    if (selectedLeadId) {
      await convertLead.mutateAsync({
        leadId: selectedLeadId,
        conversionType: 'order'
      });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { subtotal, gstAmount, totalWithGst } = calculateTotalAmount();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Lead (Optional)</Label>
              <LeadSelector
                value={selectedLeadId}
                onChange={setSelectedLeadId}
                className="w-full"
              />
            </div>
            <CustomerInfoSection formData={formData} onChange={handleFormChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InventorySelector
            selectedItems={selectedItems}
            onItemSelect={setSelectedItems}
            quantities={quantities}
            onQuantityChange={setQuantities}
          />

          <div className="space-y-2">
            <Label>Amount Details</Label>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">Subtotal: ₹{subtotal}</div>
              <div className="text-sm text-gray-600">GST (18%): ₹{gstAmount}</div>
              <div className="text-lg font-semibold">Total Amount: ₹{totalWithGst}</div>
            </div>
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={convertLead.isPending}>
          Create Order
        </Button>
      </div>
    </form>
  );
};