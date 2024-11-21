import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CustomStatusInputProps {
  onAddStatus: (status: string) => void;
}

const CustomStatusInput = ({ onAddStatus }: CustomStatusInputProps) => {
  const [newStatus, setNewStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus.trim()) {
      onAddStatus(newStatus.trim().toLowerCase());
      setNewStatus("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        placeholder="Enter custom status..."
        className="flex-1"
      />
      <Button type="submit" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Status
      </Button>
    </form>
  );
};

export default CustomStatusInput;