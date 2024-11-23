import { Activity } from "@/types/leads";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { PhoneCall, Calendar, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface ActivityListProps {
  activities: Activity[];
}

const ActivityList = ({ activities }: ActivityListProps) => {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "call":
        return <PhoneCall className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    return new Date(`2000/01/01 ${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ScrollArea className="h-[400px] w-full">
      <div className="space-y-4 p-4">
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground">No activities recorded yet</p>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className="bg-background/60">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted p-2 rounded-full">
                    {getIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        {activity.callType && ` (${activity.callType})`}
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(activity.date), 'PPP')}
                      </span>
                    </div>
                    {(activity.startTime || activity.endTime) && (
                      <p className="text-sm text-muted-foreground">
                        {formatTime(activity.startTime)} - {formatTime(activity.endTime)}
                        {activity.duration && ` (${activity.duration} mins)`}
                      </p>
                    )}
                    <p className="text-sm">Assigned to: {activity.assignedTo}</p>
                    <p className="text-sm">Contact: {activity.contactPerson}</p>
                    {activity.location && (
                      <p className="text-sm">Location: {activity.location}</p>
                    )}
                    <p className="text-sm mt-2">{activity.notes}</p>
                    {activity.outcome && (
                      <p className="text-sm font-medium mt-2">
                        Outcome: {activity.outcome}
                      </p>
                    )}
                    {activity.nextAction && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Next Action: {activity.nextAction}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ActivityList;