import { useState } from "react";
import { FollowUp } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import NewFollowUpForm from "./NewFollowUpForm";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeadFollowUpsProps {
  leadId: string;
  followUps: FollowUp[];
  onFollowUpSubmit?: (followUp: FollowUp) => void;
}

const LeadFollowUps = ({ leadId, followUps = [], onFollowUpSubmit }: LeadFollowUpsProps) => {
  const [showNewForm, setShowNewForm] = useState(false);

  const handleFollowUpSubmit = (followUp: FollowUp) => {
    console.log("Submitting follow-up:", followUp);
    onFollowUpSubmit?.(followUp);
    setShowNewForm(false);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto px-2 sm:px-6">
      <div className="flex flex-row items-center justify-between gap-2 flex-wrap">
        <h3 className="text-lg font-semibold">Follow-ups & Activities</h3>
        <Button
          onClick={() => setShowNewForm(!showNewForm)}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Follow-up
        </Button>
      </div>

      {showNewForm && (
        <Card className="border-dashed animate-fade-in">
          <CardContent className="pt-6">
            <NewFollowUpForm
              leadId={leadId}
              onCancel={() => setShowNewForm(false)}
              onSubmit={handleFollowUpSubmit}
            />
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <div className="space-y-3 p-2 sm:p-4">
          {followUps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No follow-ups yet</p>
          ) : (
            followUps.map((followUp) => (
              <Card key={followUp.id} className="animate-fade-in">
                <CardHeader className="p-3 sm:p-4 space-y-1">
                  <div className="flex flex-row justify-between items-start gap-2 flex-wrap">
                    <CardTitle className="text-sm font-medium">
                      {new Date(followUp.date).toLocaleDateString()}
                    </CardTitle>
                    {followUp.nextFollowUpDate && (
                      <span className="text-xs text-muted-foreground">
                        Next: {new Date(followUp.nextFollowUpDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <p className="text-sm break-words">{followUp.notes}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Outcome: {followUp.outcome}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeadFollowUps;