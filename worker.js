const ALLOWED_ORIGIN = "https://devarshhb2424.github.io";

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      });
    }

    try {
      const body = await request.json();

      if (!body.text || typeof body.text !== "string") {
        return new Response(
          JSON.stringify({ error: "Missing text" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            },
          }
        );
      }

      const sarvamResponse = await fetch(
        "https://api.sarvam.ai/text-to-speech",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": env.SARVAM_API_KEY,
          },
          body: JSON.stringify({
            text: body.text,
            target_language_code: "gu-IN",
            model: "bulbul:v3",
            speaker: "ratan",
            pace: 1,
            speech_sample_rate: 22050,
            output_audio_codec: "mp3",
          }),
        }
      );

      const responseText = await sarvamResponse.text();

      return new Response(responseText, {
        status: sarvamResponse.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        },
      });

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "TTS proxy error",
          message: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          },
        }
      );
    }
  },
};