const axios = require("axios");

exports.extractLocation = async (description) => {
  const prompt = `Extract the location mentioned in this disaster description: "${description}"`;

  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
    }
  );

  return res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
};

exports.verifyImage = async (imageUrl) => {
  const prompt = `Analyze this image for signs of manipulation or disaster-related content.`;

  try {
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const base64 = Buffer.from(imageResponse.data).toString("base64");

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg", // change to image/png if your image is PNG
                  data: base64,
                },
              },
            ],
          },
        ],
      }
    );

    return res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "pending";
  } catch (err) {
    console.error(
      "Gemini Image Verification Error:",
      err.response?.data || err.message
    );
    return "pending";
  }
};
