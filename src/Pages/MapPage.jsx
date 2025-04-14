/* global google */
import React, { useState, useRef } from 'react';
import { FaLocationArrow, FaTimes } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api';
import "../Styles/MapPage.css";
import WeatherCard from '../components/WeatherCard';

const center = { lat: 45.43755, lng: -73.6035 };

function MapPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [places, setPlaces] = useState([]);
  const { exerciseType } = location.state || {};

  const originRef = useRef();
  const destinationRef = useRef();
  const travelTimeRef = useRef();
  const [markers, setMarkers] = useState([]);
  const directionsRendererRef = useRef(null); // Ref for DirectionsRenderer

  if (!isLoaded) {
    return <div>Loading...</div>;
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

    // Explicitly clear the DirectionsRenderer from the map
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null); // Remove the renderer from the map
      directionsRendererRef.current = null; // Reset the reference
    }
  }

  async function calculateRoute() {
    if (!originRef.current.value || !destinationRef.current.value) return;
    
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.WALKING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);

    // Create and attach a DirectionsRenderer instance
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
    }
    directionsRendererRef.current.setDirections(results);
    directionsRendererRef.current.setMap(map); // Attach to the map
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

        // setMarkers(newMarkers);
        setMarkers(prevMarkers => [...prevMarkers, ...newMarkers]); // Append new markers
      }
    );
  }

  async function caloriesBurned() {
    const username = sessionStorage.getItem("username");
    
    var dailyCalorieBurn = 0;
    console.log("Username: ", username);
    const response = await fetch(`http://localhost:5000/api/user-data?username=${encodeURIComponent(username)}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    });

    const userData = await response.json()

    try {
      if(!duration) { return }

        let MET = 0.0
        if (exerciseType === "walk"){
          MET = 3.8
        }
        else if(exerciseType === "run") {
          MET = 7.5
        }

        if (duration.includes("hour")) {
          const time = duration.split(" ");
          const hour = parseInt(time[0]) * 60;
          const min = parseInt(time[2]) + hour;
          console.log("Duration:", duration);
          console.log(min);
          console.log(hour);
        
          const caloriesBurned = (MET * 3.5 * parseFloat(userData.weight)) / 200 * min; 
          let calToBurn = (parseFloat(userData.dailyCalorieBurn) - caloriesBurned).toFixed(2);
        
          console.log(caloriesBurned);
          console.log(calToBurn);
        
          if (calToBurn < 0) {
            dailyCalorieBurn = "0";
          }
          else {
            dailyCalorieBurn = calToBurn;
          }
          console.log(dailyCalorieBurn)

          try {
            const response = await fetch("http://localhost:5000/api/update-user-info", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, dailyCalorieBurn }),
            });
      
            if (response.ok) {
                alert("Calories burned updated successfully!");
            } else {
                const data = await response.json();
                alert(data.message || "Error updating calories burned");
            }
          } catch (error) {
            console.error("Error updating calories burned:", error);
          }
          navigate("/info");
          console.log("Your stats have been updated");
        }
        else {
          const caloriesBurned = (MET * 3.5 * parseFloat(userData.weight)) / 200 * parseFloat(duration);
          let calToBurn = (parseFloat(userData.dailyCalorieBurn) - caloriesBurned).toFixed(2);
          console.log("Duration:", duration);
          console.log(parseFloat(userData.dailyCalorieBurn))
          console.log(caloriesBurned)
          console.log(calToBurn)

          if (calToBurn < 0) {
            dailyCalorieBurn = "0";
          } else {
            dailyCalorieBurn = calToBurn;
          }

        try {
          const response = await fetch("http://localhost:5000/api/update-user-info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, dailyCalorieBurn }),
          });
  
          if (response.ok) {
              alert("Calories burned updated successfully!");
          } else {
              const data = await response.json();
              alert(data.message || "Error updating calories burned");
          }
        } catch (error) {
          console.error("Error updating calories burned:", error);
        }
          navigate("/info");
          console.log("Your stats has been updated!");
        }
    }
    catch (error){
      console.error("Error updating calories:", error);
    }
  }

  function panToOrigin() {
  if (originRef.current.value) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: originRef.current.value }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        map.panTo(location); // Pan the map to the origin location
      } else {
        alert("Invalid origin address. Please enter a valid address.");
      }
    });
  } else {
    map.panTo(center); // Pan to the default center if no origin is provided
  }
}

  return (
    <div className="map-page-container">
      <div className="map-filter-card">
        <h3 className="map-instruction">
          💡 <b>How to calculate your route?</b> Enter an origin, destination, or walking time → then tap 
          <span className="highlight-calc"> "Calculate Route"</span> or 
          <span className="highlight-place"> "Find Places"</span>
        </h3>

        <div className="input-group">
          <Autocomplete><input type="text" placeholder="Origin" ref={originRef} /></Autocomplete>
          <input type="number" placeholder="Minutes" ref={travelTimeRef} />
          <Autocomplete><input type="text" placeholder="Destination" ref={destinationRef} /></Autocomplete>
        </div>

        <div className="button-group">
          <button onClick={calculateRoute} className="map-button btn-calc">Calculate Route</button>
          <button onClick={findPlaces} className="map-button btn-places">Find Places</button>
          <button onClick={caloriesBurned} className="map-button btn-finish">Finish Session</button>
          <button onClick={clearRoute} className="map-button btn-clear"><FaTimes /></button>
        </div>

        <div className="info-bar">
          <span>Distance: {distance}</span>
          <span>Duration: {duration}</span>
          <button onClick={panToOrigin} className="btn-go"><FaLocationArrow /></button>
        </div>

        <div className="session-note">
          <p><strong>Exercise:</strong> {exerciseType || "Not selected"}</p>
          <p><strong>Status:</strong> Finish to update your calories burned</p>
        </div>
      </div>

      <div className="map-container">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={map => setMap(map)}
          options={{ streetViewControl: false, fullscreenControl: false }}
        >
          <Marker position={center} clickable={false} />
          {places.map((place, index) => (
            <Marker key={index} position={place.geometry.location} clickable={false} />
          ))}
        </GoogleMap>

        <div className="floating-card-topright">
          🌍 Explore nearby by <b>time</b> or plan <br /> your <b>walking route!</b>
        </div>

        <div className="floating-weather">
          <WeatherCard />
        </div>
      </div>
    </div>
  );
}

export default MapPage;
