if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            document.getElementById("updateToast").hidden = false;
          }
        });
      });
    });
  });

  document.getElementById("updateBtn").addEventListener("click", () => {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg && reg.waiting) reg.waiting.postMessage("SKIP_WAITING");
      window.location.reload();
    });
  });
}

const installBtn = document.getElementById("installBtn");
const installStatus = document.getElementById("installStatus");
const iosSteps = document.getElementById("iosSteps");
const genericFallback = document.getElementById("genericFallback");
const offlineBanner = document.getElementById("offlineBanner");

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

function updateConnectionState() {
  offlineBanner.classList.toggle("show", !navigator.onLine);
}
window.addEventListener("online", updateConnectionState);
window.addEventListener("offline", updateConnectionState);
updateConnectionState();

document.getElementById("year").textContent = new Date().getFullYear();
