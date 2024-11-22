import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamMembers } from "@/hooks/useTeamMembers";

interface AssignedToSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AssignedToSelect = ({ value, onChange }: AssignedToSelectProps) => {
  const { data: teamMembers, isLoading } = useTeamMembers();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="assignedTo">Assigned To</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select team member" />
        </SelectTrigger>
        <SelectContent>
          {teamMembers?.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};