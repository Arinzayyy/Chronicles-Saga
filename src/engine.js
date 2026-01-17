import { applyEffects, checkCondition } from "./state.js";
import { ensureThread, addMessageToThread, setThreadNode, markUnread } from "./threads.js";
import { renderInbox } from "./inbox.js";
import { showNotification } from "./lockscreen.js";

export function buildThreadsFromJson(data) {
  for (const [id, t] of Object.entries(data.threads)) {
    ensureThread(id, t.title);
  }
}

export function deliverIncoming(data, threadId, nodeKey, isActiveThread) {
  const tDef = data.threads[threadId];
  const node = tDef.nodes[nodeKey];

  // persist node pointer
  setThreadNode(threadId, nodeKey);

  // store message into thread history (as "them")
  addMessageToThread(threadId, { who: "them", text: node.text ?? "", glitch: !!node.glitch });

  if (!isActiveThread) {
    markUnread(threadId);
    renderInbox();
    showNotification(`${tDef.title}: ${node.text ?? ""}`);
  }
}

export function runTrigger(data, triggerId, context) {
  // context: { getActiveThreadId, openThread, showNode, deliverNodeToActive }
  const evt = (data.events || []).find(e => e.id === triggerId);
  if (!evt) return;

  if (evt.type === "incoming") {
    context.enqueueIncoming(evt.thread, evt.node);
    return;
  }

  if (evt.type === "branch") {
    for (const b of evt.branches) {
      if (b.else) {
        for (const action of b.do) context.applyEventAction(action);
        return;
      }
      if (b.if && checkCondition(b.if)) {
        for (const action of b.do) context.applyEventAction(action);
        return;
      }
    }
  }

  if (evt.type === "system" && Array.isArray(evt.do)) {
    for (const action of evt.do) context.applyEventAction(action);
  }
}

export function applyChoiceEffects(choice) {
  applyEffects(choice.effects || choice.effect || {});
}
