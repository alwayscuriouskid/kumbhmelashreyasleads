import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Lead } from "@/types/leads";
import LeadFormRequirements from "./LeadFormRequirements";
import LeadFormStatus from "./LeadFormStatus";
import ActivityList from "./ActivityList";
import { useToast } from "@/hooks/use-toast";

interface LeadFormProps {
  onSubmit: (lead: Partial<Lead>) => void;
  onCancel: () => void;
  initialData?: Partial<Lead>;
  mode?: "add" | "edit";
  customStatuses: string[];
  onAddCustomStatus?: (status: string) => void;
}

const LeadForm = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  mode = "add", 
  customStatuses,
  onAddCustomStatus 
}: LeadFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Lead>>(
    initialData || {
      clientName: "",
      location: "",
      contactPerson: "",
      phone: "",
      email: "",
      requirement: {},
      status: "pending",
      remarks: "",
      budget: "",
      activities: [],
      leadRef: "",
      leadSource: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const leadData = {
      ...formData,
      requirement: formData.requirement || {},
      date: formData.date || new Date().toISOString().split('T')[0],
    };

    onSubmit(leadData);
  };

  const handleInputChange = (field: keyof Lead, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleInputChange("clientName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange("contactPerson", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input
              id="budget"
              value={formData.budget}
              onChange={(e) => handleInputChange("budget", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadRef">Lead Reference</Label>
            <Input
              id="leadRef"
              value={formData.leadRef}
              onChange={(e) => handleInputChange("leadRef", e.target.value)}
              placeholder="Enter reference person name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadSource">Lead Source</Label>
            <Input
              id="leadSource"
              value={formData.leadSource}
              onChange={(e) => handleInputChange("leadSource", e.target.value)}
              placeholder="Enter lead source"
            />
          </div>
        </div>

        {/* Status and Requirements Section */}
        <LeadFormStatus
          status={formData.status || "pending"}
          onStatusChange={(value) => handleInputChange("status", value)}
          customStatuses={customStatuses}
          onAddCustomStatus={onAddCustomStatus}
        />

        <LeadFormRequirements
          requirement={formData.requirement || {}}
          onRequirementChange={(field, value) => 
            handleInputChange("requirement", {
              ...formData.requirement,
              [field]: field === "customRequirements" ? value : (parseInt(value) || 0),
            })
          }
        />

        {/* Activities Section */}
        {mode === "edit" && (
          <div className="space-y-4">
            <ActivityList activities={formData.activities || []} />
          </div>
        )}

        {/* Remarks Section */}
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleInputChange("remarks", e.target.value)}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {mode === "add" ? "Add Lead" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
