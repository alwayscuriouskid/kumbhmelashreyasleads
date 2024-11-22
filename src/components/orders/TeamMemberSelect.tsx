import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TeamMemberSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const TeamMemberSelect = ({ value, onChange }: TeamMemberSelectProps) => {
  const { data: teamMembers, refetch } = useTeamMemberOptions();
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "" });

  const handleAddMember = async () => {
    try {
      const { error } = await supabase
        .from("team_members")
        .insert([{
          name: newMember.name,
          email: newMember.email,
          role: 'sales',
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member added successfully",
      });
      
      setIsAddingMember(false);
      setNewMember({ name: "", email: "" });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select team member" />
        </SelectTrigger>
        <SelectContent className="z-[100]">
          {teamMembers?.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2">
            Add New Member
          </Button>
        </DialogTrigger>
        <DialogContent className="z-[100]">
          <DialogHeader>
            <DialogTitle>Add New Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember({ ...newMember, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
              />
            </div>
            <Button onClick={handleAddMember}>Add Member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};