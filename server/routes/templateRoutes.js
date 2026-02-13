const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

router.post("/", templateController.createTemplate);
router.get("/", templateController.getTemplates);

module.exports = router;
