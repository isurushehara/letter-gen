const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Letter Generator API is running 🚀");
});

const prisma = require("./prismaClient");

app.get("/test-db", async (req, res) => {
  const templates = await prisma.template.findMany();
  res.json(templates);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
