import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { ApiError, api } from "../api";
import type { BoardDetails } from "../api";
import KanbanColumn from "../components/KanbanColumn";

export default function Kanban() {
  const { t } = useTranslation();
  const { id } = useParams();
  const boardId = Number(id);
  const invalidId = !Number.isInteger(boardId);

  const [board, setBoard] = useState<BoardDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    if (invalidId) return;

    api
      .getBoard(boardId)
      .then(setBoard)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(t("common.error"));
        }
      })
      .finally(() => setLoading(false));
  }, [boardId, invalidId, t]);

  function reload() {
    api
      .getBoard(boardId)
      .then(setBoard)
      .catch(() => setError(t("common.error")));
  }

  async function handleAddCard(columnId: number, title: string) {
    setError(null);

    try {
      const card = await api.createCard(columnId, title);

      setBoard(
        (current) =>
          current && {
            ...current,
            columns: current.columns.map((column) =>
              column.id === columnId
                ? { ...column, cards: [...column.cards, card] }
                : column,
            ),
          },
      );
    } catch {
      setError(t("common.error"));
    }
  }

  async function handleDeleteCard(cardId: number) {
    setError(null);

    try {
      await api.deleteCard(cardId);

      setBoard(
        (current) =>
          current && {
            ...current,
            columns: current.columns.map((column) => ({
              ...column,
              cards: column.cards.filter((card) => card.id !== cardId),
            })),
          },
      );
    } catch {
      setError(t("common.error"));
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !board) return;

    const cardId = Number(active.id);
    const targetColumnId = Number(over.id);

    const source = board.columns.find((column) =>
      column.cards.some((card) => card.id === cardId),
    );
    const target = board.columns.find((column) => column.id === targetColumnId);
    const card = source?.cards.find((item) => item.id === cardId);

    if (!source || !target || !card || source.id === target.id) return;

    const position =
      target.cards.reduce((max, item) => Math.max(max, item.position), -1) + 1;

    setError(null);
    setBoard({
      ...board,
      columns: board.columns.map((column) => {
        if (column.id === source.id) {
          return {
            ...column,
            cards: column.cards.filter((item) => item.id !== cardId),
          };
        }

        if (column.id === target.id) {
          return {
            ...column,
            cards: [...column.cards, { ...card, columnId: target.id, position }],
          };
        }

        return column;
      }),
    });

    try {
      await api.updateCard(cardId, { columnId: target.id, position });
    } catch {
      setError(t("common.error"));
      reload();
    }
  }

  if (invalidId || notFound) {
    return (
      <main className="page">
        <p>{t("kanban.notFound")}</p>
        <Link to="/boards">{t("common.back")}</Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="page">
        <p>{t("common.loading")}</p>
      </main>
    );
  }

  if (!board) {
    return (
      <main className="page">
        {error && <p className="form-error">{error}</p>}
        <Link to="/boards">{t("common.back")}</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/boards">&larr; {t("common.back")}</Link>
      <h1>{board.title}</h1>

      {error && <p className="form-error">{error}</p>}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {board.columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>
      </DndContext>
    </main>
  );
}