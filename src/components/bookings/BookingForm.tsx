import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerInfoSection } from "../orders/CustomerInfoSection";
import { TeamMemberSelect } from "../orders/TeamMemberSelect";
import { InventorySelector } from "../orders/InventorySelector";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const BookingForm = ({ onSubmit, onCancel }: BookingFormProps) => {
  const { data: teamMembers } = useTeamMembers();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    teamMemberId: "",
    paymentMethod: "",
    paymentAmount: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItems.length) {
      toast({
        title: "Error",
        description: "Please select an inventory item",
        variant: "destructive",
      });
      return;
    }
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }
    if (!formData.teamMemberId) {
      toast({
        title: "Error",
        description: "Please select a team member",
        variant: "destructive",
      });
      return;
    }

    const teamMember = teamMembers?.find(
      (member) => member.id === formData.teamMemberId
    );

    onSubmit({
      ...formData,
      selectedItems,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      teamMemberName: teamMember?.name,
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerInfoSection
            formData={formData}
            onChange={handleFormChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label>Select Item</Label>
            <InventorySelector
              selectedItems={selectedItems}
              onItemSelect={setSelectedItems}
              maxItems={1}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <DatePicker
                selected={startDate}
                onSelect={setStartDate}
                placeholderText="Select start date"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <DatePicker
                selected={endDate}
                onSelect={setEndDate}
                placeholderText="Select end date"
              />
            </div>
          </div>

          <TeamMemberSelect
            value={formData.teamMemberId}
            onChange={(value) => handleFormChange("teamMemberId", value)}
          />

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleFormChange("paymentMethod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentAmount">Payment Amount</Label>
            <Input
              id="paymentAmount"
              value={formData.paymentAmount}
              onChange={(e) => handleFormChange("paymentAmount", e.target.value)}
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleFormChange("notes", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Booking</Button>
      </div>
    </form>
  );
};