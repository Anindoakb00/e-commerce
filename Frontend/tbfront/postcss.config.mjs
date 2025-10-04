// Ensure Tailwind Oxide is disabled during PostCSS load on all platforms
process.env.TAILWIND_DISABLE_OXIDE = process.env.TAILWIND_DISABLE_OXIDE || '1'

const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
