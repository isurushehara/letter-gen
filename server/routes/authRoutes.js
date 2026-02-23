const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate, authorizeAdmin } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);

// Self profile routes (any authenticated user)
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);

// Admin user management routes
router.get("/users", authenticate, authorizeAdmin, authController.getAllUsers);
router.get("/users/search", authenticate, authorizeAdmin, authController.searchUsers);
router.put("/users/:id", authenticate, authorizeAdmin, authController.updateUser);
router.delete("/users/:id", authenticate, authorizeAdmin, authController.deleteUser);

module.exports = router;
