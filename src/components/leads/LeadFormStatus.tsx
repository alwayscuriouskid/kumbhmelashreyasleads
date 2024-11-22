import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LeadFormStatusProps {
  status: string;
  onStatusChange: (value: string) => void;
  customStatuses: string[];
  onAddCustomStatus: (status: string) => void;
}

const LeadFormStatus = ({ status, onStatusChange, customStatuses, onAddCustomStatus }: LeadFormStatusProps) => {
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();

  const defaultStatuses = ["suspect", "prospect", "analysis", "negotiation", "conclusion", "ongoing_order"];

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      const formattedStatus = newStatus.trim().toLowerCase();
      
      if ([...customStatuses, ...defaultStatuses].includes(formattedStatus)) {
        toast({
          title: "Status already exists",
          description: "Please enter a different status name.",
          variant: "destructive",
        });
        return;
      }

      console.log("Adding new status:", formattedStatus);
      onAddCustomStatus(formattedStatus);
      setNewStatus("");
      
      toast({
        title: "Status Added",
        description: `New status "${formattedStatus}" has been added successfully.`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddStatus();
    }
  };

  const formatStatusLabel = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {defaultStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {formatStatusLabel(status)}
              </SelectItem>
            ))}
            {customStatuses.map((customStatus) => (
              <SelectItem key={customStatus} value={customStatus}>
                {formatStatusLabel(customStatus)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add new status..."
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button type="button" onClick={handleAddStatus}>
          Add Status
        </Button>
      </div>
    </div>
  );
};

export default LeadFormStatus;