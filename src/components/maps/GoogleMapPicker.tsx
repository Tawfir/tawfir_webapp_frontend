import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface GoogleMapPickerProps {
  lat: number | null;
  lng: number | null;
  onLocationChange: (lat: number, lng: number, address: string) => void;
  height?: string;
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export default function GoogleMapPicker({ lat, lng, onLocationChange, height = "400px" }: GoogleMapPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    lat && lng ? { lat, lng } : null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
  });

  const center = useMemo(() => {
    if (lat && lng) {
      return { lat, lng };
    }
    // Default to Dubai, UAE (me-central-1 region)
    return { lat: 25.2048, lng: 55.2708 };
  }, [lat, lng]);

  const onMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setMarkerPosition({ lat: newLat, lng: newLng });

        // Reverse geocode to get address
        try {
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({ location: { lat: newLat, lng: newLng } });
          const address = response.results[0]?.formatted_address || "";
          onLocationChange(newLat, newLng, address);
        } catch (error) {
          console.error("Geocoding error:", error);
          onLocationChange(newLat, newLng, "");
        }
      }
    },
    [onLocationChange]
  );

  const onMarkerDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setMarkerPosition({ lat: newLat, lng: newLng });

        // Reverse geocode to get address
        try {
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({ location: { lat: newLat, lng: newLng } });
          const address = response.results[0]?.formatted_address || "";
          onLocationChange(newLat, newLng, address);
        } catch (error) {
          console.error("Geocoding error:", error);
          onLocationChange(newLat, newLng, "");
        }
      }
    },
    [onLocationChange]
  );

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    // Set initial marker position if lat/lng exist
    if (lat && lng) {
      setMarkerPosition({ lat, lng });
    }
  }, [lat, lng]);

  const onAutocompleteLoad = useCallback((autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        const address = place.formatted_address || "";
        
        setMarkerPosition({ lat: newLat, lng: newLng });
        
        // Center map on selected place
        if (map) {
          map.setCenter({ lat: newLat, lng: newLng });
          map.setZoom(15);
        }
        
        onLocationChange(newLat, newLng, address);
      }
    }
  }, [autocomplete, map, onLocationChange]);

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (lat && lng) {
      setMarkerPosition({ lat, lng });
      if (map) {
        map.setCenter({ lat, lng });
        map.setZoom(15);
      }
    }
  }, [lat, lng, map]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full rounded-lg border border-border bg-muted/30">
        <div className="text-center text-muted-foreground p-4">
          <p className="text-sm font-medium">Error loading Google Maps</p>
          <p className="text-xs mt-1">Please check your API key configuration</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full rounded-lg border border-border bg-muted/30">
        <div className="text-center text-muted-foreground p-4">
          <p className="text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full rounded-lg border border-border bg-muted/30">
        <div className="text-center text-muted-foreground p-4">
          <p className="text-sm font-medium">Google Maps API key not configured</p>
          <p className="text-xs mt-1">Please set VITE_GOOGLE_MAPS_API_KEY in your .env file</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <div>
        <Label htmlFor="address-search" className="text-sm">
          Search Address
        </Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
          <Autocomplete
            onLoad={onAutocompleteLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
              types: ["address"],
              componentRestrictions: { country: ["ae", "sa", "kw", "om", "qa", "bh"] }, // GCC countries
            }}
          >
            <input
              id="address-search"
              ref={searchInputRef}
              type="text"
              placeholder="Search for an address..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </Autocomplete>
        </div>
      </div>
      <div style={{ height }} className="w-full rounded-lg overflow-hidden border border-border">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={markerPosition ? 15 : 12}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {markerPosition && (
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={onMarkerDragEnd}
              title="Restaurant Location"
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

