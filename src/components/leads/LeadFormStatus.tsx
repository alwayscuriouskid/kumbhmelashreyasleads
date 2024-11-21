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

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      const formattedStatus = newStatus.trim().toLowerCase();
      
      // Check if status already exists
      if ([...customStatuses, "pending", "approved", "rejected", "followup"].includes(formattedStatus)) {
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="followup">Follow Up</SelectItem>
            {customStatuses.map((customStatus) => (
              <SelectItem key={customStatus} value={customStatus}>
                {customStatus.charAt(0).toUpperCase() + customStatus.slice(1)}
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