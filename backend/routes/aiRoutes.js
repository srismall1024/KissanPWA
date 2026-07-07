const express = require("express");

const router = express.Router();

const { askGemini } = require("../services/geminiService");

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await askGemini(message);

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "AI Error",
    });
  }
});

module.exports = router;
