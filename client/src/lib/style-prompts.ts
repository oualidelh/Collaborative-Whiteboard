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
//   | "shaun-the-sheep"
//   | "child-drawing-3d"; // NEW

// /**
//  * Map of style options to prompts
//  */
// export const stylePrompts: Record<StyleOption, string> = {
//   anime:
//     "Complete and enhance this initial drawing into a detailed anime-style artwork. Fill in missing features, add vibrant colors, clean lines, and transform it into a high-quality anime illustration. Stay true to the original intent while adding depth, expression, and signature anime shading.",

//   ghibli:
//     "Complete this rough drawing in the style of Studio Ghibli. Enrich the scene with a magical atmosphere, soft pastel tones, and whimsical nature-inspired details. Fill missing areas with foliage, gentle skies, or dreamy backgrounds that evoke the Ghibli spirit. Preserve the heart of the original piece while adding wonder and charm.",

//   "comic-books":
//     "Transform this initial drawing into a complete comic book-style scene. Bolden outlines, intensify colors, add dynamic shading, and inject action-oriented elements. Fill in missing parts with comic aesthetics like speed lines, dramatic angles, and stylized backgrounds. Sharpen character features to match heroic comic book styles.",

//   realistic:
//     "Refine this initial drawing into a fully realized photorealistic image. Apply natural lighting, intricate textures, realistic shadows, and accurate proportions. Complete missing details with life-like elements, enhancing the drawing into a sharp, vivid, and true-to-life visual experience.",

//   cyberpunk:
//     "Evolve this initial sketch into a vibrant cyberpunk world. Inject neon lights, futuristic tech, moody urban details, and rainy atmospheres. Fill missing spaces with cybernetic structures, holograms, and reflective wet surfaces. Create a high-contrast, neon-drenched environment with dark, futuristic vibes.",

//   vangogh:
//     "Complete this rough drawing with the signature style of Van Gogh. Apply bold swirling patterns, expressive brush strokes, and emotionally charged complementary colors. Fill missing areas with cypress trees, starry skies, or dynamic landscapes. Retain the core subject while infusing it with rich impressionist energy.",

//   oil: "Transform this initial drawing into a classical oil painting. Layer textured brush strokes, add glowing highlights and deep shadows, and create a warm, glazed ambiance. Complete missing elements with historically appropriate compositions, emphasizing depth, richness, and traditional artistic beauty.",

//   pixar:
//     "Enhance this initial drawing into a Pixar-style 3D character or scene. Add smooth surfaces, vibrant playful colors, and charming stylized features. Fill missing spaces with joyful details and simple, effective backgrounds. Capture the whimsical, heartfelt essence of Pixar's animation style.",

//   "shaun-the-sheep":
//     "Turn this initial drawing into a lively claymation-style scene inspired by Shaun the Sheep. Build rounded forms, soft playful textures, and a handmade feel. Fill in missing details with simple, cheerful clay elements, capturing the warm spirit of stop-motion storytelling.",
//   "child-drawing-3d":
//     "Transform this child's drawing into a charming 3D character while preserving its original simplicity, proportions, and innocence. Create smooth rounded shapes, soft textures, vibrant colors, and a playful spirit. Retain the naive and heartfelt look of the original drawing, bringing it to life in a polished, heartwarming 3D cartoon style.",
// };

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
//     "child-drawing-3d": "Child Drawing 3D",
//   };

//   return displayNames[style] || style;
// }

/**
 * Style options for image transformation
 */
// export type StyleOption =
//   | "anime"
//   | "ghibli"
//   | "comic-books"
//   | "realistic"
//   | "cyberpunk"
//   | "vangogh"
//   | "oil"
//   | "pixar"
//   | "shaun-the-sheep"
//   | "child-drawing-3d";

// /**
//  * Map of style options to prompts
//  */
// export const stylePrompts: Record<StyleOption, string> = {
//   anime:
//     "Complete and enhance this initial drawing into a vibrant anime-style artwork. Transform each sketched object into a detailed anime version — e.g., a tree into a blossoming sakura tree, characters into stylized figures with expressive faces and clean lines. If the canvas contains blank or minimal areas, enrich the scene with anime-style elements like skies, clouds, cherry blossoms, or urban/fantasy backgrounds that support the subject. Eliminate blank space and ensure the final result is rich, cohesive, and full of character.",

//   ghibli:
//     "Turn this sketch into a heartwarming Studio Ghibli-inspired illustration. Transform rough elements into soft, nature-filled details like lush trees, animated creatures, and expressive characters. Add magical or nostalgic touches with warm skies, forests, or meadows. If the canvas has blank or minimal areas, fill them with whimsical scenery such as drifting clouds, distant hills, or fantasy backgrounds to evoke a gentle, immersive world. Make the scene feel alive and complete while preserving the original idea.",

//   "comic-books":
//     "Transform this rough sketch into a dynamic comic book-style illustration. Convert each object into bold, high-contrast elements with thick lines, saturated colors, and energetic posing. Use comic-style action features like halftones, speed lines, and dramatic lighting. Fill in empty or unfinished areas with comic environments like cities, alleys, or interiors that match the action. Replace large blank spaces with fitting background elements and create a fully fleshed-out, action-packed scene.",

//   realistic:
//     "Refine this sketch into a highly detailed, photorealistic image. Convert each element into a lifelike version — for example, sketchy trees become leafy, textured ones; figures gain realistic proportions and lighting. Add subtle shadows, textures, and lighting to mimic real photography. If the image has empty or underdeveloped space, generate realistic backgrounds like sky, clouds, landscapes, or relevant surroundings to fill the scene. Ensure the image looks complete, cohesive, and grounded in reality.",

//   cyberpunk:
//     "Reimagine this drawing as a vivid cyberpunk scene. Transform rough outlines into detailed neon-lit structures, futuristic tech, cybernetic figures, and rainy cityscapes. Add glowing signage, reflections, and metallic textures. If the sketch doesn’t fill the canvas or has empty areas, complete the space with cyberpunk architecture, street scenes, or sci-fi elements like drones, cables, and ads. Make the scene immersive, colorful, and alive with dystopian energy.",

//   vangogh:
//     "Transform this sketch into a painting in the expressive style of Van Gogh. Replace simple shapes with swirling textures, strong strokes, and emotional color contrasts. Turn trees into swirling organic forms, skies into star-filled motion, and objects into textured, dynamic elements. If the image has large blank areas, complete them with vivid impressionist landscapes, villages, or natural backdrops inspired by Van Gogh’s works. Infuse the entire piece with movement, emotion, and visual rhythm.",

//   oil: "Convert this sketch into a rich, classical oil painting. Enhance each element with layered brush strokes, realistic shadows, and glowing highlights. Transform trees, people, or objects into historically styled forms with traditional composition. If the canvas has empty space, complete the background with elegant nature scenes, classical interiors, or soft sky gradients. Ensure the whole image feels painted with depth, texture, and balance.",

//   pixar:
//     "Develop this sketch into a 3D Pixar-style scene or character. Translate flat lines into rounded, expressive forms with vibrant colors, glossy finishes, and soft lighting. Make characters cute and charming, with big eyes and clean features. If there are blank or minimal areas, generate context-appropriate Pixar-style environments like parks, schools, rooms, or outdoors. Build a scene that feels polished, playful, and emotionally engaging.",

//   "shaun-the-sheep":
//     "Transform this sketch into a playful claymation world inspired by Shaun the Sheep. Turn rough shapes into rounded, hand-sculpted clay textures. Characters and objects should look like stop-motion puppets with simple, cheerful expressions. Fill blank areas with bright, natural farm environments — hills, fences, skies, or sheep sheds — built from clay-style textures. Remove empty space by adding wholesome scenery that enhances the stop-motion charm.",

//   "child-drawing-3d":
//     "Bring this child's drawing to life as a polished 3D cartoon. Preserve its naive and heartfelt look, but transform it into rounded, colorful, soft-surfaced 3D shapes. Turn flat characters into toy-like figures while keeping their original proportions. Fill in large blank spaces with fun, simple 3D backgrounds such as playgrounds, skies, animals, or imaginative settings that suit the drawing's story. Keep the innocence while enhancing it visually.",
// };

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
//     "child-drawing-3d": "Child Drawing 3D",
//   };

//   return displayNames[style] || style;
// }

export type StyleOption =
  | "anime"
  | "ghibli"
  | "comic-books"
  | "realistic"
  | "cyberpunk"
  | "vangogh"
  | "oil"
  | "pixar"
  | "shaun-the-sheep"
  | "child-drawing-3d";

/**
 * Enhanced map of style options to prompts that focus on:
 * 1. Contextual scene completion
 * 2. Background generation
 * 3. Style preservation
 * 4. Detail enhancement
 */
export const stylePrompts: Record<StyleOption, string> = {
  anime:
    "Transform this sketch into a complete, vibrant anime scene. Enhance the drawn elements with anime-style details and textures. For trees, create lush foliage with distinct anime lighting. Fill all empty spaces with a cohesive background that complements the drawing - if outdoors, add a dynamic sky with distinctive anime clouds, distant mountains, fields of flowers, or cityscape elements. If a tree is present, create a serene forest or park setting with path and wildlife. Add subtle anime atmospheric effects like light rays or gentle wind patterns. The final image should look like a complete anime art piece with no blank spaces, maintaining consistent anime aesthetics throughout.",

  ghibli:
    "Transform this sketch into a complete Studio Ghibli scene with the studio's signature whimsical, painterly style. Enhance drawn elements with Ghibli's characteristic soft details and warm coloring. For trees, create magnificent detailed foliage with dappled sunlight. Fill all empty spaces with a harmonious Ghibli-inspired environment - peaceful rolling hills, magical forests, quaint villages, or dreamy skies with distinctive clouds. If a tree is present, develop a lush Ghibli-style landscape around it with wildflowers, small animals, and perhaps distant cottages. Add Ghibli's characteristic atmospheric elements like floating particles, gentle wind effects, or subtle magical elements. The final image should be a complete, immersive Ghibli-style artwork with no empty spaces.",

  "comic-books":
    "Transform this sketch into a dynamic, complete comic book panel. Enhance drawn elements with bold outlines, dramatic shading, and comic-style detailing. For trees, create stylized foliage with strong contrasts and defined shapes. Fill all empty spaces with a cohesive comic book environment - dramatic skies with speed lines, city skylines, action-oriented landscapes, or genre-appropriate backgrounds. If a tree is present, develop a vivid comic scene around it that suggests story and action. Add comic-specific elements like motion lines, sound effect spaces, dramatic lighting, and halftone patterns. Use a classic comic color palette with strong primary colors. The final image should be a complete, action-packed comic panel with no empty spaces, ready for a speech bubble.",

  realistic:
    "Transform this sketch into a photorealistic, complete scene with lifelike details and natural lighting. Enhance drawn elements with photographic textures, accurate proportions, and realistic coloring. For trees, create detailed bark textures and botanically accurate foliage with natural light filtering. Fill all empty spaces with a cohesive realistic environment - atmospheric skies with volumetric clouds, accurate landscapes, and proper perspective. If a tree is present, develop a natural landscape around it with realistic ground cover, appropriate seasonal elements, and environmental context like fields, hills, or water features. Add subtle realistic atmospheric effects like depth haze, natural shadows, and authentic lighting conditions based on time of day. The final image should be indistinguishable from a high-quality photograph with no blank spaces.",

  cyberpunk:
    "Transform this sketch into a complete neon-drenched cyberpunk scene. Enhance drawn elements with high-tech details, glowing accents, and futuristic textures. For trees, create tech-organic hybrids with bioluminescent foliage or augmented natural elements. Fill all empty spaces with a dense cyberpunk cityscape - towering megastructures, holographic advertisements, flying vehicles, and rain-slicked streets reflecting neon lights. If a tree is present, contextualize it as either a rare natural element in a tech world or as a modified synthetic version. Add cyberpunk atmospheric elements like digital particles, scanning lines, heavy rain, fog, and multiple light sources in blues, purples, and hot pinks. The final image should be a complete, immersive cyberpunk environment with no empty spaces, rich with the genre's characteristic contrast between organic and technological.",

  vangogh:
    "Transform this sketch into a complete Post-Impressionist scene in Van Gogh's distinctive style. Enhance drawn elements with vibrant, swirling brushstrokes and emotional color choices. For trees, create expressive, spiraling foliage with visible, energetic brushwork. Fill all empty spaces with Van Gogh's characteristic swirling skies, wheat fields, or village elements with visible brushwork throughout. If a tree is present, develop a complete landscape around it with wheat fields, paths, or night sky elements reminiscent of works like 'Starry Night' or 'Wheat Field with Cypresses.' Add Van Gogh's characteristic energy through turbulent skies, expressive color contrasts, and dynamic brush movement. The final image should be a complete, emotionally charged scene with no empty spaces, immediately recognizable as Van Gogh's style.",

  oil: "Transform this sketch into a complete classical oil painting with rich texture and depth. Enhance drawn elements with careful glazing techniques, subtle color gradations, and traditional oil painting textures. For trees, create detailed foliage with realistic highlights and shadows using classical techniques. Fill all empty spaces with a harmonious traditional landscape - dramatic skies with classical cloud formations, rolling countryside, architectural elements, or appropriate period details. If a tree is present, develop a complete composition around it following classical landscape conventions with foreground, middle ground, and background elements. Add traditional oil painting atmospheric effects like aerial perspective, golden hour lighting, or dramatic chiaroscuro. The final image should have the depth, richness and texture of a museum-quality oil painting with no empty spaces, appearing to be painted on canvas.",

  pixar:
    "Transform this sketch into a complete, polished Pixar-style 3D scene. Enhance drawn elements with Pixar's characteristic rounded forms, slightly exaggerated proportions, and clean, plastic-like textures. For trees, create stylized foliage with simplified shapes but rich color variation. Fill all empty spaces with a cheerful, vibrant Pixar environment - bright skies, playful landscapes, colorful buildings, or whimsical natural elements. If a tree is present, develop a friendly, animated landscape around it with rolling hills, paths, or complementary scenery elements. Add Pixar's signature atmospheric touches like gentle bokeh effects, warm lighting, and subtle ambient occlusion. The final image should be a complete, family-friendly scene with no empty spaces, immediately recognizable as a Pixar-style 3D rendering.",

  "shaun-the-sheep":
    "Transform this sketch into a complete Aardman/Shaun the Sheep style claymation scene. Enhance drawn elements with clay-like textures, slightly uneven surfaces, and characteristic fingerprint-like impressions. For trees, create simplified but charming foliage with visible clay texture. Fill all empty spaces with the warm, handcrafted farm environment of Shaun the Sheep - rolling hills, fences, farm buildings, vegetable patches, or countryside elements. If a tree is present, develop a complete farm scene around it with grassy textures, paths, and possibly sheep characters. Add claymation-specific details like slightly imperfect edges, visible texture, and the warm, handmade aesthetic of stop-motion animation. The final image should be a complete, charming scene with no empty spaces, immediately recognizable as Aardman's distinctive claymation style.",

  "child-drawing-3d":
    "Transform this sketch into a complete 3D-rendered children's drawing scene. Enhance drawn elements by maintaining their childlike proportions and charm while adding 3D depth, soft textures, and gentle lighting. For trees, create rounded, toy-like foliage that preserves the naive shape but adds dimension. Fill all empty spaces with a cheerful, imaginative environment that a child might draw - colorful skies, rainbow elements, friendly landscapes, or playful scenery. If a tree is present, develop a complete playful scene around it with simple grass, paths, or other child-friendly elements like animals or toy-like objects. Add soft shadows, gentle highlights, and warm lighting that enhances the 3D effect while maintaining the innocent charm of children's art. The final image should be a complete, heartwarming scene with no empty spaces, looking like a child's drawing that has been magically brought to life in three dimensions.",
};

/**
 * Gets the display name for a style option
 * @param style - The style option
 * @returns The display name for the style
 */
export function getStyleDisplayName(style: StyleOption): string {
  const displayNames: Record<StyleOption, string> = {
    anime: "Anime",
    ghibli: "Studio Ghibli",
    "comic-books": "Comic Book",
    realistic: "Realistic",
    cyberpunk: "Cyberpunk",
    vangogh: "Van Gogh",
    oil: "Oil Painting",
    pixar: "Pixar",
    "shaun-the-sheep": "Shaun the Sheep",
    "child-drawing-3d": "Child Drawing 3D",
  };

  return displayNames[style] || style;
}
