import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Lead } from "@/types/leads";
import * as XLSX from 'xlsx';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload } from "lucide-react";

interface ImportLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

const ImportLeadsDialog = ({ open, onOpenChange, onImportComplete }: ImportLeadsDialogProps) => {
  const [previewData, setPreviewData] = useState<Partial<Lead>[]>([]);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const validateLeadData = (data: any): Partial<Lead> => {
    const requiredFields = ['clientName', 'location', 'contactPerson', 'phone', 'email'];
    const lead: Partial<Lead> = {
      clientName: data['Client Name'] || data['clientName'],
      location: data['Location'] || data['location'],
      contactPerson: data['Contact Person'] || data['contactPerson'],
      phone: data['Phone'] || data['phone'],
      email: data['Email'] || data['email'],
      status: data['Status'] || data['status'] || 'pending',
      requirement: {},
      remarks: data['Remarks'] || data['remarks'],
      budget: data['Budget'] || data['budget'],
      leadRef: data['Lead Reference'] || data['leadRef'],
      leadSource: data['Lead Source'] || data['leadSource'],
    };

    const missingFields = requiredFields.filter(field => !lead[field as keyof Lead]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return lead;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const validatedData = jsonData.map((row: any) => validateLeadData(row));
        setPreviewData(validatedData);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse Excel file');
        setPreviewData([]);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    try {
      const { data, error } = await fetch('/api/leads/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leads: previewData }),
      }).then(res => res.json());

      if (error) throw new Error(error);

      toast({
        title: "Import Successful",
        description: `Successfully imported ${previewData.length} leads`,
      });
      onImportComplete();
      onOpenChange(false);
      setPreviewData([]);
    } catch (err) {
      toast({
        title: "Import Failed",
        description: err instanceof Error ? err.message : 'Failed to import leads',
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Leads from Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="flex-1"
            />
            <Button onClick={() => window.open('/template/leads-import-template.xlsx')}>
              Download Template
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Preview of {previewData.length} leads to be imported:
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 5).map((lead, index) => (
                      <TableRow key={index}>
                        <TableCell>{lead.clientName}</TableCell>
                        <TableCell>{lead.location}</TableCell>
                        <TableCell>{lead.contactPerson}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {previewData.length > 5 && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    And {previewData.length - 5} more leads...
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImport} disabled={previewData.length === 0}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import {previewData.length} Leads
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportLeadsDialog;