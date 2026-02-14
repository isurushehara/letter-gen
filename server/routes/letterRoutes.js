const express = require("express");
const router = express.Router();
const letterController = require("../controllers/letterController");

router.post("/", letterController.createLetter);

module.exports = router;
