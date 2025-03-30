import React, { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapComponent.css";

const MAP_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY || "c028660ae68f4d5d812137b17af9711c";

const categoryMapping = {
  "Archaeological Sites": "tourism.attraction",
  "Temples": "tourism.sights.place_of_worship.shrine",
  "Coffee Shops": "catering.cafe",
  "Hill Stations": "natural.mountain",
  "Beaches": "beach,beach.beach_resort",
  "Wildlife & Safari": "leisure.park,national_park",
  "Adventure Sports": "sport",
  "Cultural Experiences": "entertainment.museum,entertainment.culture,tourism.sights.city_hall",
  "Weekend Getaways": "natural,commercial.outdoor_and_sport",
  "Pilgrimage Spots": "tourism.sights.place_of_worship",
  "Foodie Dreams": "catering.restaurant,catering.food_court",
  "Trekking Spots": "natural.mountain",
  "Relaxation Spots": "building.spa,leisure.spa,service.beauty",
  "Romantic Places": "leisure.park,beach,natural.water,commercial.garden",
};

const MapComponent = ({ userPreferences, onSelectionChange, userId }) => {
  const [map, setMap] = useState(null);
  const [markersLayer, setMarkersLayer] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState(new Set());
  const [placesList, setPlacesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const newMap = L.map("map", { preferCanvas: true }).setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(newMap);

    const layerGroup = L.layerGroup().addTo(newMap);
    setMarkersLayer(layerGroup);
    setMap(newMap);

    return () => newMap.remove();
  }, []);

  const fetchWikipediaSummary = async (placeName) => {
    const wikiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`;

    try {
      const response = await fetch(wikiURL);
      const data = await response.json();
      return data.extract || "No Wikipedia summary available.";
    } catch (error) {
      console.error(`Error fetching Wikipedia data for ${placeName}:`, error);
      return "No Wikipedia summary available.";
    }
  };

  const addMarkers = useCallback(
    async (places) => {
      if (!map || !markersLayer) {
        console.warn("Map or Markers Layer is not initialized.");
        return;
      }
  
      // ✅ Keep existing markers instead of clearing them completely
      const existingMarkers = new Map();
      markersLayer.eachLayer((layer) => {
        if (layer.options && layer.options.placeData) {
          existingMarkers.set(layer.options.placeData.name, layer);
        }
      });
  
      const updatedPlaces = await Promise.all(
        places.map(async (place) => {
          const [lon, lat] = place.geometry.coordinates;
          const { name, address_line1, categories } = place.properties;
  
          if (!lat || !lon) return null;
  
          const description = await fetchWikipediaSummary(name);
  
          const placeData = { lat, lon, name, address: address_line1, description };
  
          const defaultIcon = L.icon({
            iconUrl: `https://api.geoapify.com/v1/icon/?type=material&color=blue&size=large&icon=map-marker&apiKey=${MAP_API_KEY}`,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -35],
          });
  
          const selectedIcon = L.icon({
            iconUrl: `https://api.geoapify.com/v1/icon/?type=material&color=red&size=large&icon=map-marker&apiKey=${MAP_API_KEY}`,
            iconSize: [30, 40],
            iconAnchor: [15, 40],
            popupAnchor: [0, -35],
          });
  
          const popupContent = `
            <b>${name || "Unknown Place"}</b><br>
            ${address_line1 || "No Address Available"}<br>
            <i>${categories?.join(", ") || "No category available"}</i><br>
            <p>${description}</p>
          `;
  
          // ✅ If marker already exists, just update its icon
          if (existingMarkers.has(name)) {
            const existingMarker = existingMarkers.get(name);
            existingMarker.setIcon(selectedPlaces.has(name) ? selectedIcon : defaultIcon);
            return placeData;
          }
  
          // ✅ Create a new marker if it doesn't exist
          const marker = L.marker([lat, lon], {
            icon: selectedPlaces.has(name) ? selectedIcon : defaultIcon,
            placeData, // Store place data for reference
          }).addTo(markersLayer);
          
          marker.bindPopup(popupContent);
  
          marker.on("mouseover", () => marker.openPopup());
          marker.on("mouseout", () => marker.closePopup());
  
          marker.on("click", () => {
            setSelectedPlaces((prev) => {
              const newSet = new Set(prev);
              const exists = [...newSet].some((p) => p.lat === lat && p.lon === lon);
  
              if (exists) {
                newSet.delete([...newSet].find((p) => p.lat === lat && p.lon === lon));
                marker.setIcon(defaultIcon);
              } else {
                newSet.add(placeData);
                marker.setIcon(selectedIcon);
              }
  
              // ✅ Ensure data is sent to backend
              onSelectionChange([...newSet]);
              return newSet;
            });
          });
  
          return placeData;
        })
      );
  
      setPlacesList(updatedPlaces.filter(Boolean));
    },
    [map, markersLayer, onSelectionChange, selectedPlaces]
  );
  
  

  const fetchTouristSpots = useCallback(async () => {
    if (!userPreferences?.interests?.length || !map) return;

    setLoading(true);
    setError("");

    try {
      const selectedCategories = userPreferences.interests
        .flatMap((interest) => categoryMapping[interest]?.split(",") || [])
        .join(",");

      const url = `https://api.geoapify.com/v2/places?categories=${selectedCategories}&filter=rect:68.1766,35.4940,97.3956,6.4627&limit=100&apiKey=${MAP_API_KEY}`;

      console.log("Fetching URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length) {
        console.log(
          "Fetched places:",
          data.features.map((p) => ({ name: p.properties.name, lat: p.geometry.coordinates[1], lon: p.geometry.coordinates[0] }))
        );
        addMarkers(data.features);
      } else {
        console.warn("No places found for the given preferences.");
        setError("No places found. Try different preferences.");
      }
    } catch (error) {
      console.error("Failed to fetch tourist spots.", error);
      setError("Failed to fetch tourist spots.");
    } finally {
      setLoading(false);
    }
  }, [map, userPreferences, addMarkers]);

  useEffect(() => {
    fetchTouristSpots();
  }, [fetchTouristSpots]);

  return (
    <div className="map-wrapper">
      {loading && <div className="loading-text">Loading tourist spots...</div>}
      {error && <div className="error-text">{error}</div>}
      <div id="map" className="map-box"></div>

      <div className="places-list">
        <h3>Tourist Places</h3>
        <ul>
          {placesList.map((place, index) => (
            <li key={index}>
              <b>{place.name}</b> - {place.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
