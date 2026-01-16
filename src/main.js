import { addMessage, typingThen, glitchUI, choicesDiv } from "./gui.js";
import { stability, updateStability } from "./state.js";

let scenes = {};

async function loadScenes() {
    const res = await fetch("../public/scenes.json");
    scenes = await res.json();
    showScene("start");
}

function showScene(key) {
    glitchUI(stability);
    const s = scenes[key];

    typingThen(s.text, "them", s.glitch);
    choicesDiv.innerHTML = "";

    if (s.ending) {
        setTimeout(() => ending(s.ending), 1000);
        return;
    }

    s.choices.forEach(c => {
        const btn = document.createElement("div");
        btn.className = "choice";
        btn.innerText = c.text;
        btn.onclick = () => {
            addMessage(c.text, "you");
            updateStability(c.effect);
            showScene(c.next);
        };
        choicesDiv.appendChild(btn);
    });
}

function ending(type) {
    choicesDiv.innerHTML = "";
    const endings = {
        good: "You don’t block the number.\nYou just sit there. And breathe.",
        neutral: "The chat goes quiet.\nYou go on anyway.",
        bad: "You mute the conversation.\nIt still feels loud."
    };
    typingThen(endings[type], "them", true);
}

loadScenes();
