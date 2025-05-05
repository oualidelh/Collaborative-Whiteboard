// // File: utils/stylize-client.ts
// // This is a client-safe version to use in your frontend components

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
//  * Stylizes an image according to the selected style by calling our API
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

//     // Call our server-side API
//     const response = await fetch("/api/stylize", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         imageData: params.imageData,
//         style: params.style,
//         iterations: params.iterations || 1,
//         strength: params.strength || 0.7,
//         seed: params.seed,
//       }),
//     });

//     // Parse the response
//     const result = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         error:
//           result.error || `Error: ${response.status} ${response.statusText}`,
//       };
//     }

//     return result;
//   } catch (err) {
//     console.error("Stylize error:", err);
//     return {
//       success: false,
//       error: err instanceof Error ? err.message : "Unknown error occurred",
//     };
//   }
// }

// // You can re-export from style-prompts if needed
// // export { stylePrompts, getStyleDisplayName } from "@/lib/style-prompts";
// // export type { StyleOption };
// // File: utils/stylize-client.ts
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
//   enhanceBackground?: boolean; // Whether to enhance the background specifically
//   fillEmptySpaces?: boolean; // Whether to fill empty spaces with contextual content
// }

// /**
//  * Response from the stylize API
//  */
// export interface StylizeResponse {
//   success: boolean;
//   styledImage?: string; // Base64 encoded stylized image
//   originalPrompt?: string; // The prompt used for generation (for debugging)
//   processingTime?: number; // How long the processing took
//   error?: string;
// }

// /**
//  * Stylizes an image according to the selected style by calling our API
//  * @param params - Stylization parameters
//  * @returns Promise with the stylized image or error
//  */
// export async function stylizeImage(
//   params: StylizeParams
// ): Promise<StylizeResponse> {
//   try {
//     const startTime = performance.now();

//     // Validate parameters
//     if (!params.imageData) {
//       throw new Error("Image data is required");
//     }

//     if (!params.style) {
//       throw new Error("Style is required");
//     }

//     // Default values
//     const enhanceBackground = params.enhanceBackground !== false; // Default to true
//     const fillEmptySpaces = params.fillEmptySpaces !== false; // Default to true

//     // Call our server-side API
//     const response = await fetch("/api/stylize", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         imageData: params.imageData,
//         style: params.style,
//         iterations: Math.min(Math.max(params.iterations || 2, 1), 5), // Ensure between 1-5
//         strength: Math.min(Math.max(params.strength || 0.8, 0.1), 1.0), // Ensure between 0.1-1.0
//         seed: params.seed,
//         enhanceBackground,
//         fillEmptySpaces,
//       }),
//     });

//     // Parse the response
//     const result = await response.json();
//     const endTime = performance.now();

//     if (!response.ok) {
//       return {
//         success: false,
//         error:
//           result.error || `Error: ${response.status} ${response.statusText}`,
//         processingTime: endTime - startTime,
//       };
//     }

//     return {
//       ...result,
//       processingTime: endTime - startTime,
//       success: true,
//     };
//   } catch (err) {
//     console.error("Stylize error:", err);
//     return {
//       success: false,
//       error: err instanceof Error ? err.message : "Unknown error occurred",
//     };
//   }
// }

// /**
//  * Cancels an ongoing stylization process if supported by the API
//  * @returns Promise indicating if cancellation was successful
//  */
// export async function cancelStylization(): Promise<boolean> {
//   try {
//     const response = await fetch("/api/stylize/cancel", {
//       method: "POST",
//     });

//     return response.ok;
//   } catch (error) {
//     console.error("Error cancelling stylization:", error);
//     return false;
//   }
// }

import type { StyleOption } from "@/lib/style-prompts";

/**
 * Parameters for stylizing an image
 */
export interface StylizeParams {
  imageData: string; // Base64 encoded image data from canvas
  style: StyleOption;
  iterations?: number; // Number of iterations (1-5)
  strength?: number; // Strength of transformation (0.1-1.0)
  seed?: number; // Random seed for reproducibility
  enhanceBackground?: boolean; // Whether to enhance the background specifically
  fillEmptySpaces?: boolean; // Whether to fill empty spaces with contextual content
}

/**
 * Response from the stylize API
 */
export interface StylizeResponse {
  success: boolean;
  styledImage?: string; // Base64 encoded stylized image
  originalPrompt?: string; // The prompt used for generation (for debugging)
  processingTime?: number; // How long the processing took
  error?: string;
}

// Keep track of ongoing requests
let activeStylizeRequest: AbortController | null = null;

/**
 * Stylizes an image according to the selected style by calling our API
 * @param params - Stylization parameters
 * @returns Promise with the stylized image or error
 */
export async function stylizeImage(
  params: StylizeParams
): Promise<StylizeResponse> {
  try {
    const startTime = performance.now();

    // Validate parameters
    if (!params.imageData) {
      throw new Error("Image data is required");
    }

    if (!params.style) {
      throw new Error("Style is required");
    }

    // Cancel any existing request
    if (activeStylizeRequest) {
      activeStylizeRequest.abort();
    }

    // Create a new abort controller for this request
    const abortController = new AbortController();
    activeStylizeRequest = abortController;

    // Default values
    const enhanceBackground = params.enhanceBackground !== false; // Default to true
    const fillEmptySpaces = params.fillEmptySpaces !== false; // Default to true

    // Call our server-side API with timeout handling
    const response = await fetch("/api/stylize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageData: params.imageData,
        style: params.style,
        iterations: Math.min(Math.max(params.iterations || 2, 1), 5), // Ensure between 1-5
        strength: Math.min(Math.max(params.strength || 0.8, 0.1), 1.0), // Ensure between 0.1-1.0
        seed: params.seed,
        enhanceBackground,
        fillEmptySpaces,
      }),
      signal: abortController.signal,
    });

    // Request is complete
    activeStylizeRequest = null;

    // Parse the response
    const result = await response.json();
    const endTime = performance.now();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.error || `Error: ${response.status} ${response.statusText}`,
        processingTime: endTime - startTime,
      };
    }

    return {
      ...result,
      processingTime: endTime - startTime,
      success: true,
    };
  } catch (err) {
    // Handle aborted requests gracefully
    if (err instanceof DOMException && err.name === "AbortError") {
      console.log("Request was cancelled");
      return {
        success: false,
        error: "Request was cancelled",
      };
    }

    console.error("Stylize error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  } finally {
    // Clear the active request reference if it's the current one
    if (activeStylizeRequest?.signal.aborted) {
      activeStylizeRequest = null;
    }
  }
}

/**
 * Cancels an ongoing stylization process if supported by the API
 * @returns Promise indicating if cancellation was successful
 */
export async function cancelStylization(): Promise<boolean> {
  try {
    // First abort any client-side request
    if (activeStylizeRequest) {
      activeStylizeRequest.abort();
      activeStylizeRequest = null;
    }

    // Then notify the server
    const response = await fetch("/api/stylize/cancel", {
      method: "POST",
    });

    return response.ok;
  } catch (error) {
    console.error("Error cancelling stylization:", error);
    return false;
  }
}
