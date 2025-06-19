const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");
const { getCoordinates } = require("../services/geocoding"); // 👈 import
// Nominatim
const { extractLocation } = require("../services/gemini");

router.post("/", async (req, res) => {
  const { title, location_name, description, tags, owner_id } = req.body;

  try {
    // 👇 Get lat/lon from location_name using Nominatim

    let finalLocationName = location_name;
    console.log("Location name:", finalLocationName);

    if (!location_name || location_name.trim() === "") {
      console.log("No location name provided, extracting from description...");
      finalLocationName = await extractLocation(description); // 🧠 Use Gemini
    }
    console.log("Final location name:", finalLocationName);
    const { lat, lon } = await getCoordinates(finalLocationName);
    console.log(lat, lon);
    const { data, error } = await supabase
      .from("disasters")
      .insert([
        {
          title,
          location_name,
          description,
          tags,
          owner_id,
          location: `SRID=4326;POINT(${lon} ${lat})`,
        },
      ])
      .select(); // forces return of inserted row

    if (error) return res.status(400).json({ error });

    if (!data || data.length === 0) {
      return res
        .status(500)
        .json({ error: "Insert failed. No data returned." });
    }

    global.io.emit("disaster_added", data[0]);
    res.json({ data: data[0] });
  } catch (err) {
    console.error("Error adding disaster:", err.message);
    res.status(500).json({ error: "Failed to add disaster" });
  }
});

router.get("/", async (req, res) => {
  const { tag } = req.query;

  let query = supabase.from("disasters").select("*");

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;

  if (error) return res.status(400).json({ error });

  res.json({ data });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, location_name, description, tags } = req.body;

  try {
    const updateData = {
      ...(title && { title }),
      ...(location_name && { location_name }),
      ...(description && { description }),
      ...(tags && { tags }),
    };

    const { data, error } = await supabase
      .from("disasters")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error });
    if (!data || data.length === 0)
      return res.status(404).json({ error: "Disaster not found" });

    global.io.emit("disaster_updated", data[0]);
    res.json({ data: data[0] });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Deleting disaster with ID:", id);
  try {
    const { data, error } = await supabase
      .from("disasters")
      .delete()
      .eq("id", id)
      .select();

    console.log("Delete result:", data, error);

    if (error) return res.status(400).json({ error });
    if (!data || data.length === 0)
      return res.status(404).json({ error: "Disaster not found" });

    global.io.emit("disaster_updated", { id, deleted: true });
    res.json({ message: "Disaster deleted", id });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
