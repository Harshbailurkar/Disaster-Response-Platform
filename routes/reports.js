const express = require("express");
const router = express.Router();
const supabase = require("../utils/supabaseClient");
const { verifyImage } = require("../services/gemini");

const { setCache, getCache } = require("../utils/cache");

router.post("/:id/reports", async (req, res) => {
  const { user_id, content, image_url } = req.body;
  const disaster_id = req.params.id;

  try {
    // Try cache first
    let verification_status = await getCache(`verify-${image_url}`);
    if (!verification_status) {
      verification_status = await verifyImage(image_url);
      await setCache(`verify-${image_url}`, verification_status);
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([
        { disaster_id, user_id, content, image_url, verification_status },
      ])
      .select();

    if (error) return res.status(400).json({ error });

    global.io.emit("report_submitted", data[0]); // Optional real-time
    res.json({ data });
  } catch (err) {
    console.error("Error submitting report:", err.message);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

// Get all reports for a disaster
router.get("/:id/reports", async (req, res) => {
  const disaster_id = req.params.id;

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("disaster_id", disaster_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json({ data });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from("reports").delete().eq("id", id);
  if (error) return res.status(400).json({ error });
  res.json({ message: "Report deleted", data });
});

module.exports = router;
