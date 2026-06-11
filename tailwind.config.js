/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gold: "#E0A31D",
        primary: "#0F1729",
        lightBlue: "#5CA6DA",
        BgWhite: "#F8FAFC",
      },
      fontFamily: {
         inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-bold": ["Inter_700Bold"],
         "inter-semibold": ["Inter_600SemiBold"],
        "space-grotesk": ["SpaceGrotesk_400Regular"],
        "space-grotesk-medium": ["SpaceGrotesk_500Medium"],
        "space-grotesk-bold": ["SpaceGrotesk_700Bold"],
         "space-grotesk-extrabold": ["SpaceGrotesk_600SemiBold"],
         "manrope-Bold" : [" Manrope_700Bold"],
         "manrope-SemiBold" : ["Manrope_600SemiBold"]
      },
      fontSize: {
        cxxl: 46,
        cxl: 32,
        cml : 30,
        clg: 22,
        csl: 20,
        cmd: 18,
        cno: 16,
        csm: 14,
        cxs: 10,
      },
    },
  },
  plugins: [],
};
