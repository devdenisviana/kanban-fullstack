import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma";
import { requireAuth } from "../middleware/auth";

export const boardsRouter = Router();

boardsRouter.use(requireAuth);

const createBoardSchema = z.object({
  title: z.string().min(1).max(100),
});

boardsRouter.get("/", async (_req, res) => {
  try {
    const boards = await prisma.board.findMany({
      where: { ownerId: res.locals.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

boardsRouter.post("/", async (req, res) => {
  const parsed = createBoardSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid data" });
    return;
  }

  try {
    const board = await prisma.board.create({
      data: {
        title: parsed.data.title,
        ownerId: res.locals.userId,
        columns: {
          create: [
            { title: "A fazer", position: 0 },
            { title: "Em andamento", position: 1 },
            { title: "Concluído", position: 2 },
          ],
        },
      },
      include: { columns: { orderBy: { position: "asc" } } },
    });

    res.status(201).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

boardsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid board id" });
    return;
  }

  try {
    const board = await prisma.board.findFirst({
      where: { id, ownerId: res.locals.userId },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: { cards: { orderBy: { position: "asc" } } },
        },
      },
    });

    if (!board) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

boardsRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ message: "Invalid board id" });
    return;
  }

  try {
    const result = await prisma.board.deleteMany({
      where: { id, ownerId: res.locals.userId },
    });

    if (result.count === 0) {
      res.status(404).json({ message: "Board not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});