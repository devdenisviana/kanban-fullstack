import { useState } from "react";
import type { FormEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import type { Column } from "../api";
import KanbanCard from "./KanbanCard";

type Props = {
  column: Column;
  onAddCard: (columnId: number, title: string) => Promise<void>;
  onDeleteCard: (cardId: number) => void;
};

const DEFAULT_TITLES: Record<string, string> = {
  "A fazer": "kanban.columns.todo",
  "Em andamento": "kanban.columns.doing",
  "Concluído": "kanban.columns.done",
};

export default function KanbanColumn({ column, onAddCard, onDeleteCard }: Props) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [title, setTitle] = useState("");

  const translationKey = DEFAULT_TITLES[column.title];
  const columnTitle = translationKey ? t(translationKey) : column.title;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    await onAddCard(column.id, trimmed);
    setTitle("");
  }

  return (
    <section
      ref={setNodeRef}
      className={isOver ? "kanban-column kanban-column-over" : "kanban-column"}
    >
      <h2>
        {columnTitle} <small>({column.cards.length})</small>
      </h2>

      <div className="kanban-cards">
        {column.cards.length === 0 && (
          <p className="kanban-empty">{t("kanban.emptyColumn")}</p>
        )}

        {column.cards.map((card) => (
          <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="inline-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("kanban.cardTitle")}
          maxLength={200}
        />
        <button type="submit">{t("kanban.add")}</button>
      </form>
    </section>
  );
}