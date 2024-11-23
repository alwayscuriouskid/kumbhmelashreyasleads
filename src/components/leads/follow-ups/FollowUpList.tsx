import { Activity } from "@/types/leads";
import ActivityList from "../ActivityList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FollowUpListProps {
  activities: Activity[];
}

const FollowUpList = ({ activities }: FollowUpListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-ups & Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <ActivityList activities={activities} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FollowUpList;