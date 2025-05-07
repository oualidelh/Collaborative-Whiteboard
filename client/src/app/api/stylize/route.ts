// import { NextResponse, NextRequest } from "next/server";
// import { Client } from "@gradio/client";
// import { stylePrompts } from "@/lib/style-prompts";
// import type { StyleOption } from "@/lib/style-prompts";
// import { analyzeImageContent } from "@/utils/image-analyzer";
// import {
//   createEnhancedPrompt,
//   recommendStrength,
//   recommendIterations,
// } from "@/utils/prompt-enhancer";

// export const config = {
//   runtime: "nodejs",
// };

// // Types for API request
// interface StyleRequest {
//   imageData: string;
//   style: StyleOption;
//   iterations?: number;
//   strength?: number;
//   seed?: number;
//   enhanceBackground?: boolean;
//   fillEmptySpaces?: boolean;
// }

// // Types for image processing
// interface ProcessImageOptions {
//   imageInput: string | Blob;
//   prompt?: string;
//   iterations?: number;
//   seed?: number;
//   strength?: number;
// }

// interface ProcessImageResult {
//   success: boolean;
//   imageDataUrl?: string;
//   imageUrl?: string;
//   error?: string;
// }

// /**
//  * Convert a base64 string to a Blob
//  */
// function base64ToBlob(dataUrl: string): Blob {
//   const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

//   if (!matches || matches.length !== 3) {
//     throw new Error("Invalid base64 image format");
//   }

//   const contentType = matches[1];
//   const base64Data = matches[2];
//   const binaryString = atob(base64Data);
//   const byteArray = new Uint8Array(binaryString.length);

//   for (let i = 0; i < binaryString.length; i++) {
//     byteArray[i] = binaryString.charCodeAt(i);
//   }

//   return new Blob([byteArray], { type: contentType });
// }

// /**
//  * Process an image using the SDXL API (server-side only)
//  */
// async function processImage({
//   imageInput,
//   prompt = "fantasy landscape",
//   iterations = 1,
//   seed = 0,
//   strength = 0.5,
// }: ProcessImageOptions): Promise<ProcessImageResult> {
//   try {
//     console.log("Starting image processing...");

//     let imageBlob: Blob;

//     // Handle different image input types
//     if (typeof imageInput === "string") {
//       if (imageInput.startsWith("data:")) {
//         // Convert base64 string to Blob
//         imageBlob = base64ToBlob(imageInput);
//       } else if (imageInput.startsWith("http")) {
//         // Handle URL input
//         console.log(`Fetching image from URL: ${imageInput}`);
//         const response = await fetch(imageInput);
//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch image: ${response.status} ${response.statusText}`
//           );
//         }
//         imageBlob = await response.blob();
//       } else {
//         throw new Error("Image input must be a data URL, web URL, or Blob");
//       }
//     } else if (imageInput instanceof Blob) {
//       // Use the blob directly
//       imageBlob = imageInput;
//     } else {
//       throw new Error("Invalid image input type");
//     }

//     // Connect to the API
//     console.log("Connecting to SDXL-Turbo-Img2Img-CPU API...");
//     const app = await Client.connect("sweetpotatoman/SDXL-Turbo-Img2Img-CPU");

//     // Log parameters
//     console.log(`Parameters:
// - Prompt: "${prompt}"
// - Iterations: ${iterations}
// - Seed: ${seed}
// - Strength: ${strength}`);

//     // Make the prediction
//     console.log("Processing image...");

//     // Pass the params to the API
//     const result = await app.predict("/predict", [
//       imageBlob,
//       prompt,
//       parseInt(String(iterations), 10),
//       parseInt(String(seed), 10),
//       parseFloat(String(strength)),
//     ]);

//     console.log("Processing completed. Checking result...");

//     if (result && result.data) {
//       console.log("Result received");

//       // The API returns an object with a URL to the generated image
//       if (Array.isArray(result.data) && result.data[0] && result.data[0].url) {
//         const imageUrl = result.data[0].url;
//         console.log(`Image URL received: ${imageUrl}`);

//         // Download the image from the provided URL
//         const imageResponse = await fetch(imageUrl);
//         if (!imageResponse.ok) {
//           throw new Error(
//             `Failed to download generated image: ${imageResponse.status} ${imageResponse.statusText}`
//           );
//         }

//         // Get the image data as ArrayBuffer
//         const imageData = await imageResponse.arrayBuffer();

//         // Convert to base64
//         const base64 = Buffer.from(imageData).toString("base64");
//         const mimeType =
//           imageResponse.headers.get("content-type") || "image/png";
//         const dataUrl = `data:${mimeType};base64,${base64}`;

//         return {
//           success: true,
//           imageDataUrl: dataUrl,
//           imageUrl,
//         };
//       }
//       // Handle the case where the API returns a base64 string directly
//       else if (typeof result.data === "string") {
//         // Ensure it has the data:image prefix
//         let dataUrl = result.data;
//         if (!dataUrl.startsWith("data:")) {
//           dataUrl = `data:image/png;base64,${dataUrl}`;
//         }

//         return {
//           success: true,
//           imageDataUrl: dataUrl,
//         };
//       } else {
//         console.log("Unexpected response format:", result.data);
//         throw new Error("Unexpected response format from API");
//       }
//     } else {
//       console.log("Received result:", result);
//       throw new Error("Invalid or empty response from API");
//     }
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     console.error("❌ Error details:", error);
//     return {
//       success: false,
//       error: errorMessage,
//     };
//   }
// }

// /**
//  * Gets a random seed value from the API
//  */
// async function getRandomSeed(): Promise<number> {
//   try {
//     console.log("Fetching random seed value...");
//     const app = await Client.connect("sweetpotatoman/SDXL-Turbo-Img2Img-CPU");
//     const result = await app.predict("/get_random_value", []);

//     if (result && result.data !== undefined) {
//       const seed = parseInt(String(result.data), 10);
//       console.log(`Random seed generated: ${seed}`);
//       return seed;
//     } else {
//       console.error("❌ Invalid random seed response:", result);
//       return Math.floor(Math.random() * 1000000); // Fallback
//     }
//   } catch (error) {
//     console.error("❌ Error fetching random seed:", error);
//     return Math.floor(Math.random() * 1000000); // Fallback
//   }
// }

// /**
//  * Main API handler for POST requests
//  */
// export async function POST(request: NextRequest) {
//   try {
//     // Parse and validate request body
//     const body = (await request.json()) as StyleRequest;
//     const {
//       imageData,
//       style,
//       iterations,
//       strength,
//       seed,
//       enhanceBackground = true,
//       fillEmptySpaces = true,
//     } = body;

//     // Validate required fields
//     if (!imageData) {
//       return NextResponse.json(
//         { success: false, error: "Image data is required" },
//         { status: 400 }
//       );
//     }

//     if (!style) {
//       return NextResponse.json(
//         { success: false, error: "Style is required" },
//         { status: 400 }
//       );
//     }

//     // Check if style is valid
//     if (!Object.keys(stylePrompts).includes(style)) {
//       return NextResponse.json(
//         { success: false, error: "Invalid style option" },
//         { status: 400 }
//       );
//     }

//     // NEW: Analyze the image content
//     console.log("Analyzing image content...");
//     const imageAnalysis = await analyzeImageContent(imageData);
//     console.log("Image analysis complete:", JSON.stringify(imageAnalysis));

//     // NEW: Create enhanced prompt based on image analysis
//     const prompt = createEnhancedPrompt(style, imageAnalysis, {
//       enhanceBackground,
//       fillEmptySpaces,
//       addAtmosphericElements: true,
//       preserveStyle: true,
//     });
//     console.log("Enhanced prompt created:", prompt);

//     // NEW: Use recommended parameters if not provided
//     const safeIterations =
//       iterations !== undefined
//         ? Math.min(Math.max(iterations, 1), 5)
//         : recommendIterations(imageAnalysis);

//     const safeStrength =
//       strength !== undefined
//         ? Math.min(Math.max(strength, 0.1), 1.0)
//         : recommendStrength(imageAnalysis);

//     console.log(
//       `Using parameters: iterations=${safeIterations}, strength=${safeStrength}`
//     );

//     // Use a random seed if not provided
//     const finalSeed = seed || (await getRandomSeed());

//     // Process the image
//     console.log(`Processing image with style: ${style}`);
//     const result = await processImage({
//       imageInput: imageData,
//       prompt,
//       iterations: safeIterations,
//       seed: parseInt(String(finalSeed)),
//       strength: safeStrength,
//     });

//     if (!result.success) {
//       return NextResponse.json(
//         { success: false, error: result.error || "Failed to stylize image" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       styledImage: result.imageDataUrl,
//       originalPrompt: prompt, // Returning the prompt for debugging/learning
//       parameters: {
//         iterations: safeIterations,
//         strength: safeStrength,
//         seed: finalSeed,
//       },
//       analysis: imageAnalysis, // Return the analysis for client-side learning
//     });
//   } catch (error) {
//     console.error("Error processing style request:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error instanceof Error ? error.message : "Unknown error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

/**
 * Cancel API handler for POST requests
 */
// export async function cancel() {
//   return NextResponse.json({
//     success: true,
//     message: "Stylization canceled",
//   });
// }

import { NextResponse, NextRequest } from "next/server";
import { Client } from "@gradio/client";
import { stylePrompts } from "@/lib/style-prompts";
import type { StyleOption } from "@/lib/style-prompts";
import { analyzeImageContent } from "@/utils/image-analyzer";
import {
  createEnhancedPrompt,
  recommendStrength,
  recommendIterations,
} from "@/utils/prompt-enhancer";

// ✅ Ensure Vercel uses Node.js (not Edge Runtime)
export const config = {
  runtime: "nodejs",
};

// Request Body Types
interface StyleRequest {
  imageData: string;
  style: StyleOption;
  iterations?: number;
  strength?: number;
  seed?: number;
  enhanceBackground?: boolean;
  fillEmptySpaces?: boolean;
}

// Convert base64 to Buffer
function base64ToBuffer(dataUrl: string): Buffer {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 string");

  return Buffer.from(matches[2], "base64");
}

// Process Image using Gradio API
async function processImage({
  imageInput,
  prompt = "fantasy landscape",
  iterations = 1,
  seed = 0,
  strength = 0.5,
}: {
  imageInput: string;
  prompt?: string;
  iterations?: number;
  seed?: number;
  strength?: number;
}) {
  try {
    console.log("Connecting to Gradio app...");
    const app = await Client.connect("sweetpotatoman/SDXL-Turbo-Img2Img-CPU");

    const buffer = base64ToBuffer(imageInput);
    const blob = new Blob([buffer], { type: "image/png" });

    const result = await app.predict("/predict", [
      blob,
      prompt,
      iterations,
      seed,
      strength,
    ]);

    if (Array.isArray(result.data) && result.data[0]?.url) {
      const imageRes = await fetch(result.data[0].url);
      const arrayBuffer = await imageRes.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = imageRes.headers.get("content-type") || "image/png";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return {
        success: true,
        imageDataUrl: dataUrl,
        imageUrl: result.data[0].url,
      };
    }

    if (typeof result.data === "string") {
      const isDataUrl = result.data.startsWith("data:");
      return {
        success: true,
        imageDataUrl: isDataUrl
          ? result.data
          : `data:image/png;base64,${result.data}`,
      };
    }

    throw new Error("Unexpected API response");
  } catch (error) {
    console.error("❌ processImage error:", error);
    return {
      success: false,
      error: (error as Error).message || "Processing failed",
    };
  }
}

async function getRandomSeed(): Promise<number> {
  try {
    const app = await Client.connect("sweetpotatoman/SDXL-Turbo-Img2Img-CPU");
    const result = await app.predict("/get_random_value", []);
    return result?.data
      ? parseInt(result.data.toString(), 10)
      : Math.floor(Math.random() * 1_000_000);
  } catch {
    return Math.floor(Math.random() * 1_000_000);
  }
}

// Main API Handler
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StyleRequest;
    const {
      imageData,
      style,
      iterations,
      strength,
      seed,
      enhanceBackground = true,
      fillEmptySpaces = true,
    } = body;

    if (!imageData || !style) {
      return NextResponse.json(
        { success: false, error: "Missing image or style" },
        { status: 400 }
      );
    }

    if (!Object.keys(stylePrompts).includes(style)) {
      return NextResponse.json(
        { success: false, error: "Invalid style option" },
        { status: 400 }
      );
    }

    const analysis = await analyzeImageContent(imageData);
    const prompt = createEnhancedPrompt(style, analysis, {
      enhanceBackground,
      fillEmptySpaces,
      addAtmosphericElements: true,
      preserveStyle: true,
    });

    const safeIterations = iterations ?? recommendIterations(analysis);
    const safeStrength = strength ?? recommendStrength(analysis);
    const finalSeed = seed ?? (await getRandomSeed());

    const result = await processImage({
      imageInput: imageData,
      prompt,
      iterations: Math.min(Math.max(safeIterations, 1), 5),
      seed: finalSeed,
      strength: Math.min(Math.max(safeStrength, 0.1), 1.0),
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      styledImage: result.imageDataUrl,
      originalPrompt: prompt,
      parameters: {
        iterations: safeIterations,
        strength: safeStrength,
        seed: finalSeed,
      },
      analysis,
    });
  } catch (err) {
    console.error("❌ POST handler error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
