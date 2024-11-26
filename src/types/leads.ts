import { Activity } from './activity';

export interface Lead {
  id: string;
  date: string;
  clientName: string;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  requirement: any;
  status: string;
  remarks?: string;
  budget?: string;
  leadRef?: string;
  leadSource?: string;
  priceQuoted?: number;
  teamMemberId?: string;
  conversionStatus?: string;
  conversionDate?: string;
  conversionType?: string;
  activityType?: string;
  activityOutcome?: string;
  activityNextAction?: string;
  activityNextActionDate?: string;
}

export type { Activity };