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
