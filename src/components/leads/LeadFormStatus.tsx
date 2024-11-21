import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface LeadFormStatusProps {
  status: string;
  onStatusChange: (value: string) => void;
  customStatuses: string[];
  onAddCustomStatus: (status: string) => void;
}

const LeadFormStatus = ({ status, onStatusChange, customStatuses, onAddCustomStatus }: LeadFormStatusProps) => {
  const [newStatus, setNewStatus] = useState("");

  const handleAddStatus = () => {
    if (newStatus.trim()) {
      onAddCustomStatus(newStatus.trim().toLowerCase());
      setNewStatus("");
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
            {customStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
        />
        <Button type="button" onClick={handleAddStatus}>
          Add Status
        </Button>
      </div>
    </div>
  );
};

export default LeadFormStatus;