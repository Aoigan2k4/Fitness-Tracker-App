/* global google */
import React, { useState, useRef } from 'react';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';

const center = { lat: 45.43755, lng: -73.6035 };

function MapPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'localContext'],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [places, setPlaces] = useState([]);

  const originRef = useRef();
  const destinationRef = useRef();
  const travelTimeRef = useRef();

  const [markers, setMarkers] = useState([]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  async function calculateRoute() {
    if (!originRef.current.value || !destinationRef.current.value) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.WALKING,
    });

    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  async function findPlaces() {
    if (!originRef.current.value || !travelTimeRef.current.value) {
      alert("Please enter both an origin and travel time.");
      return;
    }

    if (!map) {
      alert("Map is not loaded yet. Please try again.");
      return;
    }

    const travelTimeMinutes = parseInt(travelTimeRef.current.value, 10);
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: originRef.current.value }, (results, status) => {
      if (status !== "OK" || !results || results.length === 0) {
        alert("Invalid location. Please enter a valid address.");
        return;
      }

      const location = results[0].geometry.location;
      const placesService = new google.maps.places.PlacesService(map);
      const initialSearchRadius = 1000; // 1km, ~12-15 min walk
      const placeTypes = ["tourist_attraction", "restaurant", "park", "museum", "cafe", "bar", "hiking_area"];
      let allResults = [];
      let requestsCompleted = 0;

      placeTypes.forEach((placeType) => {
        placesService.nearbySearch(
          {
            location: location,
            radius: initialSearchRadius,
            type: placeType, // One type at a time
          },
          (results, status) => {
            if (status === "OK") {
              allResults.push(...results);
            } else {
              console.error(`Nearby search failed for type: ${placeType}, Status: ${status}`);
            }

            requestsCompleted++;

            if (requestsCompleted === placeTypes.length) {
              processPlaces(allResults, location, travelTimeMinutes);
            }
          }
        );
      });
    });
  }

  function processPlaces(results, originLocation, travelTimeMinutes) {
    if (!results || results.length === 0) {
      alert("No places found matching your criteria.");
      return;
    }

    if (results.length > 25) {
      console.warn(`Too many places found (${results.length}). Limiting to 25.`);
    }
    const limitedResults = results.slice(0, 25);

    const distanceService = new google.maps.DistanceMatrixService();
    const destinations = limitedResults.map((place) => place.geometry.location);

    distanceService.getDistanceMatrix(
      {
        origins: [originLocation],
        destinations: destinations,
        travelMode: google.maps.TravelMode.WALKING,
      },
      (response, status) => {
        if (status !== "OK") {
          alert("Distance matrix request failed: " + status);
          return;
        }

        const filteredPlaces = [];
        response.rows[0].elements.forEach((element, index) => {
          if (element.status === "OK") {
            const durationInMinutes = element.duration.value / 60;

            if (Math.abs(durationInMinutes - travelTimeMinutes) <= 2) {
              filteredPlaces.push(limitedResults[index]);
            }
          }
        });

        if (filteredPlaces.length === 0) {
          alert("No places found within the specified travel time.");
        }

        setPlaces(filteredPlaces);

        // Create markers and track them
        const newMarkers = filteredPlaces.map((place) =>
          new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
          })
        );

        setMarkers(newMarkers);
      }
    );
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setPlaces([]);
    originRef.current.value = '';
    destinationRef.current.value = '';
    travelTimeRef.current.value = '';
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%' }}>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          options={{
            streetViewControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
          {places.map((place, index) => (
            <Marker key={index} position={place.geometry.location} />
          ))}
        </GoogleMap>
      </div>

      <div style={{
        padding: '16px',
        borderRadius: '8px',
        marginTop: '16px',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
        zIndex: 2,
        position: 'relative'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Autocomplete>
            <input type="text" placeholder="Origin" ref={originRef} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </Autocomplete>

          <input type="number" placeholder="Minutes" ref={travelTimeRef} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '80px' }} />

          <Autocomplete>
            <input type="text" placeholder="Destination (optional)" ref={destinationRef} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </Autocomplete>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={calculateRoute} style={{ padding: '8px 16px', backgroundColor: 'pink', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Calculate Route
            </button>
            <button onClick={findPlaces} style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Find Places
            </button>
            <button onClick={clearRoute} style={{ padding: '8px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'space-between', color: 'gray' }}>
          <span>Distance: {distance}</span>
          <span>Duration: {duration}</span>
          <button onClick={() => map.panTo(center)} style={{ padding: '8px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            <FaLocationArrow />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
