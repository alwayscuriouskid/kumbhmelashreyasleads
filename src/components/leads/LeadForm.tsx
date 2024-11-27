import { useState } from "react";
import { Lead } from "@/types/leads";
import { useToast } from "@/hooks/use-toast";
import LeadFormRequirements from "./LeadFormRequirements";
import LeadFormStatus from "./LeadFormStatus";
import { BasicInformation } from "./form-sections/BasicInformation";
import { RemarksSection } from "./form-sections/RemarksSection";
import { FormActions } from "./form-sections/FormActions";

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
        <BasicInformation 
          formData={formData}
          onInputChange={handleInputChange}
        />

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

        <RemarksSection 
          remarks={formData.remarks}
          onRemarksChange={(value) => handleInputChange("remarks", value)}
        />

        <FormActions mode={mode} onCancel={onCancel} />
      </form>
    </div>
  );
};

export default LeadForm;