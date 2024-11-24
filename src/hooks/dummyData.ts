import { Lead } from "@/types/leads";

export const dummyLeads: Lead[] = [
  {
    id: "1",
    date: new Date().toISOString().split('T')[0],
    clientName: "ABC Corp",
    location: "Mumbai",
    contactPerson: "Raj Kumar",
    phone: "9876543210",
    email: "raj@abccorp.com",
    requirement: {
      hoardings: 5,
      entryGates: 2,
      foodStalls: 3
    },
    status: "prospect",
    remarks: "Interested in event setup",
    budget: "₹500,000",
    leadSource: "Website",
    activityNextActionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    activityNextAction: "Schedule meeting",
    activityOutcome: "Positive initial contact",
    activities: [
      {
        id: "a1",
        type: "call",
        date: new Date().toISOString(),
        outcome: "Initial contact made",
        notes: "Client showed interest in our services",
        assignedTo: "John Smith",
        contactPerson: "Raj Kumar",
        description: "Follow-up call about proposal",
        teamMember: "John Smith",
        leadName: "ABC Corp",
        time: "10:00 AM"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    date: new Date().toISOString().split('T')[0],
    clientName: "XYZ Ltd",
    location: "Delhi",
    contactPerson: "Priya Singh",
    phone: "8765432109",
    email: "priya@xyzltd.com",
    requirement: {
      ledHoardingSpots: 3,
      skyBalloons: 1,
      webSeries: 1
    },
    status: "negotiation",
    remarks: "Budget discussion pending",
    budget: "₹750,000",
    leadSource: "Referral",
    activityNextActionDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    activityNextAction: "Follow up on proposal",
    activityOutcome: "Reviewing proposal",
    activities: [
      {
        id: "a2",
        type: "meeting",
        date: new Date().toISOString(),
        outcome: "Proposal presented",
        notes: "Client requested detailed pricing",
        assignedTo: "Sarah Johnson",
        contactPerson: "Priya Singh",
        description: "Initial requirements gathering",
        teamMember: "Sarah Johnson",
        leadName: "XYZ Ltd",
        time: "2:30 PM"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];