export interface Requirement {
  hoardings?: number;
  entryGates?: number;
  electricPoles?: number;
  watchTowers?: number;
  chargingPoints?: number;
  skyBalloons?: number;
  customRequirements?: string;
  [key: string]: number | string | undefined;
}

export interface FollowUp {
  id: string;
  date: string;
  notes: string;
  outcome: string;
  nextFollowUpDate?: string;
}

export interface Lead {
  id: string;
  date: string;
  clientName: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  requirement: Requirement;
  status: string;
  remarks: string;
  nextFollowUp?: string;
  budget?: string;
  followUps: FollowUp[];
}