import React, { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapComponent.css";

const MAP_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY || "c028660ae68f4d5d812137b17af9711c";

const categoryMapping = {
  "Archaeological Sites": "tourism.sights,heritage.culture",
  "Temples": "tourism.sights,religion.place_of_worship",
  "Coffee Shops": "catering.cafe,catering.restaurant",
  "Hill Stations": "natural.mountain",
  "Beaches": "natural.beach,leisure.park",
  "Wildlife & Safari": "leisure.zoo,natural.park",
  "Adventure Sports": "sport.extreme",
  "Cultural Experiences": "heritage.culture",
  "Weekend Getaways": "tourism.sights,natural.park",
  "Pilgrimage Spots": "tourism.sights",
  "Foodie Dreams": "catering.restaurant",
  "Trekking Spots": "natural.mountain",
  "Relaxation Spots": "leisure.spa,leisure.resort",
  "Romantic Places": "tourism.sights,leisure.park",
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
            const isSelected = [...selectedPlaces].some((p) => p.name === name);
            existingMarker.setIcon(isSelected ? selectedIcon : defaultIcon);

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
            setSelectedPlaces((prevSet) => {
              const newSet = new Set(prevSet);
              const exists = [...newSet].some((p) => p.name === name);
          
              if (exists) {
                newSet.forEach((p) => {
                  if (p.name === name) newSet.delete(p);
                });
                marker.setIcon(defaultIcon);
              } else {
                newSet.add(placeData);
                marker.setIcon(selectedIcon);
              }
          
              onSelectionChange([...newSet]); // update parent with current selection
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
  
      const baseUrl = "https://api.geoapify.com/v2/places";
      const limit = 100;
      const apiKey = MAP_API_KEY;
  
      const filters = [
        `circle:74.8,34.1,400000`,   // Jammu & Kashmir
        `circle:76.7,30.7,500000`,   // Punjab / Chandigarh
        `circle:73.0,26.9,500000`,   // Rajasthan
        `circle:77.1,28.6,500000`,   // Delhi / Haryana
        `circle:80.9,26.8,500000`,   // Uttar Pradesh
        `circle:85.3,23.3,400000`,   // Bihar
        `circle:84.0,21.3,400000`,   // Chhattisgarh
        `circle:86.1,23.6,400000`,   // Jharkhand
        `circle:88.4,22.6,500000`,   // West Bengal
        `circle:85.8,20.3,500000`,   // Odisha
        `circle:91.7,26.1,400000`,   // Assam
        `circle:92.9,23.3,300000`,   // Tripura / Mizoram
        `circle:76.2,10.5,500000`,   // Kerala
        `circle:78.1,11.0,500000`,   // Tamil Nadu
        `circle:73.8,18.5,500000`,   // Maharashtra
        `circle:78.4,17.4,500000`,   // Telangana
        `circle:77.6,15.5,500000`,   // Karnataka
        `circle:80.0,23.0,500000`,   // Madhya Pradesh
        `circle:70.7,22.7,500000`,   // Gujarat
        `circle:79.7,15.9,400000`,   // Andhra Pradesh
        `circle:78.0,26.5,400000`,   // Uttarakhand
      ];
      
      
  
      const urls = filters.map(filter =>
        `${baseUrl}?categories=${selectedCategories}&filter=${filter}&limit=${limit}&apiKey=${apiKey}`
      );
  
      const responses = await Promise.all(
        urls.map((url) => fetch(url).then((res) => res.json()))
      );
  
      const allFeatures = responses.flatMap((res) => res.features || []);
  
      if (allFeatures.length) {
        console.log(
          "Fetched places:",
          allFeatures.map((p) => ({
            name: p.properties.name,
            lat: p.geometry.coordinates[1],
            lon: p.geometry.coordinates[0],
          }))
        );
        addMarkers(allFeatures);
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
