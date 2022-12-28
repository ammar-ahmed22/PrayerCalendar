import React from "react";
import { 
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Text,
  Link
} from "@chakra-ui/react"

interface FileDownloadProps{
  name: string,
  url: string,
  onDownload?: () => void
}

const FileDownload : React.FC<FileDownloadProps> = ({ name, url, onDownload }) => {
  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      borderRadius="xl"
    >
      <AlertIcon boxSize="5vh" mr={0} />
      <AlertTitle mt="4" mb="1" fontSize="lg">
        File Generated!
      </AlertTitle>
      <AlertDescription maxWidth="sm" >
        <Text>Your file is ready to be downloaded. You can find resources on how to upload to your calendar here.</Text>
        <Button as={Link} download={name} href={url} mt="4" colorScheme="green" onClick={onDownload} >Download</Button>
      </AlertDescription>
    </Alert>
  )
}

export default FileDownload;