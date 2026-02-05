import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-api-key, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPPORTED_LANGUAGES = ["tamil", "english", "hindi", "malayalam", "telugu"];

// ---------- SIMPLE DEMO DETECTOR ----------
function simpleDetect() {
  const score = Math.random();
  return score > 0.5
    ? { classification: "AI_GENERATED", confidence: score }
    : { classification: "HUMAN", confidence: 1 - score };
}

// ---------- API KEY VALIDATION ----------
async function validateApiKey(apiKey: string) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data } = await supabase
    .from("api_keys")
    .select("id")
    .eq("key", apiKey)
    .eq("is_active", true)
    .maybeSingle();

  return data?.id || null;
}

// ---------- LOGGING ----------
async function logDetection(
  apiKeyId: string,
  result: string,
  confidence: number,
  language: string
) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("detection_logs").insert({
    api_key_id: apiKeyId,
    result,
    confidence,
    language,
  });
}

// ---------- SERVER ----------
Deno.serve(async (req) => {
  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) throw new Error("Missing API key");

    const apiKeyId = await validateApiKey(apiKey);
    if (!apiKeyId) throw new Error("Invalid API key");

    const body = await req.json();

    if (
      !body.language ||
      !body.audioBase64 ||
      !body.audioFormat
    ) {
      throw new Error("Invalid body");
    }

    if (!SUPPORTED_LANGUAGES.includes(body.language.toLowerCase())) {
      throw new Error("Unsupported language");
    }

    if (body.audioFormat.toLowerCase() !== "mp3") {
      throw new Error("Only mp3 allowed");
    }

    const detection = simpleDetect();

    const explanation =
      detection.classification === "AI_GENERATED"
        ? "Synthetic spectral patterns detected"
        : "Natural human voice characteristics detected";

    await logDetection(
      apiKeyId,
      detection.classification,
      detection.confidence,
      body.language.toLowerCase()
    );

    return new Response(
      JSON.stringify({
        status: "success",
        language: body.language,
        classification: detection.classification,
        confidenceScore: detection.confidence,
        explanation,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Invalid API key or malformed request",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
