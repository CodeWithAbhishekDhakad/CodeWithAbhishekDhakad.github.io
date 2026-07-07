import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PmEmailItem = {
  asset_tag?: string;
  asset_type?: string;
  location?: string;
  next_pm_date?: string;
  status?: string;
  technician?: string;
  remarks?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY is not configured in Supabase secrets" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const to = String(body.to || "").trim();
    const subject = String(body.subject || "PM Reminder - IT Asset Dashboard").trim();
    const from = String(body.from || "IT Asset PM <onboarding@resend.dev>").trim();
    const company = String(body.company || "IT Asset PM Dashboard").trim();
    const items: PmEmailItem[] = Array.isArray(body.items) ? body.items : [];

    if (!to) {
      return new Response(JSON.stringify({ error: "Missing recipient email (to)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = items.map((item) => `
      <tr>
        <td style="padding:8px;border:1px solid #e7eaf0;">${escapeHtml(item.asset_tag || "-")}</td>
        <td style="padding:8px;border:1px solid #e7eaf0;">${escapeHtml(item.asset_type || "-")}</td>
        <td style="padding:8px;border:1px solid #e7eaf0;">${escapeHtml(item.location || "-")}</td>
        <td style="padding:8px;border:1px solid #e7eaf0;">${escapeHtml(item.next_pm_date || "-")}</td>
        <td style="padding:8px;border:1px solid #e7eaf0;">${escapeHtml(item.status || "-")}</td>
        <td style="padding:8px;border:1px solid #e7eaf0;">${escapeHtml(item.technician || "-")}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family:Arial,sans-serif;color:#172033;max-width:720px;">
        <h2 style="color:#2563eb;">${escapeHtml(company)} - Preventive Maintenance Reminder</h2>
        <p>The following PM items need attention:</p>
        <table style="border-collapse:collapse;width:100%;font-size:14px;">
          <thead>
            <tr style="background:#f5f7fb;">
              <th style="padding:8px;border:1px solid #e7eaf0;text-align:left;">Asset Tag</th>
              <th style="padding:8px;border:1px solid #e7eaf0;text-align:left;">Type</th>
              <th style="padding:8px;border:1px solid #e7eaf0;text-align:left;">Location</th>
              <th style="padding:8px;border:1px solid #e7eaf0;text-align:left;">Next PM</th>
              <th style="padding:8px;border:1px solid #e7eaf0;text-align:left;">Status</th>
              <th style="padding:8px;border:1px solid #e7eaf0;text-align:left;">Technician</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="6" style="padding:12px;">No PM items included.</td></tr>'}</tbody>
        </table>
        <p style="color:#667085;font-size:12px;margin-top:20px;">Sent from IT Asset &amp; PM Dashboard.</p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      return new Response(JSON.stringify({
        error: resendData.message || "Resend API error",
        details: resendData,
      }), {
        status: resendRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
