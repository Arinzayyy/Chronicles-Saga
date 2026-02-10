export const threads = new Map();

export function ensureThread(threadId, title) {
  if (!threads.has(threadId)) {
    threads.set(threadId, {
      id: threadId,
      title,
      messages: [],
      unread: 0,
      currentNode: null
    });
  }
  return threads.get(threadId);
}

export function addMessageToThread(threadId, msg) {
  const t = threads.get(threadId);
  t.messages.push(msg);
}

export function setThreadNode(threadId, nodeKey) {
  const t = threads.get(threadId);
  t.currentNode = nodeKey;
}

export function markUnread(threadId) {
  const t = threads.get(threadId);
  t.unread += 1;
}

export function clearUnread(threadId) {
  const t = threads.get(threadId);
  t.unread = 0;
}

export function exportThreads() {
  return Array.from(threads.values()).map(t => ({
    id: t.id,
    title: t.title,
    avatar: t.avatar ?? null,
    messages: Array.isArray(t.messages) ? t.messages : [],
    unread: Number(t.unread ?? 0),
    currentNode: t.currentNode ?? null
  }));
}

export function importThreads(threadArray = []) {
  for (const saved of threadArray) {
    const t = ensureThread(saved.id, saved.title);
    t.title = saved.title;
    t.avatar = saved.avatar ?? null;
    t.messages = Array.isArray(saved.messages) ? saved.messages : [];
    t.unread = Number(saved.unread ?? 0);
    t.currentNode = saved.currentNode ?? null;
  }
}
