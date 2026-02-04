// main.js
// Central game controller
// Handles narrative flow, thread state, and screen navigation

import {
  addMessage,
  typingThen,
  choicesDiv,
  showInboxView,
  showChatView,
  backBtn,
  showToast,
  showSettingsView,
  showGalleryView,
  btnRestart
} from "./gui.js"


import { initVars } from "./state.js"
import { threads, clearUnread } from "./thread.js"
import { renderInbox } from "./inbox.js"
import { buildThreadsFromJson, runTrigger, applyChoiceEffects } from "./engine.js"
import { showNotification } from "./lockscreen.js"
import { initHome, showHome } from "./home.js"

console.log("MAIN JS STARTED")
alert("MAIN JS STARTED")

let data = null
let activeThreadId = null
let isUnlocked = false

// Tracks which screen the user is on
// home | inbox | chat
let currentScreen = "home"

// Queue for background incoming messages
const incomingQueue = []

function getActiveThreadId() {
  return activeThreadId
}

// ===== SCREEN HELPERS =====

function openHome() {
  currentScreen = "home"
  showHome()
}

function openInbox() {
  currentScreen = "inbox"
  showInboxView()
  renderInbox()
}

function openSettings() {
  currentScreen = "settings"
  showSettingsView()
}

function openGallery() {
  currentScreen = "gallery"
  showGalleryView()
}


// ===== INCOMING MESSAGE QUEUE =====

function enqueueIncoming(threadId, nodeKey) {
  incomingQueue.push({ threadId, nodeKey })
  processIncomingQueue()
}

function applyEventAction(action) {
  if (action.type === "incoming") enqueueIncoming(action.thread, action.node)
  if (action.type === "trigger") runTrigger(data, action.trigger, context)
}

function processIncomingQueue() {
  while (incomingQueue.length) {
    const item = incomingQueue.shift()
    deliverNode(item.threadId, item.nodeKey)
  }
}

// ===== MESSAGE DELIVERY =====

function deliverNode(threadId, nodeKey) {
  const isActive = threadId === activeThreadId

  const t = threads.get(threadId)
  const node = data.threads[threadId].nodes[nodeKey]

  t.currentNode = nodeKey
  t.messages.push({
    who: "them",
    text: node.text ?? "",
    glitch: !!node.glitch
  })

  // Message for background thread
  if (!isActive) {
    t.unread += 1
    renderInbox()

    if (isUnlocked) {
      const title = data.threads[threadId].title
      const preview = node.text ?? ""
      showToast(`${title}: ${preview}`, () => openThread(threadId))
    }

    return
  }

  typingThen(node.text ?? "", "them", !!node.glitch)
  renderChoices(threadId, nodeKey)
}

// ===== CHOICES =====

function renderChoices(threadId, nodeKey) {
  const node = data.threads[threadId].nodes[nodeKey]
  choicesDiv.innerHTML = ""

  if (!node || !node.choices) return

  node.choices.forEach(choice => {
    const btn = document.createElement("div")
    btn.className = "choice"
    btn.innerText = choice.text

    btn.onclick = () => {
      addMessage(choice.text, "you")

      threads.get(threadId).messages.push({
        who: "you",
        text: choice.text,
        glitch: false
      })

      applyChoiceEffects(choice)

      if (choice.action?.type === "trigger") {
        runTrigger(data, choice.action.trigger, context)
        return
      }

      if (choice.next) {
        deliverNode(threadId, choice.next)
      }
    }

    choicesDiv.appendChild(btn)
  })
}

// ===== THREAD OPEN =====

export function openThread(threadId) {
  currentScreen = "chat"
  activeThreadId = threadId

  const t = threads.get(threadId)
  clearUnread(threadId)
  renderInbox()

  document.getElementById("chat").innerHTML = ""
  choicesDiv.innerHTML = ""

  for (const m of t.messages) {
    addMessage(m.text, m.who, m.glitch)
  }

  showChatView(t.title)

  if (t.currentNode) {
    renderChoices(threadId, t.currentNode)
  } else {
    const startKey = data.threads[threadId].start
    deliverNode(threadId, startKey)
  }
}

// ===== ENGINE CONTEXT =====

const context = {
  getActiveThreadId,
  openThread,
  enqueueIncoming,
  applyEventAction
}

// ===== LOAD =====

async function load() {
  const res = await fetch("./scenes.json")
  if (!res.ok) throw new Error("Failed to load scenes.json")
  data = await res.json()

  const firstThreadId = "murna"
  const firstNodeId = data.threads[firstThreadId].start
  const previewText = data.threads[firstThreadId].nodes[firstNodeId].text
  const title = data.threads[firstThreadId].title

  showNotification(previewText, title)

  initVars(data.vars || {})
  buildThreadsFromJson(data)
  renderInbox()
  initHome()
  openHome()

  if (btnRestart) {
  btnRestart.onclick = () => {
    // simplest reliable "start over"
    window.location.reload()
  }
}


  // Home screen requests opening inbox (tap Chats icon or swipe)
  window.addEventListener("home:open_inbox", () => {
    openInbox()
  })

  // Unlock from notification goes straight to first chat
  window.addEventListener("lockscreen:opened", () => {
    isUnlocked = true
    runTrigger(data, "incoming_unknown_contact", context)
    openThread(firstThreadId)
  })

  // Unlock from swipe goes to home
  window.addEventListener("lockscreen:unlocked_home", () => {
    isUnlocked = true
    openHome()
  })

  window.addEventListener("home:open_settings", () => {
  openSettings()
})

window.addEventListener("home:open_gallery", () => {
  openGallery()
})

}

// ===== BACK BUTTON =====

backBtn.onclick = () => {
  if (currentScreen === "chat") {
    openInbox()
    return
  }

  if (currentScreen === "inbox") {
    openHome()
    return
  }

  if (currentScreen === "settings" || currentScreen === "gallery") {
    openHome()
    return
  }
}

load()


