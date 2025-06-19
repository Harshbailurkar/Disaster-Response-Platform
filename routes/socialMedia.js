const express = require("express");
const router = express.Router();
const { getCache, setCache } = require("../utils/cache");

// Mock Twitter-like data
const mockSocialPosts = [
  {
    user: "citizen1",
    post: "#floodrelief Need water in Brooklyn",
    timestamp: "2025-06-18T10:30:00Z",
  },
  {
    user: "reliefBot",
    post: "Shelter available in Queens #disasterhelp",
    timestamp: "2025-06-18T11:00:00Z",
  },
  {
    user: "rescueNY",
    post: "URGENT: Medical help needed in Lower East Side",
    timestamp: "2025-06-18T11:15:00Z",
  },
];

// GET /disasters/:id/social-media
router.get("/:id/social-media", async (req, res) => {
  const { id } = req.params;
  const cached = await getCache("social-123");
  if (cached) return res.json({ posts: cached });

  try {
    // Simulate delay and then emit new social media data
    const simulatedData = mockSocialPosts.map((post) => ({
      ...post,
      disaster_id: id,
    }));

    // Emit WebSocket event
    global.io.emit("social_media_updated", {
      disaster_id: id,
      posts: simulatedData,
    });
    await setCache("social-123", simulatedData);
    res.json({ data: simulatedData });
  } catch (error) {
    console.error("Mock Twitter API error:", error.message);
    res.status(500).json({ error: "Failed to fetch social media data" });
  }
});

module.exports = router;
