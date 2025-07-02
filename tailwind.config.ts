import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "gray-lightest": "var(--color-gray-lightest)",
                "gray-light": "#e5e5e5",
                "gray-dark": "#6b7280",
                "rose-gray": "var(--color-rose-gray)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "Arial", "Helvetica", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
        },
    },
    plugins: [],
};

export default config;
