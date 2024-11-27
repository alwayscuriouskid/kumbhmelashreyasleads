import { supabase } from "@/integrations/supabase/client";
import { Lead, frontendToDB } from "@/types/leads";

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
      const dbLead = frontendToDB(lead);
      if (!dbLead.client_name || !dbLead.location || !dbLead.contact_person || 
          !dbLead.phone || !dbLead.email) {
        throw new Error('Missing required fields');
      }
      return dbLead;
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