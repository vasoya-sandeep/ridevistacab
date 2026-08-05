if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");

menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const installBtn = document.getElementById("installBtn");
const installStatus = document.getElementById("installStatus");
const iosSteps = document.getElementById("iosSteps");
const genericFallback = document.getElementById("genericFallback");

const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
let deferredPrompt = null;

if (isStandalone) {
  installStatus.hidden = false;
} else if (isIOS) {
  iosSteps.hidden = false;
} else {
  genericFallback.hidden = false;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  genericFallback.hidden = true;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
  if (outcome === "accepted") installStatus.hidden = false;
  else genericFallback.hidden = false;
});

window.addEventListener("appinstalled", () => {
  installBtn.hidden = true;
  genericFallback.hidden = true;
  iosSteps.hidden = true;
  installStatus.hidden = false;
});

document.getElementById("year").textContent = new Date().getFullYear();
