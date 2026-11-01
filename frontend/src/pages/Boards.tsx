import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import type { Board } from "../api";

export default function Boards() {
  const { t } = useTranslation();

  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    api
      .listBoards()
      .then(setBoards)
      .catch(() => setError(t("common.error")))
      .finally(() => setLoading(false));
  }, [t]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setError(null);

    try {
      const board = await api.createBoard(title);
      setBoards((current) => [board, ...current]);
      setTitle("");
    } catch {
      setError(t("common.error"));
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm(t("boards.confirmDelete"))) return;
    setError(null);

    try {
      await api.deleteBoard(id);
      setBoards((current) => current.filter((board) => board.id !== id));
    } catch {
      setError(t("common.error"));
    }
  }

  return (
    <main className="page">
      <h1>{t("boards.title")}</h1>

      <form onSubmit={handleCreate} className="inline-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("boards.boardTitle")}
          maxLength={100}
          required
        />
        <button type="submit">{t("boards.create")}</button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <p>{t("common.loading")}</p>
      ) : boards.length === 0 ? (
        <p>{t("boards.empty")}</p>
      ) : (
        <ul className="board-list">
          {boards.map((board) => (
            <li key={board.id} className="board-item">
              <Link to={`/boards/${board.id}`}>{board.title}</Link>
              <button type="button" onClick={() => handleDelete(board.id)}>
                {t("common.delete")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
