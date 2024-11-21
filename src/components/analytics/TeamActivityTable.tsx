import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  teamMember: string;
  date: string;
  leadName: string;
  statusChange?: {
    from: string;
    to: string;
  };
}

// Updated mock data to include status changes
const activities: Activity[] = [
  {
    id: "1",
    type: "call",
    description: "Follow-up call with ABC Corp",
    time: "10:00 AM",
    teamMember: "john",
    date: "2024-03-20",
    leadName: "ABC Corp"
  },
  {
    id: "2",
    type: "status_change",
    description: "Lead status updated for XYZ Ltd",
    time: "2:00 PM",
    teamMember: "jane",
    date: "2024-03-20",
    leadName: "XYZ Ltd",
    statusChange: {
      from: "pending",
      to: "approved"
    }
  },
  {
    id: "3",
    type: "status_change",
    description: "Lead status updated for Tech Solutions",
    time: "11:30 AM",
    teamMember: "mike",
    date: "2024-03-20",
    leadName: "Tech Solutions",
    statusChange: {
      from: "followup",
      to: "approved"
    }
  },
];

interface TeamActivityTableProps {
  selectedDate?: Date;
  selectedTeamMember?: string;
}

const TeamActivityTable = ({ selectedDate: propSelectedDate, selectedTeamMember: propSelectedTeamMember }: TeamActivityTableProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(propSelectedDate);
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>(propSelectedTeamMember || 'all');
  const [activityType, setActivityType] = useState<string>('all');

  console.log("Rendering TeamActivityTable with filters:", { selectedDate, selectedTeamMember, activityType });

  const filteredActivities = activities.filter((activity) => {
    if (selectedTeamMember && selectedTeamMember !== "all" && activity.teamMember !== selectedTeamMember) {
      return false;
    }
    if (selectedDate && activity.date !== format(selectedDate, "yyyy-MM-dd")) {
      return false;
    }
    if (activityType !== 'all' && activity.type !== activityType) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-500",
      approved: "bg-green-500/20 text-green-500",
      rejected: "bg-red-500/20 text-red-500",
      followup: "bg-blue-500/20 text-blue-500"
    };
    return colors[status] || "bg-gray-500/20 text-gray-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team Member Activities</h3>
        <div className="flex gap-4">
          <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="jane">Jane Smith</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="status_change">Status Changes</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
            </SelectContent>
          </Select>
          
          <DatePicker
            selected={selectedDate}
            onSelect={setSelectedDate}
            placeholderText="Select date"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Team Member</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Status Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>{activity.time}</TableCell>
              <TableCell className="capitalize">{activity.type.replace('_', ' ')}</TableCell>
              <TableCell>{activity.description}</TableCell>
              <TableCell className="capitalize">{activity.teamMember}</TableCell>
              <TableCell>{activity.leadName}</TableCell>
              <TableCell>
                {activity.statusChange && (
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(activity.statusChange.from)}>
                      {activity.statusChange.from}
                    </Badge>
                    →
                    <Badge className={getStatusBadge(activity.statusChange.to)}>
                      {activity.statusChange.to}
                    </Badge>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {filteredActivities.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No activities found for the selected filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeamActivityTable;