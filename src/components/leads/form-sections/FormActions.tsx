import { Button } from "@/components/ui/button";

interface FormActionsProps {
  mode: "add" | "edit";
  onCancel: () => void;
}

export const FormActions = ({ mode, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {mode === "add" ? "Add Lead" : "Save Changes"}
      </Button>
    </div>
  );
};