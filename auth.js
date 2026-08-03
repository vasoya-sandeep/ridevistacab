// Dummy authentication for demo purposes only — no real backend.
// Swap ColdCoreAuth.attemptLogin() for a real API call when this becomes production.
const ColdCoreAuth = (() => {
  const DEMO_USER = "admin";
  const DEMO_PASS = "admin123";
  const KEY = "coldcore_auth";

  function isAuthenticated() {
    return localStorage.getItem(KEY) === "true" || sessionStorage.getItem(KEY) === "true";
  }

  function attemptLogin(username, password, remember) {
    if (username === DEMO_USER && password === DEMO_PASS) {
      if (remember) {
        localStorage.setItem(KEY, "true");
      } else {
        sessionStorage.setItem(KEY, "true");
      }
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    window.location.href = "login.html";
  }

  return { isAuthenticated, attemptLogin, logout };
})();
