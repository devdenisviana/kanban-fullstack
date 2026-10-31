import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

export const cardsRouter = Router();

cardsRouter.use(requireAuth);

const createCardSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  columnId: z.number().int(),
});

const updateCardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  columnId: z.number().int().optional(),
  position: z.number().int().min(0).optional(),
});

cardsRouter.post("/", async (req, res) => {
  const parsed = createCardSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }

  const { title, description, columnId } = parsed.data;

  try {
    const column = await prisma.column.findFirst({
      where: { id: columnId, board: { ownerId: res.locals.userId } },
    });

    if (!column) {
      res.status(404).json({ message: "Column not found" });
      return;
    }

    const position = await prisma.card.count({ where: { columnId } });

    const card = await prisma.card.create({
      data: { title, description, columnId, position },
    });

    res.status(201).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

cardsRouter.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updateCardSchema.safeParse(req.body);

  if (!Number.isInteger(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }

  try {
    const card = await prisma.card.findFirst({
      where: { id, column: { board: { ownerId: res.locals.userId } } },
      include: { column: true },
    });

    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    if (parsed.data.columnId !== undefined) {
      const targetColumn = await prisma.column.findFirst({
        where: { id: parsed.data.columnId, boardId: card.column.boardId },
      });

      if (!targetColumn) {
        res.status(404).json({ message: "Column not found" });
        return;
      }
    }

    const updated = await prisma.card.update({
      where: { id },
      data: parsed.data,
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

cardsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid card id" });
    return;
  }

  try {
    const result = await prisma.card.deleteMany({
      where: { id, column: { board: { ownerId: res.locals.userId } } },
    });

    if (result.count === 0) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});