import React from "react";
import { 
  FormLabel, 
  FormLabelProps,
  Tooltip,
  Icon,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

import { FaInfoCircle } from "react-icons/fa";

type InfoFormLabelProps = FormLabelProps & {
  info: string
};

const InfoFormLabel: React.FC<InfoFormLabelProps> = ({ children, info, ...props }) => {

  const bg = useColorModeValue("gray.100", "gray.700")
  const fg = useColorModeValue("gray.800", "white")

  return (
    <FormLabel {...props} >
      {children}
      {" "}
      <Tooltip label={info} hasArrow placement="top" p="3" bg={bg} color={fg} borderRadius="md" >
        <Text as="span" fontSize="xs" color="accent1.200" _hover={{ cursor: "pointer" }} >
          <Icon as={FaInfoCircle} />
        </Text>
      </Tooltip>
    </FormLabel>
  )
}

export default InfoFormLabel;