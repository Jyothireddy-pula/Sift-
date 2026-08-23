/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08090c",
        surface: "#0d0f14",
        edge: "#1c1f27",
        accent: "#c8ff3f",
        accent2: "#7ee6c4",
        accent3: "#ff8a5c",
        muted: "#7a7f8c",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(200,255,63,0.25), 0 8px 30px rgba(200,255,63,0.12)",
        glow2: "0 0 40px rgba(126,230,196,0.18)",
        crisp: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 24px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: 0.4 },
          "50%": { opacity: 1 },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        float2: "float 9s ease-in-out infinite",
        float3: "float 11s ease-in-out infinite",
        spinSlow: "spinSlow 60s linear infinite",
        spinSlower: "spinSlow 120s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        gradientShift: "gradientShift 10s ease infinite",
      },
    },
  },
  plugins: [],
};
