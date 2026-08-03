// ---------- Service worker: register, cache app shell, handle auto-update ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").then((reg) => {
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
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

// ---------- Install experience ----------
const installCard = document.getElementById("installCard");
const installBtn = document.getElementById("installBtn");
const installStatus = document.getElementById("installStatus");
const iosSteps = document.getElementById("iosSteps");
const genericFallback = document.getElementById("genericFallback");

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;

let deferredPrompt = null;

if (isStandalone) {
  // Already installed and running full-screen — nothing to sell here
  installStatus.hidden = false;
} else if (isIOS) {
  // Safari never fires beforeinstallprompt — show manual steps instead
  iosSteps.hidden = false;
} else {
  // Chrome/Edge/Android: wait for the browser to confirm installability
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
  if (outcome === "accepted") {
    installStatus.hidden = false;
  } else {
    genericFallback.hidden = false;
  }
});

window.addEventListener("appinstalled", () => {
  installBtn.hidden = true;
  genericFallback.hidden = true;
  iosSteps.hidden = true;
  installStatus.hidden = false;
});

// ---------- Offline indicator ----------
const offlineBanner = document.getElementById("offlineBanner");
const connPill = document.getElementById("connPill");

function updateConnectionState() {
  const online = navigator.onLine;
  offlineBanner.classList.toggle("show", !online);
  connPill.classList.toggle("offline", !online);
  connPill.lastChild.textContent = online ? "Live" : "Offline";
}
window.addEventListener("online", updateConnectionState);
window.addEventListener("offline", updateConnectionState);
updateConnectionState();

// ---------- Logout ----------
document.getElementById("logoutBtn").addEventListener("click", () => {
  ColdCoreAuth.logout();
});

// ---------- Clock ----------
function tickClock() {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString();
}
tickClock();
setInterval(tickClock, 1000);

// ---------- Dummy live data (representative of the full monitoring build) ----------
const compressorNames = ["Compressor 1", "Compressor 2", "Compressor 3"];
const compressorsEl = document.getElementById("compressors");
compressorsEl.innerHTML = compressorNames
  .map(
    (name, i) => `
    <div class="comp-card">
      <div class="comp-top">
        <span class="comp-name">${name}</span>
        <span class="comp-dot" id="compDot${i}"></span>
      </div>
      <div class="comp-row"><span>Day runtime</span><span id="compDay${i}">--</span></div>
      <div class="comp-row"><span>Month runtime</span><span id="compMonth${i}">--</span></div>
    </div>`
  )
  .join("");

function rand(min, max) { return Math.random() * (max - min) + min; }

function updateGauge(prefix, value, min, max) {
  const pct = (value - min) / (max - min);
  const angle = -90 + pct * 180; // -90deg (min) to +90deg (max)
  document.getElementById(prefix + "Needle").style.transform = `rotate(${angle}deg)`;
  document.getElementById(prefix + "Value").innerHTML = `${value.toFixed(0)} <small>psi</small>`;
}

let alarmActive = false;

function tickData() {
  updateGauge("suction", rand(28, 42), 0, 60);
  updateGauge("discharge", rand(180, 220), 100, 260);

  compressorNames.forEach((_, i) => {
    const running = Math.random() > 0.2;
    document.getElementById(`compDot${i}`).classList.toggle("run", running);
    document.getElementById(`compDay${i}`).textContent = `${rand(1, 9).toFixed(1)} h`;
    document.getElementById(`compMonth${i}`).textContent = `${rand(80, 480).toFixed(0)} h`;
  });

  // occasional alarm blip, just to show the lamp animate
  alarmActive = Math.random() > 0.92;
  document.getElementById("alarmRed").classList.toggle("active", alarmActive);
  document.getElementById("alarmText").textContent = alarmActive ? "Discharge pressure high" : "Normal";
}
tickData();
setInterval(tickData, 4000);
