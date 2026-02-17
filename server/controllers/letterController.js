const prisma = require("../prismaClient");

// CREATE LETTER
exports.createLetter = async (req, res) => {
  try {
    const { title, content, language } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const letter = await prisma.letter.create({
      data: {
        title,
        content,
        language,
        //userId: "TEMP_USER_ID", // temporary until auth added
      },
    });

    res.status(201).json(letter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save letter" });
  }
};

// GET ALL LETTERS
exports.getLetters = async (req, res) => {
  try {
    const letters = await prisma.letter.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(letters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch letters" });
  }
};

// GET SINGLE LETTER
exports.getLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const letter = await prisma.letter.findUnique({
      where: { id },
    });

    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    res.json(letter);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch letter" });
  }
};

// UPDATE LETTER
exports.updateLetter = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updated = await prisma.letter.update({
      where: { id },
      data: { content },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update letter" });
  }
};



