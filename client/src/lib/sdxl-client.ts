// import { Client } from "@gradio/client";

// /**
//  * Process an image using the SDXL-Turbo-Img2Img-CPU API
//  * @param {Object} options - Processing options
//  * @param {string|Blob} options.imageInput - Input image (base64 string with MIME type prefix or Blob)
//  * @param {string} options.prompt - Text prompt for the image generation
//  * @param {number} options.iterations - Number of iterations (1-5)
//  * @param {number} options.seed - Random seed (0-987654321987654321)
//  * @param {number} options.strength - Strength of the transformation (0.1-1.0)
//  * @returns {Promise<Object>} - Result object with success status and output data
//  */
// export async function processImage({
//   imageInput,
//   prompt = "fantasy landscape",
//   iterations = 1,
//   seed = 0,
//   strength = 0.5,
// }) {
//   try {
//     console.log("Starting image processing...");

//     let imageBlob;

//     // Handle different image input types
//     if (typeof imageInput === "string") {
//       // Convert base64 string to Blob if it's a data URL
//       if (imageInput.startsWith("data:")) {
//         // Extract the content type and base64 data
//         const matches = imageInput.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

//         if (!matches || matches.length !== 3) {
//           throw new Error("Invalid base64 image format");
//         }

//         const contentType = matches[1];
//         const base64Data = matches[2];
//         const binaryString = atob(base64Data);
//         const byteArray = new Uint8Array(binaryString.length);

//         for (let i = 0; i < binaryString.length; i++) {
//           byteArray[i] = binaryString.charCodeAt(i);
//         }

//         imageBlob = new Blob([byteArray], { type: contentType });
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

//     // Set parameters and log them
//     console.log(`Parameters:
// - Prompt: "${prompt}"
// - Iterations: ${iterations}
// - Seed: ${seed}
// - Strength: ${strength}`);

//     // Make the prediction
//     console.log("Processing image...");

//     // Pass the params to the API
//     const result = await app.predict("/predict", [
//       imageBlob, // Image blob
//       prompt, // Text prompt
//       parseInt(iterations, 10), // Make sure it's an integer
//       parseInt(seed, 10), // Make sure it's an integer
//       parseFloat(strength), // Make sure it's a float
//     ]);

//     // Handle the result
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
//     console.error("❌ Error details:", error);
//     return {
//       success: false,
//       error: error.message || "Unknown error occurred",
//     };
//   }
// }

// /**
//  * Gets a random seed value from the API
//  * @returns {Promise<number>} - Random seed value or fallback
//  */
// export async function getRandomSeed() {
//   try {
//     console.log("Fetching random seed value...");
//     const app = await Client.connect("sweetpotatoman/SDXL-Turbo-Img2Img-CPU");
//     const result = await app.predict("/get_random_value", []);

//     if (result && result.data !== undefined) {
//       const seed = parseInt(result.data, 10);
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
// import { Client } from "@gradio/client";

/**
 * Interface for image processing options
 */
// export interface ProcessImageOptions {
//   imageInput: string | Blob;
//   prompt?: string;
//   iterations?: number;
//   seed?: number;
//   strength?: number;
// }

// /**
//  * Interface for image processing result
//  */
// export interface ProcessImageResult {
//   success: boolean;
//   imageDataUrl?: string;
//   imageUrl?: string;
//   error?: string;
// }

// /**
//  * Convert a base64 string to a Blob
//  * @param dataUrl - Base64 data URL
//  * @returns Blob object
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
//  * Process an image using the SDXL-Turbo-Img2Img-CPU API
//  * @param options - Processing options
//  * @returns Promise with result object containing success status and output data
//  */
// export async function processImage({
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
//       imageBlob, // Image blob
//       prompt, // Text prompt
//       parseInt(String(iterations), 10), // Make sure it's an integer
//       parseInt(String(seed), 10), // Make sure it's an integer
//       parseFloat(String(strength)), // Make sure it's a float
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
//  * @returns Promise with random seed value or fallback
//  */
// export async function getRandomSeed(): Promise<number> {
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
