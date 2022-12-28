import React, { useState } from "react";
import { Formik, Field, FormikProps, FormikErrors } from "formik";
import { 
  FormControl,
  Select,
  VStack,
  HStack,
  Heading,
  Button,
  FormErrorMessage,
  Input,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  RadioGroup,
  Radio,
  Stack
} from "@chakra-ui/react";
import LocationInput from "./LocationInput";
import { getPrayerTimes, generateICS } from "../utils/prayerTimes";
import FileDownload from "./FileDownload";
import InfoFormLabel from "./InfoFormLabel";

interface FormValues{
  email: string,
  address: string,
  yearMonth: string,
  latLng: { lat: number, lng: number },
  numMonths: number,
  calculationMethod: string,
  madhab: string 
}

interface File{
  name: string,
  url: string
}
const GenerateForm: React.FC = () => {

  const [generating, setGenerating] = useState(false);
  const [file, setFile] = useState<File>()

  const calculationMethods = [
    "Shia Ithna-Ansari",
    "University of Islamic Sciences, Karachi",
    "Islamic Society of North America",
    "Muslim World League",
    "Umm Al-Qura University, Makkah",
    "Egyptian General Authority of Survey",
    "Institute of Geophysics, University of Tehran",
    "Gulf Region",
    "Kuwait",
    "Qatar",
    "Majlis Ugama Islam Singapura, Singapore",
    "Union Organization islamic de France",
    "Diyanet İşleri Başkanlığı, Turkey",
    "Spiritual Administration of Muslims of Russia"
  ];

  const formFieldDescriptions = {
    address: "Your address is used to calculate the prayer times for your locality using latitude and longitude coordinates. Your data is not saved anywhere.",
    yearMonth: "The month to start generating events from. i.e. December 2022: Prayer events will be generated for all of December 2022 + the number of months you decided to generate for.",
    numMonths: "The number of month to generate events for. 1 month will generate only for the selected month, 2 months will generate for the selected month as well as the next month, etc.",
    calculationMethod: "The authority to be used to conduct the calculations. Each authority uses slightly different variations for calculations. It is best to use the authority closest to your locality.",
    madhab: "The school of thought you implement for matters of fiqh. This is only pertinent for calculation of Asr time. Note: Shafi, Hanbali and Maliki all use the same method, Hanafi differs with a later asr time.",
    email: "The generated file is sent to your email of choosing to make the event upload easier. Email addresses are never saved anywhere."
  }

  const createFile = (fileName: string, fileContent: string) => {
    const blob = new Blob([fileContent]);
    const url = URL.createObjectURL(blob);
    setFile({
      name: fileName,
      url: url
    })
  }



  return (
    <Formik
      initialValues={{
        email: "",
        address: "",
        yearMonth: "",
        latLng: {
          lat: -1,
          lng: -1
        },
        numMonths: 1,
        calculationMethod: "2",
        madhab: "0"
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validate={ (values: FormValues) => {
        const errors : FormikErrors<FormValues> = {}

        if (values.address === ""){
          errors.address = "Please select a value from the dropdown."
        }

        if (values.yearMonth === ""){
          errors.yearMonth = "Start month and year is required"
        }

        return errors
      }}
      onSubmit={async (values, { validateForm }) => {
        validateForm(values)

        setGenerating(true)
        const [year, month] = values.yearMonth.split("-").map( val => parseInt(val));
        const timings = await getPrayerTimes({
          latlng: values.latLng,
          month: month,
          year: year,
          authority: values.calculationMethod,
          madhab: values.madhab,
          numberOfMonths: values.numMonths
        })

        const ics = generateICS(timings);

        if (ics) createFile("prayers.ics", ics);
        setGenerating(false);
        
      }}
    >
      {({ handleSubmit, values, setFieldValue, touched, errors } : FormikProps<FormValues>) => (
        <form onSubmit={handleSubmit} >
          <VStack align="flex-start" flex="1"  >
            <Heading size="lg">File</Heading>
            <FormControl isRequired isInvalid={!!errors.email && touched.email} >
              <InfoFormLabel htmlFor="email" info={formFieldDescriptions.email} >
                Email
              </InfoFormLabel>
              <Field 
                as={Input}
                name="email"
                id="email"
                type="email"
                placeholder="Enter your e-mail address"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <Heading size="lg" >Location</Heading>
            <FormControl isInvalid={!!errors.address && touched.address} isRequired >
              <InfoFormLabel htmlFor="address" info={formFieldDescriptions.address} >
                Address
              </InfoFormLabel>
              <LocationInput 
                onLocationSet={(place) => {
                  const lat = place.geometry?.location?.lat()
                  const lng = place.geometry?.location?.lng()
                  setFieldValue("latLng", { lat, lng });
                  setFieldValue("address", place.formatted_address);
                  console.log({ lat, lng });
                }}
                name="address"
                autoComplete="off"
              />
              <FormErrorMessage>
                {
                  errors.address
                }
              </FormErrorMessage>
            </FormControl>
            <Heading size="lg">Duration</Heading>
            <Stack w="100%" spacing={5} direction={{ base: "column", md: "row" }} >
                <FormControl isRequired isInvalid={!!errors.yearMonth && touched.yearMonth} >
                  <InfoFormLabel htmlFor="yearMonth" info={formFieldDescriptions.yearMonth}>Month To Start Generating From</InfoFormLabel>
                  <Field 
                    as={Input}
                    type="month"
                    name="yearMonth"
                    id="yearMonth"
                  />
                  <FormErrorMessage>{errors.yearMonth}</FormErrorMessage>
                </FormControl>
                <FormControl>
                  <InfoFormLabel htmlFor="numMonths" info={formFieldDescriptions.numMonths}>Number of Months</InfoFormLabel>
                  <Slider 
                    defaultValue={1} 
                    min={1} 
                    max={12} 
                    step={1}
                    onChange={v => setFieldValue("numMonths", v)} 
                  >
                    <SliderTrack >
                      <SliderFilledTrack bgGradient="linear(to-r, accent1.500, accent2.500)" />
                    </SliderTrack>
                    <SliderThumb boxSize="5" >
                      <Box color="gray.800" fontSize="xs" > 
                        {values.numMonths}
                      </Box>
                    </SliderThumb>
                    
                  </Slider>
                </FormControl>
            </Stack>
            <Heading size="lg">Calculation Options</Heading>
            <Stack spacing={5} direction={{ base: "column", md: "row" }} >
              <FormControl>
                <InfoFormLabel htmlFor="calculationMethod" info={formFieldDescriptions.calculationMethod} >Calculation Authority</InfoFormLabel>
                <Field
                  as={Select}
                  name="calculationMethod"
                  id="calculationMethod"
                >
                  {
                    calculationMethods.map( (method, idx) => {
                      return (
                        <option value={idx} key={method} >
                          {method}
                        </option>
                      )
                    })
                  }
                </Field>
              </FormControl>

              <FormControl>
                <InfoFormLabel htmlFor="madhab" info={formFieldDescriptions.madhab} >Madhab</InfoFormLabel>
                <RadioGroup name="madhab" id="madhab" defaultValue="0" >
                  <HStack spacing={2} >
                    <Radio value="0" colorScheme="accent1" >Shafi (Standard)</Radio>
                    <Radio value="1" colorScheme="accent1" >Hanafi (Later Asr)</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </Stack>
            <Button type="submit" colorScheme="accent1" isLoading={generating} loadingText="Generating"  >Generate</Button>
            {
              file && (
                <FileDownload name={file.name} url={file.url} onDownload={() => {
                  setTimeout(() => {
                    URL.revokeObjectURL(file.url);
                    setFile(undefined);
                  }, 3000)
                }}/>
              )
            }
          </VStack>
        </form>
      )}
    </Formik>
  )
}

export default GenerateForm;