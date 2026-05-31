import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, GenerateVideosOperation } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEYY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.post("/api/generate-calendar", async (req, res) => {
  try {
    const { productName, targetAudience, businessCategory, tone, usp, specialOffer, keywords } = req.body;

    if (!productName || !targetAudience) {
      return res.status(400).json({
        error: "Product name and target audience are required.",
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEYY environment variable is not configured. Please add it in Settings > Secrets.",
      });
    }

    const businessContext = businessCategory ? `Business Category/Niche: ${businessCategory}` : "";
    const toneContext = tone ? `Tone of voice: ${tone}` : "A friendly, persuasive, and highly engaging tone";
    const uspContext = usp ? `Key USP (Unique Selling Points): "${usp}"` : "";
    const offerContext = specialOffer ? `Special Offer/Active Promo: "${specialOffer}"` : "";
    const keywordsContext = keywords ? `Required Keywords/Keywords to include: "${keywords}"` : "";

    const promptText = `
Generate a highly engaging, custom 7-day social media content calendar for an Indonesian UMKM (small business) with the following details:
- Product name or brand: "${productName}"
- Target audience: "${targetAudience}"
${businessContext}
- Writing tone: "${toneContext}"
${uspContext}
${offerContext}
${keywordsContext}

The generated calendar must be highly customized to the product and audience. Ensure the captions use standard Indonesian marketing hooks, appropriate emojis, relatable storytelling context, clear pain-points of the target audience, and an appealing Call to Action (CTA) like 'Klik link di bio!', 'Komen di bawah!', or 'DM kami untuk order!'.
If a special offer or promo is provided ("${specialOffer}"), make sure to highlight it conspicuously in the hard selling/promo-themed days.
If key USPs are provided ("${usp}"), blend them naturally into the education or value posts.
If required keywords are provided ("${keywords}"), make sure they are included naturally in some captions.
The visual concepts should be actionable, specifying image or short video (Reels/TikTok) guidelines, text overlays, and music ideas.
`;

    // Strict Schema implementation following @google/genai guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        systemInstruction: `You are an expert social media manager, strategist, and copywriter specializing in Indonesian UMKM (Usaha Mikro, Kecil, dan Menengah) growth. You create highly creative, strategic, and high-conversion content planners. You output the response strictly matching the requested JSON Schema. All day values should be numbers 1 to 7. All captions and themes should be in Indonesian, using appropriate local abbreviations, colloquialisms, or slang if requested by target audience, or clean professional Indonesian as appropriate. Emojis must be embedded naturally in the captions.`,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER, description: "Day number from 1 to 7." },
              theme: { type: Type.STRING, description: "The visual/communication theme of the post (e.g. Edukasi Produk, Hard Selling, Behind The Scenes, Testimoni)." },
              visual_concept: { type: Type.STRING, description: "Actionable details on what image or video to produce, text layouts, overlays, story templates or TikTok/Reels sound recommendation." },
              caption: { type: Type.STRING, description: "Ready-to-copy caption in Indonesian with engaging copy hooks, line breaks for legibility, emojis, and clear local Indonesian Call to Action (CTA)." },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 3-7 relevant high-traffic and niche hashtags tailored for this product and local Indonesian reach."
              }
            },
            required: ["day", "theme", "visual_concept", "caption", "hashtags"]
          }
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response text received from Gemini API");
    }

    const calendarData = JSON.parse(responseText.trim());
    res.json({ success: true, data: calendarData });
  } catch (error: any) {
    console.error("API Error during calendar generation:", error);
    let errorMsg = "Gagal membuat draf rencana konten.";
    const errMsg = (error.message || String(error)).toLowerCase();
    if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit: 0")) {
      errorMsg = "Kuota gratis harian API Key Gemini Anda telah habis. Silakan gunakan atau aktifkan API Key berbayar dari menu Settings > Secrets atau tunggu kuota diperbarui besok secara otomatis.";
    }
    res.status(500).json({
      error: errorMsg,
      details: error.message || String(error)
    });
  }
});

// API Routes for Veo Video Generation (Veo 3.1 Lite)
app.post("/api/generate-video", async (req, res) => {
  try {
    const { visualConcept, productName, aspectRatio } = req.body;
    if (!visualConcept) {
      return res.status(400).json({ error: "Visual concept is required to generate video." });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEYY environment variable is not configured. Please configure it in Settings > Secrets.",
      });
    }

    // Refinement prompt optimized for Veo text-to-video prompt format (vibe-first, cinematic, clear colors, high quality)
    const promptExpansionText = `
Convert and expand the following Indonesian visual concept into a detailed, high-quality, professional English text prompt optimized for AI video generation (Veo). The prompt should be cinematic, modern, realistic, with beautiful lighting, dynamic camera movements, rich color grading, and perfect clarity for a commercial/social media ad for "${productName || 'product'}".

Visual Concept: "${visualConcept}"

Provide ONLY the final expanded English prompt to be used directly in Veo, with no extra commentary or markdown formatting. Keep it within 30-70 words.
`;

    const expansionResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptExpansionText,
    });

    const refinedPrompt = (expansionResponse.text || visualConcept || "Professional commercial setup of the product with scenic background").trim();
    console.log("Veo video prompt expanded to:", refinedPrompt);

    // Call generateVideos inside the server-side context using veo-3.1-lite-generate-preview or similar
    const operation = await ai.models.generateVideos({
      model: "veo-3.1-lite-generate-preview",
      prompt: refinedPrompt,
      config: {
        numberOfVideos: 1,
        resolution: "1080p", // Standard resolution
        aspectRatio: aspectRatio || "9:16", // 9:16 is optimized for Reels/Shorts/TikTok
      },
    });

    res.json({
      success: true,
      operationName: operation.name,
      promptUsed: refinedPrompt,
    });
  } catch (error: any) {
    console.error("Veo video generation initiation failed:", error);
    let errorMsg = "Gagal memulai pembuatan video promosi.";
    const errMsg = (error.message || String(error)).toLowerCase();
    if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit: 0")) {
      errorMsg = "Kuota API Key Gemini gratis Anda tidak mencukupi atau fitur video Veo ini memerlukan API Key berbayar di AI Studio. Silakan gunakan atau hubungkan API Key berbayar dari menu Settings > Secrets.";
    }
    res.status(500).json({
      error: errorMsg,
      details: error.message || String(error),
    });
  }
});

app.post("/api/video-status", async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: "Operation name is required." });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEYY is not configured." });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      success: true,
      done: updated.done,
      status: updated.metadata?.status || (updated.done ? "COMPLETED" : "PROCESSING"),
    });
  } catch (error: any) {
    console.error("Veo video polling failed:", error);
    res.status(500).json({
      error: "Gagal memproses status video.",
      details: error.message || String(error),
    });
  }
});

app.get("/api/video-download", async (req, res) => {
  try {
    const operationName = req.query.operationName as string;
    if (!operationName) {
      return res.status(400).send("Operation name is required.");
    }

    if (!apiKey) {
      return res.status(500).send("GEMINI_API_KEYY environment variable is not configured.");
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).send("File video belum siap atau tidak ditemukan.");
    }

    console.log("Downloading generated video from Veo:", uri);
    const videoRes = await fetch(uri, {
      headers: { "x-goog-api-key": apiKey },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to fetch from Google Veo server: ${videoRes.statusText}`);
    }

    res.setHeader("Content-Type", "video/mp4");

    const reader = videoRes.body;
    if (!reader) {
      return res.status(500).send("Video body is empty.");
    }

    if (typeof (reader as any).pipe === "function") {
      (reader as any).pipe(res);
    } else {
      const nodeBuffer = Buffer.from(await videoRes.arrayBuffer());
      res.send(nodeBuffer);
    }
  } catch (error: any) {
    console.error("Veo video streaming error:", error);
    if (!res.headersSent) {
      res.status(500).send("Gagal mengunduh file video dari Google.");
    }
  }
});

// API Routes for Nano Banana Image Generation (gemini-2.5-flash-image)
app.post("/api/generate-image", async (req, res) => {
  try {
    const { visualConcept, productName, aspectRatio } = req.body;
    if (!visualConcept) {
      return res.status(400).json({ error: "Visual concept is required to generate image." });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEYY environment variable is not configured. Please configure it in Settings > Secrets.",
      });
    }

    // Refinement/Expansion prompt for image generation
    const promptExpansionText = `
Convert and expand the following Indonesian visual concept into a detailed, high-quality, professional English text prompt optimized for AI image generation (gemini-2.5-flash-image). The prompt should be modern, realistic, showcasing the product with gorgeous professional lighting, studio setup or photorealistic lifestyle backdrop, vibrant colors, clean details, and stellar commercial/advertisement look for "${productName || 'product'}".

Visual Concept: "${visualConcept}"

Provide ONLY the final expanded English prompt to be used directly, with no extra commentary or markdown formatting. Keep it within 30-60 words.
`;

    const expansionResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptExpansionText,
    });

    const refinedPrompt = (expansionResponse.text || visualConcept || "Professional studio commercial product catalog photo").trim();
    console.log("Nano Banana image prompt expanded to:", refinedPrompt);

    // Call generateContent with gemini-2.5-flash-image
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: refinedPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
        },
      },
    });

    let imageUrl = null;
    const parts = imageResponse.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "Gagal mendapatkan data gambar dari Gemini Image API.",
      });
    }

    res.json({
      success: true,
      imageUrl,
      promptUsed: refinedPrompt,
    });
  } catch (error: any) {
    console.error("Nano Banana image generation failed:", error);
    let errorMsg = "Gagal menghasilkan gambar promosi.";
    const errMsg = (error.message || String(error)).toLowerCase();
    if (errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit: 0")) {
      errorMsg = "Kuota API Key Gemini gratis Anda tidak mencukupi atau model Nano Banana (gemini-2.5-flash-image) ini memerlukan API Key berbayar di AI Studio. Silakan gunakan atau hubungkan API Key berbayar dari menu Settings > Secrets.";
    }
    res.status(500).json({
      error: errorMsg,
      details: error.message || String(error),
    });
  }
});

// Configure Vite middleware for dev
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

// On Vercel, we only export the app. 
// Locally, we start the server for development.
if (!process.env.VERCEL) {
  startServer();
}

export default app;
