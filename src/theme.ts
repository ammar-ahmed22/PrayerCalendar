import { extendTheme } from "@chakra-ui/react";

const colors = {
  accent1: {
    50: "#fdae8e",
    100: "#fc9e77",
    200: "#fc8e61",
    300: "#fb7d4a",
    400: "#fb6d34",
    500: "#fa5d1d",
    600: "#e1541a",
    700: "#c84a17",
    800: "#af4114",
    900: "#963811"
  },
  accent2: {
    50: "#fcde96",
    100: "#fbd780",
    200: "#fbd06b",
    300: "#fac956",
    400: "#fac341",
    500: "#f9bc2c",
    600: "#e0a928",
    700: "#c79623",
    800: "#ae841f",
    900: "#95711a"
  }
}

const components = {
  Text: {
    variants: {
      gradient: {
        bgGradient: "linear(to-r, accent1.500, accent2.500)",
        bgClip: "text"
      }
    }
  },
  Heading: {
    variants: {
      gradient: {
        bgGradient: "linear(to-r, accent1.500, accent2.500)",
        bgClip: "text"
      }
    }
  }
}

const config = {
  initialColorMode: "dark"
}

export const theme = extendTheme({ colors, components, config })