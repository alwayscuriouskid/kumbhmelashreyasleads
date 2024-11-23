import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowUp } from "@/types/leads";
import NewFollowUpForm from "../NewFollowUpForm";
import ActivityTracker from "../../analytics/ActivityTracker";

interface FollowUpTabsProps {
  leadId: string;
  onFollowUpSubmit: (followUp: FollowUp) => void;
  onActivityAdd: (activity: any) => void;
  contactPerson: string;
}

const FollowUpTabs = ({ 
  leadId, 
  onFollowUpSubmit, 
  onActivityAdd, 
  contactPerson 
}: FollowUpTabsProps) => {
  return (
    <Tabs defaultValue="followup" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="followup">Follow-up</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="followup">
        <NewFollowUpForm
          leadId={leadId}
          onCancel={() => {}}
          onSubmit={onFollowUpSubmit}
        />
      </TabsContent>
      <TabsContent value="activity">
        <ActivityTracker
          leadId={leadId}
          onActivityAdd={onActivityAdd}
          contactPerson={contactPerson}
        />
      </TabsContent>
    </Tabs>
  );
};

export default FollowUpTabs;