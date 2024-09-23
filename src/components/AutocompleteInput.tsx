import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import Script from 'next/script'

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: { formatted_address: string; latitude: number; longitude: number; }) => void;
  className?: string;
  id?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ value, onChange, onPlaceSelected, className, id }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  useEffect(() => {
    if (isLoaded && !autocompleteRef.current) {
      try {
        autocompleteRef.current = new window.google.maps.places.AutocompleteService()
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error)
      }
    }
  }, [isLoaded])

  useEffect(() => {
    if (autocompleteRef.current && value) {
      autocompleteRef.current.getPlacePredictions(
        {
          input: value,
          componentRestrictions: { country: 'gb' },
          types: ['geocode'],
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions)
          } else {
            setSuggestions([])
          }
        }
      )
    } else {
      setSuggestions([])
    }
  }, [value])

  const handleScriptLoad = () => {
    setIsLoaded(true)
  }

  const handleSuggestionClick = (suggestion: google.maps.places.AutocompletePrediction) => {
    const placesService = new google.maps.places.PlacesService(document.createElement('div'))
    placesService.getDetails(
      { placeId: suggestion.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
          onChange(place.formatted_address || suggestion.description)
          onPlaceSelected({
            formatted_address: place.formatted_address || suggestion.description,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          })
          setSuggestions([])
        }
      }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === 'Enter' && activeSuggestion !== -1) {
      e.preventDefault()
      handleSuggestionClick(suggestions[activeSuggestion])
    }
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={handleScriptLoad}
        async
      />
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setActiveSuggestion(-1)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter an address, town, or city"
          className="w-full"
          aria-label="Address, town, or city input"
          aria-autocomplete="list"
          aria-controls="autocomplete-suggestions"
          aria-expanded={suggestions.length > 0}
        />
        {suggestions.length > 0 && (
          <ul
            id="autocomplete-suggestions"
            className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.place_id}
                className={`px-4 py-2 cursor-pointer ${
                  index === activeSuggestion ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setActiveSuggestion(index)}
                role="option"
                aria-selected={index === activeSuggestion}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default AutocompleteInput;