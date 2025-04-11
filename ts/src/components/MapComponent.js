import React, { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapComponent.css";

const MAP_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY || "c028660ae68f4d5d812137b17af9711c";

const categoryMapping = {
  "Archaeological Sites": "tourism.sights.archaeological_site,tourism.sights.memorial.tomb,tourism.sights.memorial.monument",
  "Temples": "tourism.sights.place_of_worship.temple,religion.place_of_worship.hinduism,religion.place_of_worship.judaism,religion.place_of_worship.sikhism",
  "Coffee Shops": "catering.cafe,catering.restaurant",
  "Hill Stations": "natural.mountain",
  "Beaches": "beach,beach.beach_resort,leisure.park",
  "Wildlife & Safari": "national_park,natural.forest",
  "Adventure Sports": "sport.extreme",
  "Cultural Experiences": "heritage.culture",
  "Weekend Getaways": "tourism.sights,natural.park,natural.mountain.peak",
  "Pilgrimage Spots": "tourism.sights",
  "Foodie Dreams": "catering.restaurant",
  "Trekking Spots": "natural.mountain,camping",
  "Relaxation Spots": "leisure.spa,leisure.resort",
  "Romantic Places": "tourism.sights,leisure.park,leisure.spa",
  "Nature":"natural",
  "Camping":"camping",
  "Sports":"sport,sport.stadium,sport.swimming_pool",
  "Entertainment":"entertainment",
};
const interestColorMapping = {
  "Archaeological Sites": "purple",
  "Temples": "gold",
  "Coffee Shops": "brown",
  "Hill Stations": "green",
  "Beaches": "teal",
  "Wildlife & Safari": "orange",
  "Adventure Sports": "red",
  "Cultural Experiences": "darkblue",
  "Weekend Getaways": "gray",
  "Pilgrimage Spots": "darkgreen",
  "Foodie Dreams": "pink",
  "Trekking Spots": "darkred",
  "Relaxation Spots": "lightblue",
  "Romantic Places": "hotpink",
  "Nature": "forestgreen",
  "Camping": "khaki",
  "Sports": "blue",
  "Entertainment": "violet",
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
      console.error(`Error fetching Wikipedia for ${placeName}:`, error);
      return "No Wikipedia summary available.";
    }
  };

  const addMarkers = useCallback(
    async (places) => {
      if (!map || !markersLayer) return;

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

          if (!lat || !lon || !name) return null;

          const description = await fetchWikipediaSummary(name);
          const placeData = { lat, lon, name, address: address_line1, description };

          const getColorByInterest = (categories) => {
            const interests = userPreferences?.interests || [];
            for (const interest of interests) {
              const mappedCats = categoryMapping[interest]?.split(",") || [];
              if (categories?.some((cat) => mappedCats.includes(cat))) {
                return interestColorMapping[interest] || "blue";
              }
            }
            return "blue";
          };

          const color = getColorByInterest(categories);

          const defaultIcon = L.icon({
            iconUrl: `https://api.geoapify.com/v1/icon/?type=material&color=${color}&size=large&icon=map-marker&apiKey=${MAP_API_KEY}`,
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
            <b>${name}</b><br>
            ${address_line1 || "No Address Available"}<br>
            <i>${categories?.join(", ") || "No category"}</i><br>
            <p>${description}</p>
          `;

          if (existingMarkers.has(name)) {
            const existingMarker = existingMarkers.get(name);
            const isSelected = [...selectedPlaces].some((p) => p.name === name);
            existingMarker.setIcon(isSelected ? selectedIcon : defaultIcon);
            return placeData;
          }

          const marker = L.marker([lat, lon], {
            icon: selectedPlaces.has(name) ? selectedIcon : defaultIcon,
            placeData,
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

              onSelectionChange([...newSet]);
              return newSet;
            });
          });

          return placeData;
        })
      );

      setPlacesList(updatedPlaces.filter(Boolean));
    },
    [map, markersLayer, onSelectionChange, selectedPlaces, userPreferences?.interests] // 👈 FIXED ESLINT WARNING
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
      const filters = [
        `circle:74.8,34.1,400000`,   // Jammu & Kashmir
        `circle:76.0,32.1,250000`,   // Himachal Pradesh
        `circle:77.1,28.6,300000`,   // Delhi
        `circle:76.7,30.7,300000`,   // Punjab
        `circle:76.0,29.0,300000`,   // Haryana
        `circle:78.0,26.5,300000`,   // Uttarakhand
        `circle:80.9,26.8,500000`,   // Uttar Pradesh
        `circle:85.3,23.3,400000`,   // Bihar
        `circle:86.1,23.6,400000`,   // Jharkhand
        `circle:84.0,21.3,400000`,   // Chhattisgarh
        `circle:85.8,20.3,500000`,   // Odisha
        `circle:88.4,22.6,500000`,   // West Bengal
        `circle:91.7,26.1,400000`,   // Assam
        `circle:92.9,23.3,300000`,   // Mizoram / Tripura
        `circle:93.6,25.6,300000`,   // Manipur
        `circle:94.0,27.0,250000`,   // Nagaland
        `circle:94.7,28.2,250000`,   // Arunachal Pradesh
        `circle:91.9,25.6,250000`,   // Meghalaya
        `circle:73.0,26.9,500000`,   // Rajasthan
        `circle:70.7,22.7,500000`,   // Gujarat
        `circle:80.0,23.0,500000`,   // Madhya Pradesh
        `circle:73.8,18.5,500000`,   // Maharashtra
        `circle:77.6,15.5,500000`,   // Karnataka
        `circle:78.4,17.4,500000`,   // Telangana
        `circle:79.7,15.9,400000`,   // Andhra Pradesh
        `circle:78.1,11.0,500000`,   // Tamil Nadu
        `circle:76.2,10.5,500000`,   // Kerala
        `circle:91.1,10.6,200000`,   // Andaman and Nicobar Islands (UT)
        `circle:72.8,19.0,200000`,   // Dadra and Nagar Haveli and Daman and Diu (UT)
        `circle:73.0,15.3,200000`,   // Goa
        `circle:77.4,8.9,200000`,    // Lakshadweep (UT)
        `circle:93.6,11.7,200000`,   // Puducherry (UT)
        `circle:76.7,11.0,200000`,   // Karaikal (UT, part of Puducherry)
        `circle:77.0,13.0,200000`,   // Chandigarh (UT)
        `circle:92.7,20.3,200000`,   // Ladakh (UT)
      ];

      const urls = filters.map(
        (filter) =>
          `${baseUrl}?categories=${selectedCategories}&filter=${filter}&limit=30&apiKey=${MAP_API_KEY}`
      );

      const responses = await Promise.all(urls.map((url) => fetch(url).then((res) => res.json())));
      const allFeatures = responses
        .flatMap((res) => res.features || [])
        .filter((f) => f.properties?.name && f.geometry?.coordinates?.length === 2);

      if (allFeatures.length) {
        addMarkers(allFeatures);
      } else {
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
  
    {/* 🗺️ Themed Legend Box */}
    <div className="map-legend">
      <div className="legend-title">Tour Map Color Guide</div>
      <ul>
        {userPreferences?.interests?.map((interest) => (
          <li key={interest}>
            <span
              className="legend-color"
              style={{ backgroundColor: interestColorMapping[interest] || "blue" }}
            ></span>
            {interest}
          </li>
        ))}
      </ul>
    </div>
  
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
