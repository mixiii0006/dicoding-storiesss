import "../styles/styles.css";
import "leaflet/dist/leaflet.css";
import App from "./pages/app";
import CONFIG from "./config.js";

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  const installButton = document.createElement("button");
  installButton.textContent = "Install App";
  installButton.style.position = "fixed";
  installButton.style.bottom = "20px";
  installButton.style.right = "20px";
  installButton.style.padding = "10px 20px";
  installButton.style.backgroundColor = "#2a9d8f";
  installButton.style.color = "#fff";
  installButton.style.border = "none";
  installButton.style.borderRadius = "5px";
  installButton.style.cursor = "pointer";
  installButton.style.zIndex = "10000";

  installButton.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
      installButton.remove();
    }
  });

  document.body.appendChild(installButton);
});

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js");
      console.log("Service Worker registered with scope:", registration.scope);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  } else {
    console.warn("Service Workers are not supported in this browser.");
  }
  return null;
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return false;
  }
  const permission = await Notification.requestPermission();
  return permission === "granted";
}

async function subscribeUserToPush(registration) {
  const vapidPublicKey = CONFIG.VAPID_PUBLIC_KEY || "";

  if (!vapidPublicKey) {
    console.error("VAPID public key is missing or empty.");
    return null;
  }

  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
    console.log("User is subscribed to push notifications.");
    return subscription;
  } catch (error) {
    console.error("Failed to subscribe the user: ", error);
    return null;
  }
}

function urlBase64ToUint8Array(base64String) {
  if (!base64String || base64String.length === 0) {
    throw new Error("Invalid base64 string");
  }
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  const registration = await registerServiceWorker();
  if (registration) {
    const permissionGranted = await requestNotificationPermission();
    if (permissionGranted) {
      const subscription = await subscribeUserToPush(registration);
      if (subscription) {
        // TODO: Send subscription to backend API to register for push notifications
        console.log("Push subscription object:", subscription);
      }
    }
  }
});
