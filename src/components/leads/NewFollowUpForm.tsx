import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FollowUp } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";
import { TeamMemberSelect } from "@/components/shared/TeamMemberSelect";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

interface NewFollowUpFormProps {
  leadId: string;
  onCancel: () => void;
  onSubmit?: (followUp: FollowUp) => void;
}

const NewFollowUpForm = ({ leadId, onCancel, onSubmit }: NewFollowUpFormProps) => {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState("");
  const { toast } = useToast();

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const updateLeadWithFollowUpData = async (followUp: FollowUp) => {
    console.log("Updating lead with follow-up data:", followUp);
    
    try {
      if (!leadId) {
        throw new Error("Lead ID is required");
      }

      if (!isValidUUID(leadId)) {
        throw new Error("Invalid lead ID format");
      }

      // First check if the lead exists
      const { data: leadExists, error: checkError } = await supabase
        .from('leads')
        .select('id')
        .eq('id', leadId)
        .single();

      if (checkError) {
        console.error("Error checking lead:", checkError);
        throw checkError;
      }

      if (!leadExists) {
        throw new Error("Lead not found");
      }

      // If lead exists, proceed with update
      const { error: updateError } = await supabase
        .from('leads')
        .update({
          next_follow_up: followUp.nextFollowUpDate || null,
          follow_up_outcome: followUp.outcome,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (updateError) {
        console.error("Error updating lead with follow-up data:", updateError);
        throw updateError;
      }

      console.log("Successfully updated lead with follow-up data");
    } catch (error) {
      console.error("Failed to update lead with follow-up data:", error);
      let errorMessage = "Failed to update lead information";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!leadId) {
        toast({
          title: "Error",
          description: "Lead ID is required",
          variant: "destructive",
        });
        return;
      }

      const newFollowUp: FollowUp = {
        id: `followup-${Date.now()}`,
        date: new Date().toISOString(),
        notes,
        outcome,
        nextFollowUpDate: nextFollowUpDate ? format(nextFollowUpDate, 'yyyy-MM-dd') : undefined,
        assignedTo
      };

      console.log("Creating new follow-up:", newFollowUp);
      
      // First update the lead table
      await updateLeadWithFollowUpData(newFollowUp);
      
      // Then notify parent component
      if (onSubmit) {
        onSubmit(newFollowUp);
        toast({
          title: "Success",
          description: "The follow-up has been successfully added.",
        });
      }
      
      onCancel();
    } catch (error) {
      console.error("Failed to submit follow-up:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add follow-up",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter follow-up notes..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="outcome">Outcome</Label>
        <Textarea
          id="outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="Enter outcome..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Next Follow-up Date</Label>
        <DatePicker
          selected={nextFollowUpDate}
          onSelect={setNextFollowUpDate}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Assigned To</Label>
        <TeamMemberSelect
          value={assignedTo}
          onChange={setAssignedTo}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Follow-up</Button>
      </div>
    </form>
  );
};

export default NewFollowUpForm;