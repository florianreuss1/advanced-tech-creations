// Konfiguration importieren
import { SITE } from "./config.js";

// ===== Partials laden =====
async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status} beim Laden von ${url}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    el.innerHTML = `<!-- Fehler beim Laden von ${url} -->`;
  }
}

// ===== Zentrale Konfiguration anwenden =====
function applyConfig() {
  // Mail-Adresse überall einsetzen
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.textContent = SITE.email;
  });

  document.querySelectorAll("[data-email-href]").forEach((el) => {
    el.setAttribute("href", `mailto:${SITE.email}`);
    if (!el.textContent.trim()) {
      el.textContent = SITE.email;
    }
  });

  // eBay-Link optional zentral setzen
  document.querySelectorAll("[data-ebay-href]").forEach((el) => {
    el.setAttribute("href", SITE.ebayUrl);
  });
}

// ===== Menü & Layout =====
function wireMenuAndLayout() {
  const btn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const header = document.querySelector(".header");
  const toolbar = document.querySelector(".toolbar");

  function updateHeaderHeight() {
    let h = 0;
    if (header) h += header.getBoundingClientRect().height;
    if (toolbar) h += toolbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--header-h", Math.ceil(h) + "px");
  }

  function openMenu() {
    if (!sidebar || !overlay || !btn) return;
    sidebar.classList.add("open");
    overlay.classList.add("show");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!sidebar || !overlay || !btn) return;
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    btn.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    if (!sidebar) return;
    sidebar.classList.contains("open") ? closeMenu() : openMenu();
  }

  if (btn && sidebar && overlay) {
    btn.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", closeMenu);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Aktive Seite im Menü markieren
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  // Header-Höhe setzen
  updateHeaderHeight();
  window.addEventListener("resize", updateHeaderHeight);
  window.addEventListener("load", updateHeaderHeight);
}

// ===== Initialisierung =====
async function init() {
  await loadPartial("#siteHeader", "partials/header.html");
  await loadPartial("#siteSidebar", "partials/sidebar.html");
  await loadPartial("#siteFooter", "partials/footer.html");

  applyConfig();
  wireMenuAndLayout();
}

document.addEventListener("DOMContentLoaded", init);
