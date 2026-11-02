import { useDraggable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import type { Card } from "../api";

type Props = {
  card: Card;
  onDelete: (id: number) => void;
};

export default function KanbanCard({ card, onDelete }: Props) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: card.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.6 : 1,
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="kanban-card"
      {...listeners}
      {...attributes}
    >
      <strong>{card.title}</strong>
      {card.description && <p>{card.description}</p>}

      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onDelete(card.id)}
      >
        {t("common.delete")}
      </button>
    </div>
  );
}