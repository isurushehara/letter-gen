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

// DELETE TEMPLATE
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Template id is required" });
    }

    await prisma.template.delete({
      where: { id },
    });

    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Template not found" });
    }

    res.status(500).json({ error: "Failed to delete template" });
  }
};

// UPDATE TEMPLATE
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, tone, audience, language, content } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Template id is required" });
    }

    const template = await prisma.template.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(tone && { tone }),
        ...(audience && { audience }),
        ...(language && { language }),
        ...(content && { content }),
      },
    });

    res.json(template);
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Template not found" });
    }

    res.status(500).json({ error: "Failed to update template" });
  }
};
