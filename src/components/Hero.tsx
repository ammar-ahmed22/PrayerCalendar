import React from "react";
import { 
  VStack,
  Heading,
  Text,
  ButtonGroup,
  Button,
  Icon
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { FaLongArrowAltRight } from "react-icons/fa";

const Hero: React.FC = () => {

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <VStack minH="100vh" justify="center" textAlign="center" direction="column" >
      <ColorModeSwitcher />
      <Heading variant="gradient" size="4xl" lineHeight="base" fontWeight="extrabold" >Prayer Calendar</Heading>
      <Text fontSize="3xl" >Create prayer time events for your calendar.</Text>
      <Text fontSize="4xl" >🕌 <Text as="span" verticalAlign="middle"><Icon as={FaLongArrowAltRight} /></Text> 📅</Text>
      <ButtonGroup>
        <Button 
          colorScheme="accent1" 
          variant="solid" 
          onClick={() => scrollToId("generate")} 
        >Generate</Button>
        <Button 
          colorScheme="accent1" 
          variant="outline" 
          onClick={() => scrollToId("what")} 
        >Learn More</Button>
      </ButtonGroup>
    </VStack>
  )
}

export default Hero;