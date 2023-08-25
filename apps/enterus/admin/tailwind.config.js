const { theme } = require('../../../libs/enterus/utils/src');

const config = {
  content: [
    'pages/*.{js,ts,jsx,tsx,mdx}',
    'layout/*.{js,ts,jsx,tsx,mdx}',
    'pages/**/*.{js,ts,jsx,tsx,mdx}',
    'components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: theme,
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

export default config;
