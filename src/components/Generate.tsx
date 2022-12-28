import React from "react";
import { 
  Heading,
  Box
} from "@chakra-ui/react";
import GenerateForm from "./GenerateForm";

const Generate : React.FC = () => {


  return (
    <Box id="generate" px={{ base: "5", md: "40" }} py="10"  w="100%"   >
      <Heading variant="gradient" fontWeight="bold" display="inline-block" >Generate</Heading>
      <GenerateForm />
    </Box>
  )
}

export default Generate;