const prisma = require("../prismaClient");
const PDFDocument = require("pdfkit");

// CREATE LETTER
exports.createLetter = async (req, res) => {
  try {
    const { title, content, language, templateId, inputValues } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const letter = await prisma.letter.create({
      data: {
        title,
        content,
        language,
        templateId: templateId || null,
        inputValues: inputValues || null,
        userId: req.user.id,
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
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        template: {
          select: { category: true, title: true },
        },
      },
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

    if (letter.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
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
    const { content, inputValues } = req.body;

    const existingLetter = await prisma.letter.findUnique({
      where: { id },
    });

    if (!existingLetter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    if (existingLetter.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updated = await prisma.letter.update({
      where: { id },
      data: {
        content,
        ...(inputValues && { inputValues }),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update letter" });
  }
};

// DELETE LETTER
exports.deleteLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLetter = await prisma.letter.findUnique({
      where: { id },
    });

    if (!existingLetter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    if (existingLetter.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.letter.delete({
      where: { id },
    });

    res.json({ message: "Letter deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete letter" });
  }
};

// GENERATE PDF
exports.generatePDF = async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${title || "letter"}.pdf"`
    );

    doc.pipe(res);

    doc.font("Times-Roman")
      .fontSize(12)
      .text(content.replace(/<[^>]*>/g, ""), {
        align: "left",
      });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};