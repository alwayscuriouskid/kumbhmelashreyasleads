import { Lead } from "@/types/leads";

export const dummyLeads: Lead[] = [
  {
    id: "1",
    date: new Date().toISOString().split('T')[0],
    clientName: "Example Client 1",
    location: "City 1",
    contactPerson: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    requirement: {},
    status: "pending",
    remarks: "Initial contact made",
    budget: "50000",
    leadRef: "REF001",
    leadSource: "Website"
  },
  {
    id: "2",
    date: new Date().toISOString().split('T')[0],
    clientName: "Example Client 2",
    location: "City 2",
    contactPerson: "Jane Smith",
    phone: "0987654321",
    email: "jane@example.com",
    requirement: {},
    status: "prospect",
    remarks: "Follow-up scheduled",
    budget: "75000",
    leadRef: "REF002",
    leadSource: "Referral"
  }
];