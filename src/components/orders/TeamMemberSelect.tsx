import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";

interface TeamMemberSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TeamMemberSelect = ({ value, onChange, className }: TeamMemberSelectProps) => {
  const { data: teamMembers } = useTeamMemberOptions();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
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
  );
};