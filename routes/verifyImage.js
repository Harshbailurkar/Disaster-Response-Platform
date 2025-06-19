const express = require("express");
const router = express.Router();
const { verifyImage } = require("../services/gemini");

router.post("/:id/verify-image", async (req, res) => {
  const { imageUrl } = req.body;
  try {
    const result = await verifyImage(imageUrl);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
