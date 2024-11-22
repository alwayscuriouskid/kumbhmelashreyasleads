import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoSectionProps {
  formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  };
  onChange: (field: string, value: string) => void;
}

export const CustomerInfoSection = ({
  formData,
  onChange,
}: CustomerInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input
          id="customerName"
          value={formData.customerName}
          onChange={(e) => onChange("customerName", e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerEmail">Customer Email</Label>
        <Input
          id="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={(e) => onChange("customerEmail", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerPhone">Customer Phone</Label>
        <Input
          id="customerPhone"
          value={formData.customerPhone}
          onChange={(e) => onChange("customerPhone", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerAddress">Customer Address</Label>
        <Input
          id="customerAddress"
          value={formData.customerAddress}
          onChange={(e) => onChange("customerAddress", e.target.value)}
        />
      </div>
    </div>
  );
};