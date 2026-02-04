import { inbox } from "./gui.js";
import { threads } from "./thread.js";
import { openThread } from "./main.js";

function initials(name = "") {
  const s = String(name).trim();
  if (!s) return "?";
  const parts = s.split(/\s+/);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (a + b).toUpperCase();
}

function timeLabel() {
  // simple placeholder "now", you can upgrade to per-message timestamps later
  return "now";
}

export function renderInbox() {
  inbox.innerHTML = "";

  for (const t of threads.values()) {
    const row = document.createElement("div");
    row.className = "inbox-row";

    const last = t.messages && t.messages.length ? t.messages[t.messages.length - 1].text : "";
    const preview = (last || "").replace(/\s+/g, " ").slice(0, 60);

    const unreadHTML = t.unread
      ? `<span class="unread-pill">${t.unread}</span>`
      : "";

    row.innerHTML = `
      <div class="inbox-avatar">
        ${
          t.avatar
            ? `<img src="${t.avatar}" class="avatar-img" />`
            : initials(t.title)
        }
      </div>

      <div class="inbox-main">
        <div class="inbox-title">${t.title}</div>
        <div class="inbox-preview">${preview}</div>
      </div>

      <div class="inbox-meta">
        <div class="inbox-time">${timeLabel()}</div>
        ${unreadHTML}
      </div>
    `;

    row.onclick = () => openThread(t.id);
    inbox.appendChild(row);
  }
}
