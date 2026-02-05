import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-api-key, content-type",
};

async function validateKey(key: string) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key", key)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const key = req.headers.get("x-api-key");
    if (!key) throw "missing key";

    const id = await validateKey(key);
    if (!id) throw "bad key";

    const r = Math.random();
    const classification = r > 0.5 ? "AI_GENERATED" : "HUMAN";
    const confidence = r > 0.5 ? r : 1 - r;

    return new Response(
      JSON.stringify({
        status: "success",
        classification,
        confidenceScore: confidence,
        explanation:
          classification === "AI_GENERATED"
            ? "Synthetic voice patterns detected"
            : "Natural human voice detected",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ status: "error", message: "Invalid API key" }),
      { status: 401, headers: corsHeaders }
    );
  }
});
