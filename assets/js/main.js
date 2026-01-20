async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status} beim Laden von ${url}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
    el.innerHTML = `<!-- Konnte ${url} nicht laden -->`;
  }
}

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

  // Active Link markieren
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  // Header-Höhe nach Bildladen korrekt setzen
  updateHeaderHeight();
  window.addEventListener("resize", updateHeaderHeight);
  window.addEventListener("load", updateHeaderHeight);
}

async function init() {
  await loadPartial("#siteHeader", "partials/header.html");
  await loadPartial("#siteSidebar", "partials/sidebar.html");
  await loadPartial("#siteFooter", "partials/footer.html");
  wireMenuAndLayout();
}

document.addEventListener("DOMContentLoaded", init);
