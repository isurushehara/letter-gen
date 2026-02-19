const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

router.post("/", authenticate, authorizeAdmin, templateController.createTemplate);
router.get("/", templateController.getTemplates);

module.exports = router;
