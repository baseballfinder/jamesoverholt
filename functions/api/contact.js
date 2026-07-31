// Cloudflare Pages Function - same-origin proxy for the contact form.
// Keeps the request on jamesoverholt.com so ad-blockers / privacy tools that
// block third-party calls to *.supabase.co cannot break the form, then forwards
// to the Supabase SECURITY DEFINER RPC. Publishable key is public-safe.
const CORS = {
  "Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
  };
export async function onRequestOptions() {
return new Response(null, { status: 204, headers: CORS });
}
export async function onRequestPost({ request, env }) {
const headers = { "Content-Type": "application/json", ...CORS };
try {
const data = await request.json().catch(() => ({}));
const SUPABASE_URL = env.SUPABASE_URL || "https://xeybjpnkepmaobhawngo.supabase.co";
const SUPABASE_KEY = env.SUPABASE_KEY || "sb_publishable_nCnSX0ZJY7ics63iQg901Q_N4nX7Nt1";
const s = (v) => (v == null ? null : String(v).trim());
const payload = {
p_name: s(data.name),
p_email: s(data.email),
p_message: s(data.message),
p_company: s(data.company) || null,
p_service: s(data.service) || null,
p_user_agent: request.headers.get("user-agent") || null
};
if (!payload.p_name || !payload.p_email || !payload.p_message) {
return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), { status: 400, headers });
}
const r = await fetch(SUPABASE_URL + "/rest/v1/rpc/submit_contact", {
method: "POST",
headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY },
body: JSON.stringify(payload)
});
if (!r.ok) {
const detail = await r.text().catch(() => "");
return new Response(JSON.stringify({ ok: false, error: "Upstream " + r.status, detail }), { status: 502, headers });
}
return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
} catch (e) {
return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers });
}
}
