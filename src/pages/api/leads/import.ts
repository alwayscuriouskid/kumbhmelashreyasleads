import { supabase } from "@/integrations/supabase/client";
import { Lead, frontendToDB } from "@/types/leads";

type RequiredLeadFields = {
  client_name: string;
  location: string;
  contact_person: string;
  phone: string;
  email: string;
  requirement: Record<string, any>;
  status: string;
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { leads } = await req.json();

    if (!Array.isArray(leads)) {
      throw new Error('Invalid leads data');
    }

    // Convert leads to DB format and ensure required fields
    const dbLeads = leads.map(lead => {
      const dbLead = frontendToDB(lead) as RequiredLeadFields;
      
      if (!dbLead.client_name || !dbLead.location || !dbLead.contact_person || 
          !dbLead.phone || !dbLead.email) {
        throw new Error('Missing required fields');
      }

      return {
        client_name: dbLead.client_name,
        location: dbLead.location,
        contact_person: dbLead.contact_person,
        phone: dbLead.phone,
        email: dbLead.email,
        requirement: dbLead.requirement || {},
        status: dbLead.status || 'pending',
        budget: lead.budget,
        lead_ref: lead.leadRef,
        lead_source: lead.leadSource,
        remarks: lead.remarks,
      };
    });

    const { data, error } = await supabase
      .from('leads')
      .insert(dbLeads)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error importing leads:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to import leads' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}