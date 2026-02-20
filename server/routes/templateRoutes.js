const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

router.post("/", authenticate, authorizeAdmin, templateController.createTemplate);
router.get("/", templateController.getTemplates);
router.put("/:id", authenticate, authorizeAdmin, templateController.updateTemplate);
router.delete("/:id", authenticate, authorizeAdmin, templateController.deleteTemplate);

module.exports = router;
