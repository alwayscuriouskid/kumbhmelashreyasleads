import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerInfoSection } from "../orders/CustomerInfoSection";
import { InventorySelector } from "../orders/InventorySelector";
import { useToast } from "@/components/ui/use-toast";
import { useInventoryItems } from "@/hooks/useInventory";
import { BookingFormHeader } from "./BookingFormHeader";
import { BookingFormActions } from "./BookingFormActions";
import { LeadSelector } from "../shared/LeadSelector";
import { useLeadConversion } from "@/hooks/useLeadConversion";
import { Label } from "@/components/ui/label";

interface BookingFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const BookingForm = ({ onSubmit, onCancel }: BookingFormProps) => {
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

    const bookingData = {
      ...formData,
      selectedItems: selectedItems.map((itemId) => ({
        inventory_item_id: itemId,
        quantity: quantities[itemId] || 1,
      })),
      leadId: selectedLeadId || null,
    };

    await onSubmit(bookingData);

    // Convert lead if one was selected
    if (selectedLeadId) {
      await convertLead.mutateAsync({
        leadId: selectedLeadId,
        conversionType: 'booking'
      });
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BookingFormHeader title="Create New Booking" />

      <Card>
        <CardContent className="pt-6">
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
        <CardContent className="space-y-4 pt-6">
          <InventorySelector
            selectedItems={selectedItems}
            onItemSelect={setSelectedItems}
            quantities={quantities}
            onQuantityChange={setQuantities}
          />
        </CardContent>
      </Card>

      <BookingFormActions onCancel={onCancel} isSubmitting={convertLead.isPending} />
    </form>
  );
};