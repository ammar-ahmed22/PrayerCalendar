import React from "react";
import { VStack, Text, Spinner } from "@chakra-ui/react"

const Loading : React.FC = () => {
  return (
    <VStack align="center" justify="center" >
      <VStack>
        <Spinner 
          size="xl"
          color="accent1.500"
          thickness="4px"
          speed="0.65s"
        />
        <Text fontSize="xl" fontWeight="bold" variant="gradient">Loading</Text>
      </VStack>
    </VStack>
  )
}

export default Loading;