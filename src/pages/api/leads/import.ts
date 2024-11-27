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

    const { data, error } = await supabase
      .from('leads')
      .insert(leads.map(lead => frontendToDB(lead)))
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