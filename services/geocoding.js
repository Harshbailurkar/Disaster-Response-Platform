const axios = require("axios");

exports.getCoordinates = async (locationName) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: locationName,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "Disaster-Response-App",
      },
    }
  );

  const { lat, lon } = response.data[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
};
