import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamMemberOptions } from "@/hooks/useTeamMemberOptions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface TeamMemberSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  allowCreate?: boolean;
}

export const TeamMemberSelect = ({ value, onChange, className, allowCreate = true }: TeamMemberSelectProps) => {
  const { data: teamMembers, refetch } = useTeamMemberOptions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "" });

  const handleAddMember = async () => {
    try {
      const { error } = await supabase
        .from("team_members")
        .insert({
          name: newMember.name,
          email: newMember.email,
          role: 'sales',
          status: 'active',
          commission_rate: 0
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team member added successfully",
      });
      
      setShowAddDialog(false);
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
    <div className={className}>
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

      {allowCreate && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add New Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </div>
              <Button onClick={handleAddMember}>Add Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};