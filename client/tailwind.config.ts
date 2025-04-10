import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        cream: {
          50: "#FDFBF6",
          100: "#F5F1E6",
          200: "#EBE5D5",
        },
        sage: {
          50: "#F2F5F2",
          100: "#E6EBE6",
          500: "#8CA88E",
          600: "#718C73",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        slideFadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-70px)" }, // Start off-screen left
          "100%": { opacity: "1", transform: "translateX(0)" }, // Fade in and move to original position
        },
        slideFadeInRight: {
          "0%": { opacity: "0", transform: "translateX(70px)" }, // Start off-screen left
          "100%": { opacity: "1", transform: "translateX(0)" }, // Fade in and move to original position
        },
        slideFadeInBottom: {
          "0%": { opacity: "0", transform: "translateY(70px)" }, // Start off-screen bottom
          "100%": { opacity: "1", transform: "translateY(0)" }, // Fade in and move to original position
        },
        slideFadeInTop: {
          "0%": { opacity: "0", transform: "translateY(-70px)" }, // Start off-screen bottom
          "100%": { opacity: "1", transform: "translateY(0)" }, // Fade in and move to original position
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideFadeInLeft: "slideFadeInLeft 1.5s ease-out",
        slideFadeInBottom: "slideFadeInBottom 1.5s ease-out",
        slideFadeInTop: "slideFadeInTop 1.5s ease-out",
        slideFadeInRight: "slideFadeInRight 1.5s ease-out",
        fadeIn: "fadeIn 1s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
