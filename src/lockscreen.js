
const lockscreen = document.getElementById("lockscreen");
const notification = document.getElementById("notification");

export function showNotification(text, appName = "Unknown") {
  notification.querySelector(".notif-text").innerText = text;
  notification.querySelector(".notif-app").innerText = appName;
  notification.classList.remove("hidden");
}

export function hideLockscreen() {
  lockscreen.style.display = "none";
}

notification.onclick = () => {
  hideLockscreen();
  // main.js will decide what thread/node to open first
  window.dispatchEvent(new CustomEvent("lockscreen:opened"));
};

lockscreen.onclick = () => {
  hideLockscreen();
  window.dispatchEvent(new CustomEvent("lockscreen:opened"));
};


