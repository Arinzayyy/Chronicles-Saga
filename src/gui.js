export const chat = document.getElementById("chat");
export const typing = document.getElementById("typing");
export const choicesDiv = document.getElementById("choices");
export const phone = document.getElementById("phone");

export function addMessage(text, who = "them", glitch = false) {
    const msg = document.createElement("div");
    msg.className = `message ${who}`;
    if (glitch) msg.classList.add("glitch");
    msg.innerText = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

export function typingThen(text, who, glitch = false) {
    typing.innerText = "typing…";
    setTimeout(() => {
        typing.innerText = "";
        addMessage(text, who, glitch);
    }, 800 + Math.random() * 600);
}

export function glitchUI(stability) {
    if (stability < 30) phone.classList.add("glitch");
}
