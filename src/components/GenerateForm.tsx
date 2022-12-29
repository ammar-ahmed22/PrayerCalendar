import React, { useState } from "react";
import "datejs"
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
  RadioGroup,
  Radio,
  Stack,
  Checkbox
} from "@chakra-ui/react";
import LocationInput from "./LocationInput";
import FileDownload from "./FileDownload";
import InfoFormLabel from "./InfoFormLabel";
import { authorities, formFieldDescriptions } from "../data/form";
import { generateICS } from "../utils/ics";
import { rangeTimings } from "../utils/prayer";
import type { Prayer } from "../utils/prayer"; 


interface FormValues{
  address: string,
  start: string,
  end: string,
  latlng: { lat: number, lng: number },
  authority: string,
  madhab: string,
  duration: number,
  offsets: string,
  includeSunrise: boolean
}

interface File{
  name: string,
  url: string
}
const GenerateForm: React.FC = () => {

  const [generating, setGenerating] = useState(false);
  const [file, setFile] = useState<File>()

  const createFile = (fileName: string, fileContent: string) => {
    const blob = new Blob([fileContent]);
    const url = URL.createObjectURL(blob);
    setFile({
      name: fileName,
      url: url
    })
  }

  const createOffsets = (offsetStr: string) : { [x in Prayer]?: number } => {

    const offsets : { [x in Prayer]?: number } = {};
    const offsetArr = offsetStr.split(",").map( str => parseInt(str.trim()));
    const idxMap : Record<number, Prayer> = {
      0: "Fajr",
      1: "Dhuhr",
      2: "Asr",
      3: "Maghrib",
      4: "Isha"
    }
    for (let i = 0; i < offsetArr.length; i++){
      if (offsetArr[i] !== 0){
        offsets[idxMap[i]] = offsetArr[i];
      }
    }

    return offsets
  }

  const createFileName = (start: Date, end: Date) : string => {
    const startStr = start.toString("yyyy-MM-dd");
    const endStr = end.toString("yyyy-MM-dd");
    return `prayers_${startStr}_${endStr}.ics`;
  }

  return (
    <Formik
      initialValues={{
        address: "",
        start: Date.today().toString("yyyy-MM-dd"),
        end: "",
        latlng: {
          lat: -1,
          lng: -1
        },
        authority: "2",
        madhab: "0",
        duration: 5,
        offsets: "0,0,0,0,0",
        includeSunrise: false
      }}
      validateOnBlur={false}
      validateOnChange={false}
      validate={ (values: FormValues) => {
        const errors : FormikErrors<FormValues> = {}

        if (values.address === ""){
          errors.address = "Please select a value from the dropdown."
        }

        if (values.duration < 5){
          errors.duration = "Event duration must be greater than or equal to 5 minutes."
        }

        if (values.duration > 60){
          errors.duration = "Event duration cannot be greater than 60 minutes."
        }

        if (values.offsets.split(",").length !== 5){
          errors.offsets = "Offsets must be a comma separated list of 5 values."
        }

        const offsets = values.offsets.split(",");
        offsets.forEach( offset => {
          const o = offset.trim();
          if (isNaN(parseInt(o)) || parseInt(o) < 0 || parseInt(o) > 60){
            errors.offsets = "Offset values must be positive integers between 0 and 60"
          }
        })

        return errors
      }}
      onSubmit={async (values, { validateForm }) => {
        validateForm(values)
        const { 
          latlng, 
          start, 
          end, 
          authority, 
          madhab, 
          duration, 
          offsets,
          includeSunrise 
        } = values;
        setGenerating(true)
        const timings = await rangeTimings({
          latlng,
          start: Date.parse(start),
          end: Date.parse(end).at("11:59 PM"),
          authority,
          madhab
        });
        
        const ics = generateICS(timings, { 
          duration, 
          offsets: createOffsets(offsets),
          includeSunrise
        });
        
        if (ics) {
          createFile(
            createFileName(
              Date.parse(start), 
              Date.parse(end)
            ), 
            ics
          );
        }

        setGenerating(false);
        
      }}
    >
      {({ handleSubmit, values, setFieldValue, touched, errors } : FormikProps<FormValues>) => (
        <form onSubmit={handleSubmit} >
          <VStack align="flex-start" flex="1" spacing={4}  >
            <Heading size="lg" >Location</Heading>
            <FormControl isInvalid={!!errors.address && touched.address} isRequired >
              <InfoFormLabel htmlFor="address" info={formFieldDescriptions.address} >
                Address
              </InfoFormLabel>
              <LocationInput 
                onLocationSet={(place) => {
                  const lat = place.geometry?.location?.lat()
                  const lng = place.geometry?.location?.lng()
                  setFieldValue("latlng", { lat, lng });
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
              <FormControl isRequired isInvalid={!!errors.start && touched.start}>
                <InfoFormLabel htmlFor="start" info={formFieldDescriptions.start}>Start Date</InfoFormLabel>
                <Field 
                  as={Input}
                  type="date"
                  name="start"
                  id="start"
                />
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.end && touched.end}>
                <InfoFormLabel htmlFor="end" info={formFieldDescriptions.end}>End Date</InfoFormLabel>
                <Field 
                  as={Input}
                  type="date"
                  name="end"
                  min={values.start}
                  isDisabled={values.start === ""}
                  id="end"
                />
              </FormControl>
            </Stack>
            <Heading size="lg">Calculation Options</Heading>
            <Stack spacing={5} direction={{ base: "column", md: "row" }} >
              <FormControl>
                <InfoFormLabel htmlFor="authority" info={formFieldDescriptions.authority} >Calculation Authority</InfoFormLabel>
                <Field
                  as={Select}
                  name="authority"
                  id="authority"
                >
                  {
                    authorities.map( (authority, idx) => {
                      return (
                        <option value={idx} key={authority} >
                          {authority}
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
            <Heading size="lg">Event Options</Heading>
            <Stack w="100%" spacing={5} direction={{ base: "column", md: "row" }} >
              <FormControl isInvalid={!!errors.duration && touched.duration}>
                  <InfoFormLabel htmlFor="duration" info={formFieldDescriptions.duration}>Event Duration</InfoFormLabel>
                  <Field
                    as={Input}
                    type="number"
                    name="duration"
                    id="duration"
                  />
                  <FormErrorMessage>{errors.duration}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.offsets && touched.offsets}>
                <InfoFormLabel htmlFor="offsets" info={formFieldDescriptions.offsets}>Offsets</InfoFormLabel>
                <Field 
                  as={Input}
                  type="text"
                  name="offsets"
                  id="offsets"
                />
                <FormErrorMessage>{errors.offsets}</FormErrorMessage>
              </FormControl>
            </Stack>
            <FormControl>
              <Field
                as={Checkbox}
                name="includeSunrise"
                id="includeSunrise"
                colorScheme="accent1"
              >
                Include Sunrise?
              </Field>
            </FormControl>
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