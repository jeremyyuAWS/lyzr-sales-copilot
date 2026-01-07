import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { hubspot_deal_id, comment } = await req.json();

    if (!hubspot_deal_id || !comment) {
      return new Response(
        JSON.stringify({ error: 'Missing hubspot_deal_id or comment' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const hubspotAccessToken = Deno.env.get('HUBSPOT_ACCESS_TOKEN');

    if (!hubspotAccessToken) {
      console.log('Running in demo mode - simulating HubSpot sync');
      const mockNoteId = `demo-note-${Date.now()}`;
      return new Response(
        JSON.stringify({
          success: true,
          hubspot_note_id: mockNoteId,
          demo_mode: true,
          message: 'Comment synced successfully (demo mode)'
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const hubspotResponse = await fetch(
      `https://api.hubapi.com/crm/v3/objects/deals/${hubspot_deal_id}/notes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            hs_note_body: comment,
            hs_timestamp: new Date().toISOString(),
          },
        }),
      }
    );

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text();
      console.error('HubSpot API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to sync to HubSpot', details: errorText }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const result = await hubspotResponse.json();

    return new Response(
      JSON.stringify({ success: true, hubspot_note_id: result.id }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});