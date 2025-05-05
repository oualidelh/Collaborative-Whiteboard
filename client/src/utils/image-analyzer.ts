// File: utils/image-analyzer.ts
import { createCanvas, loadImage } from "canvas";

/**
 * Results from analyzing an image's content
 */
export interface ImageAnalysisResult {
  hasTree: boolean;
  hasSky: boolean;
  hasGround: boolean;
  hasPerson: boolean;
  hasWater: boolean;
  hasMountain: boolean;
  isEmptySpace: boolean;
  mainSubject: string | null;
  dominantColors: string[];
  emptiness: number; // 0-1 scale where 1 means completely empty
  lineWeight: "light" | "medium" | "heavy";
  drawingComplexity: "simple" | "moderate" | "complex";
  hasBackground: boolean;
}

/**
 * Options for analyzing an image
 */
interface AnalyzeImageOptions {
  minEmptyThreshold?: number; // Threshold for considering a region empty (0-255)
  samplingDensity?: number; // How many points to sample (higher = more accurate but slower)
  edgeDetectionThreshold?: number; // Threshold for edge detection
}

/**
 * Analyzes an image to detect its content and characteristics
 * This is a more sophisticated version that uses basic computer vision techniques
 * In a production environment, you might want to use a proper ML model instead
 *
 * @param imageData - Base64 encoded image data
 * @param options - Analysis options
 * @returns Analysis results
 */
export async function analyzeImageContent(
  imageData: string,
  options: AnalyzeImageOptions = {}
): Promise<ImageAnalysisResult> {
  // Set default options
  const {
    minEmptyThreshold = 245, // High value means only very white pixels are considered empty
    samplingDensity = 50, // Sample 50x50 grid of the image
    edgeDetectionThreshold = 30, // Threshold for edge detection
  } = options;

  try {
    // Load the image
    const img = await loadImage(imageData);

    // Create a canvas to analyze the image
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    // Get image data for analysis
    const imageDataArray = ctx.getImageData(0, 0, img.width, img.height);
    const pixels = imageDataArray.data;

    // Calculate emptiness (average brightness, with white being "empty")
    let totalBrightness = 0;
    let edgePixelCount = 0;
    const totalPixels = img.width * img.height;

    // Collect color samples
    const colorSamples: { r: number; g: number; b: number }[] = [];

    // Simple edge detection and brightness calculation
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const idx = (y * img.width + x) * 4;

        // Calculate brightness (0-255)
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const brightness = (r + g + b) / 3;

        totalBrightness += brightness;

        // Sample colors at regular intervals
        if (
          x % Math.floor(img.width / samplingDensity) === 0 &&
          y % Math.floor(img.height / samplingDensity) === 0
        ) {
          colorSamples.push({ r, g, b });
        }

        // Simple edge detection
        if (x > 0 && y > 0 && x < img.width - 1 && y < img.height - 1) {
          const leftIdx = (y * img.width + (x - 1)) * 4;
          const rightIdx = (y * img.width + (x + 1)) * 4;
          const topIdx = ((y - 1) * img.width + x) * 4;
          const bottomIdx = ((y + 1) * img.width + x) * 4;

          const deltaX =
            Math.abs(pixels[leftIdx] - pixels[rightIdx]) +
            Math.abs(pixels[leftIdx + 1] - pixels[rightIdx + 1]) +
            Math.abs(pixels[leftIdx + 2] - pixels[rightIdx + 2]);

          const deltaY =
            Math.abs(pixels[topIdx] - pixels[bottomIdx]) +
            Math.abs(pixels[topIdx + 1] - pixels[bottomIdx + 1]) +
            Math.abs(pixels[topIdx + 2] - pixels[bottomIdx + 2]);

          if (
            deltaX > edgeDetectionThreshold ||
            deltaY > edgeDetectionThreshold
          ) {
            edgePixelCount++;
          }
        }
      }
    }

    // Overall emptiness (0-1 scale, 1 = completely empty/white)
    const avgBrightness = totalBrightness / totalPixels;
    const emptiness = avgBrightness / 255;

    // Determine line weight based on edge pixel density
    const edgeDensity = edgePixelCount / totalPixels;
    let lineWeight: "light" | "medium" | "heavy";

    if (edgeDensity < 0.02) {
      lineWeight = "light";
    } else if (edgeDensity < 0.05) {
      lineWeight = "medium";
    } else {
      lineWeight = "heavy";
    }

    // Analyze complexity based on edge count and distribution
    let drawingComplexity: "simple" | "moderate" | "complex";

    if (edgePixelCount < totalPixels * 0.02) {
      drawingComplexity = "simple";
    } else if (edgePixelCount < totalPixels * 0.08) {
      drawingComplexity = "moderate";
    } else {
      drawingComplexity = "complex";
    }

    // Determine if the image has a background (non-white areas at edges)
    let hasBackground = false;
    const margin = Math.min(img.width, img.height) * 0.1; // 10% margin

    // Check pixels around the borders
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        // Only check the border area
        if (
          x > margin &&
          x < img.width - margin &&
          y > margin &&
          y < img.height - margin
        ) {
          continue;
        }

        const idx = (y * img.width + x) * 4;
        const brightness =
          (pixels[idx] + pixels[idx + 1] + pixels[idx + 2]) / 3;

        if (brightness < minEmptyThreshold) {
          hasBackground = true;
          break;
        }
      }
      if (hasBackground) break;
    }

    // Placeholder for actual content detection
    // In a production app, you'd use ML here (YOLO, TensorFlow.js, etc.)
    // For now, we'll use some heuristics based on the image characteristics

    // Extract dominant colors (simple k-means-like approach)
    const dominantColors = findDominantColors(colorSamples, 3);

    // For now, we'll use basic heuristics for content detection
    // In production, you'd replace this with proper ML models
    const hasTree =
      drawingComplexity !== "simple" && !hasBackground && edgeDensity > 0.015;
    const hasSky = emptiness > 0.5 && hasBackground;
    const hasGround = hasBackground && drawingComplexity !== "simple";
    const hasPerson =
      drawingComplexity === "moderate" || drawingComplexity === "complex";
    const hasWater = dominantColors.some((c) => isBlueish(c)) && hasBackground;
    const hasMountain = hasBackground && drawingComplexity !== "simple";
    const isEmptySpace = emptiness > 0.75;

    // Try to guess the main subject
    let mainSubject: string | null = null;
    if (hasTree) {
      mainSubject = "tree";
    } else if (hasPerson) {
      mainSubject = "person";
    } else if (hasWater) {
      mainSubject = "water";
    } else if (hasMountain) {
      mainSubject = "landscape";
    } else if (!isEmptySpace) {
      mainSubject = "object";
    }

    return {
      hasTree,
      hasSky,
      hasGround,
      hasPerson,
      hasWater,
      hasMountain,
      isEmptySpace,
      mainSubject,
      dominantColors,
      emptiness,
      lineWeight,
      drawingComplexity,
      hasBackground,
    };
  } catch (error) {
    console.error("Image analysis error:", error);

    // Return default analysis if something goes wrong
    return {
      hasTree: true,
      hasSky: false,
      hasGround: true,
      hasPerson: false,
      hasWater: false,
      hasMountain: false,
      isEmptySpace: false,
      mainSubject: null,
      dominantColors: ["#000000"],
      emptiness: 0.1,
      lineWeight: "medium",
      drawingComplexity: "simple",
      hasBackground: false,
    };
  }
}

/**
 * Find dominant colors in the image
 * This is a simple implementation - a production app would use a better algorithm
 */
function findDominantColors(
  samples: { r: number; g: number; b: number }[],
  numColors: number
): string[] {
  // Filter out white/near-white colors
  const nonWhiteColors = samples.filter((c) => (c.r + c.g + c.b) / 3 < 230);

  // If all colors are nearly white, return a default set
  if (nonWhiteColors.length < 5) {
    return ["#000000", "#808080", "#c0c0c0"];
  }

  // Simple clustering (this isn't true k-means, just a basic approach)
  //   const colors: string[] = [];

  // Quantize colors to reduce the space
  const quantized = nonWhiteColors.map((c) => ({
    r: Math.round(c.r / 25) * 25,
    g: Math.round(c.g / 25) * 25,
    b: Math.round(c.b / 25) * 25,
  }));

  // Count frequency of each quantized color
  const colorCounts = new Map<string, number>();

  for (const color of quantized) {
    const colorStr = rgbToHex(color.r, color.g, color.b);
    const count = colorCounts.get(colorStr) || 0;
    colorCounts.set(colorStr, count + 1);
  }

  // Sort by frequency
  const sortedColors = [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);

  // Return top N colors
  return sortedColors.slice(0, numColors);
}

/**
 * Convert RGB values to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Check if a color is in the blue range (for water detection)
 */
function isBlueish(hexColor: string): boolean {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Blue is dominant and significantly higher than red and green
  return b > 120 && b > r * 1.5 && b > g * 1.2;
}
