const express = require("express");
const router = express.Router();
const letterController = require("../controllers/letterController");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorizeAdmin } = require("../middlewares/authMiddleware");

router.post("/", letterController.createLetter);
router.get("/", letterController.getLetters);
router.get("/:id", letterController.getLetterById);
router.put("/:id", letterController.updateLetter);
router.post("/generate-pdf", letterController.generatePDF);
router.post("/", authenticate, letterController.createLetter);
router.post("/", authenticate, templateController.createTemplate);
router.delete("/:id", authenticate, authorizeAdmin, templateController.deleteTemplate);

module.exports = router;
