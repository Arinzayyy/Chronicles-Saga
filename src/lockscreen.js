const lockscreen = document.getElementById("lockscreen");
const notification = document.getElementById("notification");
const lockHint = document.querySelector(".lock-hint");

export function showNotification(text, appName = "Unknown") {
  notification.querySelector(".notif-text").innerText = text;
  notification.querySelector(".notif-app").innerText = appName;
  notification.classList.remove("hidden");
}

export function hideLockscreen() {
  lockscreen.classList.add("unlocking");
  // let the CSS animation play, then hide
  setTimeout(() => {
    lockscreen.style.display = "none";
  }, 260);
}

// ✅ ONLY notification unlocks
notification.onclick = (e) => {
  e.stopPropagation();
  hideLockscreen();
  window.dispatchEvent(new CustomEvent("lockscreen:opened"));
};

// ❌ lockscreen click does NOT unlock anymore
// Instead: do a little "nope" feedback animation
lockscreen.addEventListener("click", (e) => {
  // if they clicked notification, notification handler already ran
  if (e.target === notification || notification.contains(e.target)) return;

  lockscreen.classList.remove("nope");
  // reflow so animation can retrigger
  void lockscreen.offsetWidth;
  lockscreen.classList.add("nope");
});

// Optional: fake "swipe up" animation on the hint (visual only)
if (lockHint) {
  lockHint.classList.add("swipe-anim");
}



