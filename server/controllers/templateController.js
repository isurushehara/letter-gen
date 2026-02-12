const prisma = require("../prismaClient");

// CREATE TEMPLATE
exports.createTemplate = async (req, res) => {
  try {
    const { title, category, tone, audience, language, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const template = await prisma.template.create({
      data: {
        title,
        category,
        tone,
        audience,
        language,
        content,
      },
    });

    res.status(201).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// GET ALL TEMPLATES
exports.getTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
