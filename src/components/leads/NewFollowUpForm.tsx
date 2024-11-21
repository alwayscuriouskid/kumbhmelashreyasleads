import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FollowUp } from "@/types/leads";

interface NewFollowUpFormProps {
  leadId: string;
  onCancel: () => void;
  onSubmit?: (followUp: FollowUp) => void;
}

const NewFollowUpForm = ({ leadId, onCancel, onSubmit }: NewFollowUpFormProps) => {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFollowUp: FollowUp = {
      id: `followup-${Date.now()}`,
      date: new Date().toISOString(),
      notes,
      outcome,
      nextFollowUpDate: nextFollowUpDate || undefined
    };

    console.log("Creating new follow-up:", newFollowUp);
    
    if (onSubmit) {
      onSubmit(newFollowUp);
      toast({
        title: "Follow-up Added",
        description: "The follow-up has been successfully added.",
      });
    }
    
    onCancel();
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