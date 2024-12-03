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
import { DatePicker } from "@/components/ui/date-picker";
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
  const [paymentDate, setPaymentDate] = useState<Date>();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    teamMemberId: "",
    advancePayment: "",
    creditPeriod: "",
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
      paymentDate: paymentDate?.toISOString(),
      advancePaymentPercentage: parseInt(formData.advancePayment),
      creditPeriod: formData.creditPeriod,
    };

    await onSubmit(orderData);

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

  const advancePaymentOptions = ['30', '40', '50', '60', '70', '80', '90', '100'];
  const creditPeriodOptions = ['10days', '15days', '20days', '25days', '30days', '40days', '45days'];

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Advance Payment (%)</Label>
              <Select
                value={formData.advancePayment}
                onValueChange={(value) => handleFormChange("advancePayment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select advance payment %" />
                </SelectTrigger>
                <SelectContent>
                  {advancePaymentOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Credit Period</Label>
              <Select
                value={formData.creditPeriod}
                onValueChange={(value) => handleFormChange("creditPeriod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select credit period" />
                </SelectTrigger>
                <SelectContent>
                  {creditPeriodOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Date</Label>
              <DatePicker
                selected={paymentDate}
                onSelect={setPaymentDate}
                placeholderText="Select payment date"
              />
            </div>
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