const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");

router.get("/nearby", async (req, res) => {
  const { lat, lon } = req.query;
  const { data, error } = await supabase.rpc("get_nearby_resources", {
    lat_input: parseFloat(lat),
    lon_input: parseFloat(lon),
  });

  if (error) return res.status(400).json({ error });
  res.json({ data });
});

module.exports = router;
