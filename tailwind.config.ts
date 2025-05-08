import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
    content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [animatePlugin],
};

export default config;
