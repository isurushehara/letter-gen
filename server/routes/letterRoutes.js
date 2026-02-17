const express = require("express");
const router = express.Router();
const letterController = require("../controllers/letterController");

router.post("/", letterController.createLetter);
router.get("/", letterController.getLetters);
router.get("/:id", letterController.getLetterById);
router.put("/:id", letterController.updateLetter);
router.post("/generate-pdf", letterController.generatePDF);

module.exports = router;
