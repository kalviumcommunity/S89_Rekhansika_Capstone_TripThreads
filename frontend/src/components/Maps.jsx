import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, Marker, Autocomplete } from '@react-google-maps/api';
import Header from '../sections/Header';
import './Maps.css';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060 // New York City as default
};

const Maps = () => {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  const [loading, setLoading] = useState(false);

  const originRef = useRef();
  const destinationRef = useRef();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(pos);
        },
        () => {
          console.log('Error: The Geolocation service failed.');
        }
      );
    }
  }, []);

  const calculateRoute = async () => {
    if (!origin || !destination) {
      alert('Please enter both origin and destination');
      return;
    }

    setLoading(true);

    const directionsService = new window.google.maps.DirectionsService();
    
    try {
      const results = await directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode[travelMode],
      });

      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Could not calculate route. Please check your addresses.');
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    setOrigin('');
    setDestination('');
    if (originRef.current) originRef.current.value = '';
    if (destinationRef.current) destinationRef.current.value = '';
  };

  const useCurrentLocation = () => {
    if (currentLocation) {
      const locationString = `${currentLocation.lat}, ${currentLocation.lng}`;
      setOrigin(locationString);
      if (originRef.current) {
        originRef.current.value = 'Current Location';
      }
    } else {
      alert('Current location not available');
    }
  };

  const centerMap = () => {
    if (map && currentLocation) {
      map.panTo(currentLocation);
      map.setZoom(15);
    }
  };

  return (
    <div className="maps-page">
      <Header />
      <div className="maps-container">
        <h2>Maps & Directions</h2>
        
        <div className="maps-controls">
          <div className="search-section">
            <div className="input-group">
              <label>From:</label>
              <div className="input-with-button">
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocomplete.addListener('place_changed', () => {
                      const place = autocomplete.getPlace();
                      if (place.formatted_address) {
                        setOrigin(place.formatted_address);
                      }
                    });
                  }}
                >
                  <input
                    ref={originRef}
                    type="text"
                    placeholder="Enter origin"
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </Autocomplete>
                <button 
                  className="current-location-btn"
                  onClick={useCurrentLocation}
                  title="Use current location"
                >
                  📍
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>To:</label>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.formatted_address) {
                      setDestination(place.formatted_address);
                    }
                  });
                }}
              >
                <input
                  ref={destinationRef}
                  type="text"
                  placeholder="Enter destination"
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Autocomplete>
            </div>

            <div className="input-group">
              <label>Travel Mode:</label>
              <select 
                value={travelMode} 
                onChange={(e) => setTravelMode(e.target.value)}
              >
                <option value="DRIVING">Driving</option>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
                <option value="TRANSIT">Transit</option>
              </select>
            </div>

            <div className="button-group">
              <button 
                className="calculate-btn"
                onClick={calculateRoute}
                disabled={loading}
              >
                {loading ? 'Calculating...' : 'Get Directions'}
              </button>
              <button 
                className="clear-btn"
                onClick={clearRoute}
              >
                Clear
              </button>
              <button 
                className="center-btn"
                onClick={centerMap}
              >
                Center Map
              </button>
            </div>
          </div>

          {distance && duration && (
            <div className="route-info">
              <h3>Route Information</h3>
              <p><strong>Distance:</strong> {distance}</p>
              <p><strong>Duration:</strong> {duration}</p>
              <p><strong>Travel Mode:</strong> {travelMode.toLowerCase()}</p>
            </div>
          )}
        </div>

        <div className="map-container">
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"}
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={currentLocation || defaultCenter}
              zoom={10}
              onLoad={(map) => setMap(map)}
            >
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
              
              {currentLocation && !directionsResponse && (
                <Marker
                  position={currentLocation}
                  title="Your Location"
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#4285F4" stroke="#fff" stroke-width="2"/>
                        <circle cx="10" cy="10" r="3" fill="#fff"/>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(20, 20)
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default Maps;
