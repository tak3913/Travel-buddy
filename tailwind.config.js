/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563EB",
          primaryDark: "#1E40AF",
          primaryLight: "#EFF6FF",
          primarySoft: "#DBEAFE",
          navy: "#17223B",
          navyDark: "#111A2E",
          ink: "#17223B",
          sub: "#64748B",
          faint: "#94A3B8",
          border: "#E3EAF5",
          borderSoft: "#EEF2F9",
          surface: "#FFFFFF",
          bg: "#FFFFFF",
          bgSoft: "#F6F9FE",
          tint: "#F4F9FF",
        },
      },
      fontFamily: {
        display: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "sans-serif",
        ],
        body: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      maxWidth: {
        wrap: "1240px",
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
      boxShadow: {
        header: "0 1px 0 rgba(23,34,59,0.06)",
        search: "0 2px 8px rgba(23,34,59,0.05)",
        chipActive: "0 3px 8px rgba(37,99,235,0.2)",
        dropdown: "0 8px 24px rgba(23,34,59,0.12)",
        modal: "0 2px 6px rgba(23,34,59,0.15)",
        card: "0 10px 28px rgba(23,34,59,0.08)",
      },
    },
  },
  plugins: [],
};
