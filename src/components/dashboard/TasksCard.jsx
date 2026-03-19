import React, { useState } from "react";
import { IconCheck } from "./Icons";
import { IconChevronDown } from "./Icons";
import { myTasks as initialTasks } from "../../data/dashboardMock";

export default function TasksCard() {
  const [tasks, setTasks] = useState(initialTasks);
  const toggle = (id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="card">
      <div className="card__header"><span className="card__title">My Tasks</span><span className="card__link">{tasks.filter((t) => !t.done).length} pending</span></div>
      <div className="card__list">
        {tasks.map((t) => (
          <div key={t.id} className="list-row">
            <div className={`checkbox${t.done ? " checkbox--checked" : ""}`} onClick={() => toggle(t.id)}>
              {t.done && <IconCheck size={12} color="#059669" />}
            </div>
            <span style={{ fontSize: 13, color: t.done ? "#9CA3AF" : "#111827", textDecoration: t.done ? "line-through" : "none", flex: 1 }}>{t.label}</span>
            <IconChevronDown size={12} color="#D1D5DB" />
          </div>
        ))}
      </div>
    </div>
  );
}
