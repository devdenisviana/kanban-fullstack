import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma";
import { authRouter } from "./routes/auth";
import { boardsRouter } from "./routes/boards";
import { cardsRouter } from "./routes/cards";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/boards", boardsRouter);
app.use("/cards", cardsRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Kanban API is running" });
});

app.get("/db-check", async (_req, res) => {
  try {
    const users = await prisma.user.count();
    res.json({ status: "ok", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});