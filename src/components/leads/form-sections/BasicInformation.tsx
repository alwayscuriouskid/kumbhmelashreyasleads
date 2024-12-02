import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lead } from "@/types/leads";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BasicInformationProps {
  formData: Partial<Lead>;
  onInputChange: (field: keyof Lead, value: any) => void;
}

export const BasicInformation = ({ formData, onInputChange }: BasicInformationProps) => {
  const leadRefOptions = [
    "Market Reference",
    "Existing Contact",
    "Call Centre",
    "Others"
  ];

  const leadSourceOptions = [
    "agency",
    "client",
    "govt",
    "psu"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          value={formData.clientName}
          onChange={(e) => onInputChange("clientName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange("location", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input
          id="contactPerson"
          value={formData.contactPerson}
          onChange={(e) => onInputChange("contactPerson", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => onInputChange("phone", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          value={formData.budget}
          onChange={(e) => onInputChange("budget", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="leadRef">Lead Reference</Label>
        <Select
          value={formData.leadRef || ""}
          onValueChange={(value) => onInputChange("leadRef", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select lead reference" />
          </SelectTrigger>
          <SelectContent>
            {leadRefOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="leadSource">Lead Source</Label>
        <Select
          value={formData.leadSource || ""}
          onValueChange={(value) => onInputChange("leadSource", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select lead source" />
          </SelectTrigger>
          <SelectContent>
            {leadSourceOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};