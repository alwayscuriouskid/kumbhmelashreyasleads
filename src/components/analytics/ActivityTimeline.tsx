import { ScrollArea } from "@/components/ui/scroll-area";
import { PhoneCall, Calendar, Mail, MessageSquare } from "lucide-react";

const activities = [
  {
    id: 1,
    type: 'call',
    leadName: 'ABC Corp',
    description: 'Follow-up call about proposal',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'meeting',
    leadName: 'XYZ Ltd',
    description: 'Initial requirements gathering',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'email',
    leadName: 'Tech Solutions',
    description: 'Sent pricing details',
    time: '1 day ago',
  },
];

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

const ActivityTimeline = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border">
              <div className="bg-muted p-2 rounded-full">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.leadName}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActivityTimeline;