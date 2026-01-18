import { inbox } from "./gui.js";
import { threads } from "./thread.js";
import { openThread } from "./main.js";

export function renderInbox() {
  inbox.innerHTML = "";

  for (const t of threads.values()) {
    const row = document.createElement("div");
    row.className = "inbox-row";

    const unreadHTML = t.unread
      ? `<span class="unread-pill">${t.unread}</span>`
      : "";

    row.innerHTML = `
      <div class="inbox-title">${t.title}</div>
      <div class="inbox-meta">${unreadHTML}</div>
    `;

    row.onclick = () => openThread(t.id);
    inbox.appendChild(row);
  }
}