module.exports = [
  {
    mode: "jit",
    purge: {
      enabled: true,
      content: ["./src/**/*.{html,ts,tsx,jsx}"],
    },
    darkMode: false,
    theme: {
      extend: {},
      screens: {
        sm: "375px",
        lg: "1440px",
      },
      colors: {
        "very-dark-grey": "hsl(0, 0%, 17%)",
        "dark-grey": "hsl(0, 0%, 59%)",
      },
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
      },
    },
    plugins: [
      require("postcss-import"),
      require("tailwindcss"),
      require("autoprefixer"),
    ],
  },
];
