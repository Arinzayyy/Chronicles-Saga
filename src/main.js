import { addMessage, typingThen, choicesDiv, showInboxView, showChatView, backBtn } from "./gui.js";
import { initVars } from "./state.js";
import { threads, clearUnread } from "./threads.js";
import { renderInbox } from "./inbox.js";
import { buildThreadsFromJson, runTrigger, applyChoiceEffects } from "./engine.js";
import { showNotification } from "./lockscreen.js";

let data = null;
let activeThreadId = null;

// queue to support incoming messages landing in background threads
const incomingQueue = [];

function getActiveThreadId() {
  return activeThreadId;
}

function enqueueIncoming(threadId, nodeKey) {
  incomingQueue.push({ threadId, nodeKey });
  processIncomingQueue();
}

function applyEventAction(action) {
  if (action.type === "incoming") enqueueIncoming(action.thread, action.node);
  if (action.type === "trigger") runTrigger(data, action.trigger, context);
}

function processIncomingQueue() {
  // deliver immediately, but mark unread if not active
  while (incomingQueue.length) {
    const item = incomingQueue.shift();
    deliverNode(item.threadId, item.nodeKey);
  }
}

function deliverNode(threadId, nodeKey) {
  const isActive = threadId === activeThreadId;

  // store to history always
  const t = threads.get(threadId);
  const node = data.threads[threadId].nodes[nodeKey];
  t.currentNode = nodeKey;
  t.messages.push({ who: "them", text: node.text ?? "", glitch: !!node.glitch });

  if (!isActive) {
    t.unread += 1;
    renderInbox();
    // optional: also show notification if lockscreen is hidden
    // showNotification(`${data.threads[threadId].title}: ${node.text ?? ""}`);
    return;
  }

  typingThen(node.text ?? "", "them", !!node.glitch);
  renderChoices(threadId, nodeKey);
}

function renderChoices(threadId, nodeKey) {
  const node = data.threads[threadId].nodes[nodeKey];
  choicesDiv.innerHTML = "";

  if (!node || !node.choices) return;

  node.choices.forEach(choice => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.innerText = choice.text;

    btn.onclick = () => {
      addMessage(choice.text, "you");

      // persist to history too
      threads.get(threadId).messages.push({ who: "you", text: choice.text, glitch: false });

      applyChoiceEffects(choice);

      // triggers or next nodes
      if (choice.action?.type === "trigger") {
        runTrigger(data, choice.action.trigger, context);
        return;
      }
      if (choice.next) {
        deliverNode(threadId, choice.next);
      }
    };

    choicesDiv.appendChild(btn);
  });
}

export function openThread(threadId) {
  activeThreadId = threadId;

  const t = threads.get(threadId);
  clearUnread(threadId);
  renderInbox();

  // clear UI chat
  document.getElementById("chat").innerHTML = "";
  choicesDiv.innerHTML = "";

  // replay history
  for (const m of t.messages) addMessage(m.text, m.who, m.glitch);

  showChatView(t.title);

  // show choices for current node
  if (t.currentNode) renderChoices(threadId, t.currentNode);
  else {
    // start thread if never started
    const startKey = data.threads[threadId].start;
    deliverNode(threadId, startKey);
  }
}

// Context passed into engine trigger runner
const context = {
  getActiveThreadId,
  openThread,
  enqueueIncoming,
  applyEventAction
};

async function load() {
  const res = await fetch("./scenes.json");
  data = await res.json();

  // STEP 4: show the first lockscreen notification
  const firstThreadId = "murna";
  const firstNodeId = data.threads[firstThreadId].start;
  const previewText = data.threads[firstThreadId].nodes[firstNodeId].text;
  const title = data.threads[firstThreadId].title;

  showNotification(previewText, title);

  initVars(data.vars || {});
  buildThreadsFromJson(data);
  renderInbox();
  showInboxView();

  window.addEventListener("lockscreen:opened", () => {
    runTrigger(data, "incoming_unknown_contact", context);
    openThread(firstThreadId);
  });
}

backBtn.onclick = () => {
  showInboxView();
  renderInbox();
};

load();
