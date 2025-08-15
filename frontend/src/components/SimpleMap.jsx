import React, { useState, useEffect } from 'react';
import Header from '../sections/Header';
import './SimpleMap.css';

const SimpleMap = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapUrl, setMapUrl] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [directionsMode, setDirectionsMode] = useState('embed'); // 'embed', 'redirect', 'inline'



  const getDirections = async () => {
    if (!origin || !destination) {
      alert('Please enter both origin and destination');
      return;
    }

    setLoading(true);

    // Check user preference for directions mode
    if (directionsMode === 'redirect') {
      // Directly redirect to Google Maps
      const encodedOrigin = encodeURIComponent(origin);
      const encodedDestination = encodeURIComponent(destination);
      const googleMapsUrl = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;

      // Show a brief notification
      setRouteInfo({
        distance: 'Opening Google Maps...',
        duration: 'Please wait',
        status: 'redirecting'
      });

      // Small delay for better UX
      setTimeout(() => {
        window.open(googleMapsUrl, '_blank');
        setRouteInfo({
          distance: 'Opened in Google Maps',
          duration: 'Check your new tab',
          status: 'opened'
        });
      }, 500);

      setLoading(false);
      return;
    }

    try {
      // Try to get route info using a free geocoding service
      const routeData = await calculateRouteInfo();

      if (routeData) {
        setRouteInfo(routeData);
        if (directionsMode === 'embed') {
          generateGoogleMapsEmbed();
        }
      } else {
        // Fallback to Google Maps embed
        generateGoogleMapsEmbed();
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      generateGoogleMapsEmbed();
    } finally {
      setLoading(false);
    }
  };

  const calculateRouteInfo = async () => {
    try {
      // Use a simple distance calculation as fallback
      const originCoords = await geocodeAddress(origin);
      const destCoords = await geocodeAddress(destination);

      if (originCoords && destCoords) {
        const distance = calculateDistance(originCoords, destCoords);
        const estimatedDuration = Math.round(distance * 1.5); // Rough estimate: 1.5 min per km

        return {
          distance: distance.toFixed(1) + ' km',
          duration: estimatedDuration + ' minutes',
          coordinates: { origin: originCoords, destination: destCoords }
        };
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
    return null;
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const calculateDistance = (coord1, coord2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const generateGoogleMapsEmbed = () => {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);

    // Check if we have a Google Maps API key
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
      // Use Google Maps embed with API key
      const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodedOrigin}&destination=${encodedDestination}&mode=driving`;
      setMapUrl(embedUrl);
    } else {
      // Use Google Maps without API key (will show basic map)
      const embedUrl = `https://maps.google.com/maps?q=${encodedOrigin}+to+${encodedDestination}&output=embed`;
      setMapUrl(embedUrl);
    }
  };

  const openInGoogleMaps = () => {
    const encodedOrigin = encodeURIComponent(origin);
    const encodedDestination = encodeURIComponent(destination);
    const url = `https://www.google.com/maps/dir/${encodedOrigin}/${encodedDestination}`;
    window.open(url, '_blank');
  };

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);

    try {
      // Get current position with high accuracy
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Update current location state
      setCurrentLocation({ lat, lng });

      // Get readable address from coordinates (reverse geocoding)
      const address = await reverseGeocode(lat, lng);

      if (address) {
        setOrigin(address);
        console.log('Current location set to:', address);
      } else {
        // Fallback to coordinates if address lookup fails
        const locationString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setOrigin(locationString);
        console.log('Using coordinates as fallback:', locationString);
      }

    } catch (error) {
      console.error('Error getting current location:', error);

      let errorMessage = 'Unable to get your current location. ';
      if (error.code === 1) {
        errorMessage += 'Please allow location access and try again.';
      } else if (error.code === 2) {
        errorMessage += 'Location information is unavailable.';
      } else if (error.code === 3) {
        errorMessage += 'Location request timed out.';
      } else {
        errorMessage += 'Please check your location settings.';
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Use Nominatim for reverse geocoding (free service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TripThreads-App/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();

      if (data && data.display_name) {
        // Format the address nicely
        const address = data.address;
        let formattedAddress = '';

        if (address) {
          // Build address from components
          const parts = [];

          if (address.house_number && address.road) {
            parts.push(`${address.house_number} ${address.road}`);
          } else if (address.road) {
            parts.push(address.road);
          }

          if (address.neighbourhood || address.suburb) {
            parts.push(address.neighbourhood || address.suburb);
          }

          if (address.city || address.town || address.village) {
            parts.push(address.city || address.town || address.village);
          }

          if (address.state) {
            parts.push(address.state);
          }

          if (address.country) {
            parts.push(address.country);
          }

          formattedAddress = parts.join(', ');
        }

        // Use formatted address or fall back to display_name
        return formattedAddress || data.display_name;
      }

      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  const clearRoute = () => {
    setOrigin('');
    setDestination('');
    setMapUrl('');
    setRouteInfo(null);
  };

  const searchLocation = async (query) => {
    try {
      // Use Nominatim for geocoding (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  };

  return (
    <div className="simple-maps-page">
      <Header />
      <div className="simple-maps-container">
        <h2>Maps & Directions</h2>
        
        <div className="maps-controls">
          <div className="search-section">
            <div className="input-group">
              <label>From:</label>
              <div className="input-with-button">
                <input
                  type="text"
                  placeholder="Enter origin (e.g., New York, NY)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                <button
                  className="current-location-btn"
                  onClick={useCurrentLocation}
                  title="Use current location"
                  disabled={loading}
                >
                  {loading ? '⏳' : '📍'}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>To:</label>
              <input
                type="text"
                placeholder="Enter destination (e.g., Los Angeles, CA)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>



            <div className="button-group">
              <button
                className="get-directions-btn"
                onClick={getDirections}
                disabled={loading}
              >
                {loading ? 'Getting Directions...' :
                 directionsMode === 'redirect' ? '🗺️ Open in Google Maps' : '📍 Get Directions'}
              </button>
              <button
                className="clear-btn"
                onClick={clearRoute}
              >
                Clear
              </button>
              {(origin && destination) && (
                <button
                  className="google-maps-btn"
                  onClick={openInGoogleMaps}
                >
                  🗺️ Open in Google Maps
                </button>
              )}
            </div>
          </div>

          {routeInfo && (
            <div className="route-info">
              <h3>🗺️ Route Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <p><strong>📏 Distance:</strong> {routeInfo.distance}</p>
                  <p><strong>⏱️ Duration:</strong> {routeInfo.duration}</p>
                </div>
                <div>
                  <p><strong>🚗 Mode:</strong> Driving</p>
                  <p><strong>📍 Status:</strong> {directionsMode === 'redirect' ? 'Ready to open Google Maps' : 'Showing in app'}</p>
                </div>
              </div>
              {directionsMode === 'embed' && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(27, 141, 193, 0.1)', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#1b8dc1' }}>
                    💡 <strong>Tip:</strong> Click "Open in Google Maps" below for turn-by-turn navigation
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="map-container">
          {mapUrl ? (
            <iframe
              src={mapUrl}
              width="100%"
              height="500"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Directions"
            />
          ) : (
            <div className="map-placeholder">
              <div className="placeholder-content">
                <h3>🗺️ Smart Directions</h3>
                <p>Choose how you want to get directions:</p>
                <div className="features-list">
                  <div className="feature">
                    <span>📍</span>
                    <span>Show directions in this app</span>
                  </div>
                  <div className="feature">
                    <span>🗺️</span>
                    <span>Open Google Maps directly</span>
                  </div>
                  <div className="feature">
                    <span>⏱️</span>
                    <span>Real-time travel estimates</span>
                  </div>
                  <div className="feature">
                    <span>🧭</span>
                    <span>Turn-by-turn navigation</span>
                  </div>
                </div>
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '12px' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    💡 <strong>Pro Tip:</strong> Select "Open Google Maps directly" for instant navigation!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => {
              setOrigin('Times Square, New York');
              setDestination('Central Park, New York');
            }}>
              NYC: Times Square → Central Park
            </button>
            <button onClick={() => {
              setOrigin('Golden Gate Bridge, San Francisco');
              setDestination('Fisherman\'s Wharf, San Francisco');
            }}>
              SF: Golden Gate → Fisherman's Wharf
            </button>
            <button onClick={() => {
              setOrigin('Hollywood Sign, Los Angeles');
              setDestination('Santa Monica Pier, Los Angeles');
            }}>
              LA: Hollywood → Santa Monica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
