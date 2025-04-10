const express = require("express");
const Visit = require("../models/Visit");

const router = express.Router();

router.post("/track", async (req, res) => {
  const { page = "home" } = req.body;

  try {
    const visit = await Visit.findOneAndUpdate(
      { page },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ count: visit.count });
  } catch (error) {
    console.error("Error tracking visit:", error);
    res.status(500).json({ message: "Error tracking visit" });
  }
});

module.exports = router;
