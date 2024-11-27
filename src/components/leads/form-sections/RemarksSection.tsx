import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Lead } from "@/types/leads";

interface RemarksSectionProps {
  remarks?: string;
  onRemarksChange: (value: string) => void;
}

export const RemarksSection = ({ remarks, onRemarksChange }: RemarksSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="remarks">Remarks</Label>
      <Textarea
        id="remarks"
        value={remarks}
        onChange={(e) => onRemarksChange(e.target.value)}
      />
    </div>
  );
};