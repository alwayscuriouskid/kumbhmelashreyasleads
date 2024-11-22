import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FollowUp } from "@/types/leads";
import { supabase } from "@/integrations/supabase/client";

interface NewFollowUpFormProps {
  leadId: string;
  onCancel: () => void;
  onSubmit?: (followUp: FollowUp) => void;
}

const NewFollowUpForm = ({ leadId, onCancel, onSubmit }: NewFollowUpFormProps) => {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const { toast } = useToast();

  const updateLeadWithFollowUpData = async (followUp: FollowUp) => {
    console.log("Updating lead with follow-up data:", followUp);
    
    try {
      // Validate UUID format
      if (!leadId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        throw new Error("Invalid UUID format for leadId");
      }

      const { error } = await supabase
        .from('leads')
        .update({
          next_follow_up: followUp.nextFollowUpDate || null,
          follow_up_outcome: followUp.outcome,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .single();

      if (error) {
        console.error("Error updating lead with follow-up data:", error);
        throw error;
      }

      console.log("Successfully updated lead with follow-up data");
    } catch (error) {
      console.error("Failed to update lead with follow-up data:", error);
      toast({
        title: "Error",
        description: "Failed to update lead information",
        variant: "destructive",
      });
      throw error; // Re-throw to handle in the calling function
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFollowUp: FollowUp = {
      id: `followup-${Date.now()}`,
      date: new Date().toISOString(),
      notes,
      outcome,
      nextFollowUpDate: nextFollowUpDate || undefined,
      assignedTo
    };

    console.log("Creating new follow-up:", newFollowUp);
    
    try {
      // First update the lead table
      await updateLeadWithFollowUpData(newFollowUp);
      
      // Then notify parent component
      if (onSubmit) {
        onSubmit(newFollowUp);
        toast({
          title: "Follow-up Added",
          description: "The follow-up has been successfully added.",
        });
      }
      
      onCancel();
    } catch (error) {
      console.error("Failed to submit follow-up:", error);
      // Error toast is already shown in updateLeadWithFollowUpData
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
        <Input
          id="outcome"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          placeholder="Enter outcome..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nextFollowUpDate">Next Follow-up Date</Label>
        <Input
          id="nextFollowUpDate"
          type="date"
          value={nextFollowUpDate}
          onChange={(e) => setNextFollowUpDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Enter team member name"
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