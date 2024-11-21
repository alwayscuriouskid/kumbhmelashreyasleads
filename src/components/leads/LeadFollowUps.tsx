import { useState } from "react";
import { FollowUp } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import NewFollowUpForm from "./NewFollowUpForm";

interface LeadFollowUpsProps {
  leadId: string;
  followUps: FollowUp[];
}

const LeadFollowUps = ({ leadId, followUps }: LeadFollowUpsProps) => {
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Follow-ups & Activities</h3>
        <Button
          onClick={() => setShowNewForm(!showNewForm)}
          variant="outline"
          size="sm"
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
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {followUps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No follow-ups yet</p>
        ) : (
          followUps.map((followUp) => (
            <Card key={followUp.id} className="animate-fade-in">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">
                    {new Date(followUp.date).toLocaleDateString()}
                  </CardTitle>
                  {followUp.nextFollowUpDate && (
                    <span className="text-sm text-muted-foreground">
                      Next: {new Date(followUp.nextFollowUpDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{followUp.notes}</p>
                <p className="text-sm text-muted-foreground">
                  Outcome: {followUp.outcome}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default LeadFollowUps;