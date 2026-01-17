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
