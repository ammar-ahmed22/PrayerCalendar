import React, { useEffect, useRef } from "react";
import { Input, InputProps } from "@chakra-ui/react";

type LocationInputProps = InputProps & {
  onLocationSet: (place: google.maps.places.PlaceResult) => void,
  options?: google.maps.places.AutocompleteOptions
}

const LocationInput : React.FC<LocationInputProps> = ({ 
  onLocationSet, 
  options = {
    fields: [
      "address_component",
      "formatted_address",
      "geometry.location"
    ],
    types: ["address"]
  },
  ...props
}) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (inputRef.current){
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        options
      )
    }
  }, [inputRef, options])

  useEffect(() => {
    if (autocompleteRef.current){
      autocompleteRef.current.addListener("place_changed", () => {
        if (autocompleteRef.current){
          const place = autocompleteRef.current.getPlace();
          onLocationSet(place)
        }
      })
    }
  }, [onLocationSet])

  return (
    <Input 
      { ...props }
      ref={inputRef}
    />
  )
}

export default LocationInput;