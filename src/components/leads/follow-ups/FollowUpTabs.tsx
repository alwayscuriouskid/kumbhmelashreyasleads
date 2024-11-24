import { Activity } from "@/types/leads";
import ActivityTracker from "../../analytics/ActivityTracker";

interface FollowUpTabsProps {
  leadId: string;
  onActivityAdd: (activity: any) => void;
  contactPerson: string;
  onLeadUpdate?: (updates: any) => void;
}

const FollowUpTabs = ({ 
  leadId, 
  onActivityAdd, 
  contactPerson,
  onLeadUpdate
}: FollowUpTabsProps) => {
  return (
    <div className="w-full">
      <ActivityTracker
        leadId={leadId}
        onActivityAdd={onActivityAdd}
        contactPerson={contactPerson}
        onLeadUpdate={onLeadUpdate}
      />
    </div>
  );
};

export default FollowUpTabs;