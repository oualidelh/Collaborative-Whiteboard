// import {
//   processImage,
//   getRandomSeed as getRandomSeedFromAPI,
// } from "@/lib/sdxl-client";

// /**
//  * Style options for image transformation
//  */
// export type StyleOption =
//   | "anime"
//   | "ghibli"
//   | "comic-books"
//   | "realistic"
//   | "cyberpunk"
//   | "vangogh"
//   | "oil"
//   | "pixar"
//   | "shaun-the-sheep";

// /**
//  * Parameters for stylizing an image
//  */
// export interface StylizeParams {
//   imageData: string; // Base64 encoded image data from canvas
//   style: StyleOption;
//   iterations?: number; // Number of iterations (1-5)
//   strength?: number; // Strength of transformation (0.1-1.0)
//   seed?: number; // Random seed for reproducibility
// }

// /**
//  * Response from the stylize API
//  */
// export interface StylizeResponse {
//   success: boolean;
//   styledImage?: string; // Base64 encoded stylized image
//   error?: string;
// }

// /**
//  * Map of style options to prompts
//  */
// const stylePrompts: Record<StyleOption, string> = {
//   anime: "anime style, vibrant colors, high-quality anime illustration",
//   ghibli:
//     "studio ghibli style, magical atmosphere, whimsical, detailed background, pastel colors",
//   "comic-books":
//     "comic book style, bold lines, vibrant colors, dramatic shading, action scene",
//   realistic:
//     "photorealistic, highly detailed, professional photography, sharp focus, natural lighting",
//   cyberpunk:
//     "cyberpunk style, neon lights, futuristic city, rain, reflections, dark atmosphere",
//   vangogh:
//     "van gogh style, impressionist, bold brush strokes, vibrant colors, swirling patterns",
//   oil: "oil painting, rich texture, classical style, detailed brush strokes, artistic composition",
//   pixar:
//     "pixar animation style, 3D rendered, colorful, friendly characters, polished look",
//   "shaun-the-sheep":
//     "claymation style, stop motion animation, shaun the sheep characters, playful, simple background",
// };

// /**
//  * Stylizes an image according to the selected style using the SDXL client
//  * @param params - Stylization parameters
//  * @returns Promise with the stylized image or error
//  */
// export async function stylizeImage(
//   params: StylizeParams
// ): Promise<StylizeResponse> {
//   try {
//     // Validate parameters
//     if (!params.imageData) {
//       throw new Error("Image data is required");
//     }

//     if (!params.style) {
//       throw new Error("Style is required");
//     }

//     // Set default values
//     const iterations = params.iterations || 1;
//     const strength = params.strength || 0.7;
//     const seed = params.seed || (await getRandomSeed());

//     // Get the style prompt
//     const prompt =
//       stylePrompts[params.style] || "high quality artistic rendering";

//     // Process the image using the SDXL client
//     const result = await processImage({
//       imageInput: params.imageData,
//       prompt,
//       iterations,
//       seed,
//       strength,
//     });

//     if (result.success) {
//       return {
//         success: true,
//         styledImage: result.imageDataUrl,
//       };
//     } else {
//       return {
//         success: false,
//         error: result.error || "Failed to stylize image",
//       };
//     }
//   } catch (error) {
//     console.error("Stylize error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Unknown error occurred",
//     };
//   }
// }

// /**
//  * Gets a random seed value for stylization
//  * @returns A random number between 0 and 999999
//  */
// export async function getRandomSeed(): Promise<number> {
//   try {
//     return await getRandomSeedFromAPI();
//   } catch (error) {
//     // Fallback to local random generation
//     return Math.floor(Math.random() * 1000000);
//   }
// }

// /**
//  * Gets the display name for a style option
//  * @param style - The style option
//  * @returns The display name for the style
//  */
// export function getStyleDisplayName(style: StyleOption): string {
//   const displayNames: Record<StyleOption, string> = {
//     anime: "Anime",
//     ghibli: "Studio Ghibli",
//     "comic-books": "Comic Book",
//     realistic: "Realistic",
//     cyberpunk: "Cyberpunk",
//     vangogh: "Van Gogh",
//     oil: "Oil Painting",
//     pixar: "Pixar",
//     "shaun-the-sheep": "Shaun the Sheep",
//   };

//   return displayNames[style] || style;
// }
// import {
//   processImage,
//   getRandomSeed as getRandomSeedFromAPI,
//   ProcessImageResult,
// } from "@/lib/sdxl-client";
// import { stylePrompts, getStyleDisplayName } from "@/lib/style-prompts";
// import type { StyleOption } from "@/lib/style-prompts";

// /**
//  * Parameters for stylizing an image
//  */
// export interface StylizeParams {
//   imageData: string; // Base64 encoded image data from canvas
//   style: StyleOption;
//   iterations?: number; // Number of iterations (1-5)
//   strength?: number; // Strength of transformation (0.1-1.0)
//   seed?: number; // Random seed for reproducibility
// }

// /**
//  * Response from the stylize API
//  */
// export interface StylizeResponse {
//   success: boolean;
//   styledImage?: string; // Base64 encoded stylized image
//   error?: string;
// }

// /**
//  * Stylizes an image according to the selected style using the SDXL client
//  * @param params - Stylization parameters
//  * @returns Promise with the stylized image or error
//  */
// export async function stylizeImage(
//   params: StylizeParams
// ): Promise<StylizeResponse> {
//   try {
//     // Validate parameters
//     if (!params.imageData) {
//       throw new Error("Image data is required");
//     }

//     if (!params.style) {
//       throw new Error("Style is required");
//     }

//     // Set default values
//     const iterations = params.iterations || 1;
//     const strength = params.strength || 0.7;
//     const seed = params.seed || (await getRandomSeed());

//     // Get the style prompt
//     const prompt =
//       stylePrompts[params.style] || "high quality artistic rendering";

//     // Process the image using the SDXL client
//     const result: ProcessImageResult = await processImage({
//       imageInput: params.imageData,
//       prompt,
//       iterations,
//       seed,
//       strength,
//     });

//     if (result.success && result.imageDataUrl) {
//       return {
//         success: true,
//         styledImage: result.imageDataUrl,
//       };
//     } else {
//       return {
//         success: false,
//         error: result.error || "Failed to stylize image",
//       };
//     }
//   } catch (err) {
//     console.error("Stylize error:", err);
//     return {
//       success: false,
//       error: err instanceof Error ? err.message : "Unknown error occurred",
//     };
//   }
// }

// /**
//  * Gets a random seed value for stylization
//  * @returns A random number between 0 and 999999
//  */
// export async function getRandomSeed(): Promise<number> {
//   try {
//     return await getRandomSeedFromAPI();
//   } catch (err) {
//     // Fallback to local random generation
//     return Math.floor(Math.random() * 1000000);
//   }
// }

// // Re-export from style-prompts.ts for convenience
// export { stylePrompts, getStyleDisplayName };
// export type { StyleOption };
