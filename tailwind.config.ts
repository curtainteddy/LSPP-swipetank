import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Airbnb color palette
        airbnb: {
          rausch: "#FF5A5F", // Primary coral red
          kazan: "#00A699", // Teal accent
          babu: "#EBEBEB", // Light gray
          arches: "#FCFCFC", // Near white
          hof: "#757575", // Medium gray
          foggy: "#F7F7F7", // Light background
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.5rem)",
        // Airbnb-style rounded corners
        airbnb: "12px",
        "airbnb-sm": "8px",
        "airbnb-lg": "16px",
      },
      fontFamily: {
        sans: [
          "Circular",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
        airbnb: ["Circular", "sans-serif"],
      },
      fontSize: {
        // Airbnb typography scale
        "airbnb-xs": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "airbnb-sm": ["14px", { lineHeight: "18px", fontWeight: "400" }],
        "airbnb-base": ["16px", { lineHeight: "20px", fontWeight: "400" }],
        "airbnb-lg": ["18px", { lineHeight: "24px", fontWeight: "400" }],
        "airbnb-xl": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "airbnb-2xl": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "airbnb-3xl": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "airbnb-4xl": ["48px", { lineHeight: "56px", fontWeight: "600" }],
      },
      boxShadow: {
        airbnb: "0 6px 16px rgba(0, 0, 0, 0.12)",
        "airbnb-sm": "0 2px 4px rgba(0, 0, 0, 0.08)",
        "airbnb-lg": "0 12px 24px rgba(0, 0, 0, 0.16)",
        "airbnb-hover": "0 8px 25px rgba(0, 0, 0, 0.15)",
      },
      spacing: {
        // Airbnb spacing scale
        "4.5": "18px",
        "5.5": "22px",
        "6.5": "26px",
        "7.5": "30px",
        "8.5": "34px",
        "9.5": "38px",
        "15": "60px",
        "18": "72px",
        "22": "88px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "airbnb-bounce": "bounce 1s infinite",
        "airbnb-pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
