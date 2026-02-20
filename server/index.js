// 1️⃣ Import core dependencies
const express = require("express");
const cors = require("cors");

// 2️⃣ Import local modules
const prisma = require("./prismaClient");
const authRoutes = require("./routes/authRoutes");
const templateRoutes = require("./routes/templateRoutes");
const letterRoutes = require("./routes/letterRoutes");

// 3️⃣ Initialize Express app
const app = express();

// 4️⃣ Apply global middlewares
app.use(cors());
app.use(express.json());

// 5️⃣ Base route (health check)
app.get("/", (req, res) => {
  res.send("Letter Generator API is running 🚀");
});

// 6️⃣ Test database connection route
app.get("/test-db", async (req, res) => {
  const templates = await prisma.template.findMany();
  res.json(templates);
});

// 7️⃣ API routes
app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/letters", letterRoutes);

// 8️⃣ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
