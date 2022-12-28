import React from "react"
import {
  Box,
} from "@chakra-ui/react"
import Hero from "./components/Hero"
import Info from "./components/Info"
import Generate from "./components/Generate"


export const App : React.FC = () => {
  return (
    <Box>
      <Hero />
      <Generate />
      <Info />
    </Box>
  )
}
