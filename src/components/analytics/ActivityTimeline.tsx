import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneCall, Calendar, Mail, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityTimelineProps {
  isLoading?: boolean;
  data?: any[];
}

const getIcon = (type: string) => {
  switch (type) {
    case 'call':
      return <PhoneCall className="h-4 w-4" />;
    case 'meeting':
      return <Calendar className="h-4 w-4" />;
    case 'email':
      return <Mail className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const ActivityTimelineSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-start space-x-4 p-4 rounded-lg border">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/5" />
        </div>
      </div>
    ))}
  </div>
);

const ActivityTimeline = ({ isLoading, data = [] }: ActivityTimelineProps) => {
  console.log("Rendering ActivityTimeline, loading state:", isLoading, "data:", data);

  const activities = data
    .flatMap(lead => (lead.activities || []).map((activity: any) => ({
      ...activity,
      leadName: lead.client_name
    })))
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <ScrollArea className="h-[400px]">
        {isLoading ? (
          <ActivityTimelineSkeleton />
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-4 p-4 rounded-lg border animate-fade-in"
              >
                <div className="bg-muted p-2 rounded-full">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.leadName}</p>
                  <p className="text-sm text-muted-foreground">{activity.outcome || activity.notes}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ActivityTimeline;