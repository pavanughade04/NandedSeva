
// ============================================
// NANDEDSEVA — WEBSITE FUNCTIONALITY
// ============================================

"use strict";

const $ = (selector) => document.querySelector(selector);

const searchForm = $("#searchForm");
const searchInput = $("#searchInput");
const listingSearch = $("#listingSearch");
const categoryFilter = $("#categoryFilter");
const areaFilter = $("#areaFilter");
const resetFilters = $("#resetFilters");
const resultsCount = $("#resultsCount");
const businessGrid = $("#businessGrid");
const themeToggle = $("#themeToggle");
const categoryGrid = $("#categoryGrid");
const showAllCategories = $("#showAllCategories");
const businessForm = $("#businessForm");
const formMessage = $("#formMessage");

// Add verified business entries here when you have real details.
// Do not publish unverified names, phone numbers or addresses.
const businesses = [];

// Demo submissions are stored locally as pending entries.
// They are not automatically added to the public directory.
const PENDING_KEY = "nandedseva_pending_submissions";
const THEME_KEY = "nandedseva_theme";

const categoryIcons = {
  "Home Services": "🏠",
  "Electrical": "⚡",
  "Plumbing": "🔧",
  "Education": "📚",
  "Food Services": "🍱",
  "Repairs": "🛠️",
  "Cleaning": "🧹",
  "Other": "✨"
};

const normalize = (value) =>
  String(value ?? "").trim().toLocaleLowerCase("en-IN");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getBusinessText(business) {
  return normalize([
    business.name,
    business.category,
    business.area,
    business.description
  ].join(" "));
}

function getFilteredBusinesses() {
  const query = normalize(listingSearch.value);
  const category = categoryFilter.value;
  const area = normalize(areaFilter.value);

  return businesses.filter((business) => {
    const matchesQuery =
      !query || getBusinessText(business).includes(query);

    const matchesCategory =
      !category || business.category === category;

    const matchesArea =
      !area || normalize(business.area) === area;

    return matchesQuery && matchesCategory && matchesArea;
  });
}

function updateAreaOptions() {
  const previousValue = areaFilter.value;

  const areas = [...new Set(
    businesses
      .map((business) => String(business.area ?? "").trim())
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "en-IN"));

  areaFilter.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "All areas";
  areaFilter.append(allOption);

  areas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaFilter.append(option);
  });

  if (areas.includes(previousValue)) {
    areaFilter.value = previousValue;
  }
}

function makeBusinessCard(business, index) {
  const name = escapeHTML(business.name);
  const category = escapeHTML(business.category);
  const area = escapeHTML(business.area);
  const description = escapeHTML(business.description);
  const icon = categoryIcons[business.category] || "📍";

  const phone = String(business.phone ?? "").replace(/[^\d+]/g, "");
  const phoneDigits = phone.replace(/\D/g, "");

  // Only display contact links when real details are supplied.
  const callLink = phoneDigits
    ? `<a class="call-action" href="tel:${escapeHTML(phone)}">☎ Call</a>`
    : "";

  const rawWhatsApp = String(business.whatsapp || business.phone || "");
  const whatsappDigits = rawWhatsApp.replace(/\D/g, "");
  const whatsappLink = whatsappDigits
    ? `<a href="https://wa.me/${encodeURIComponent(whatsappDigits)}"
        target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>`
    : "";

  const mapQuery = [business.name, business.area, "Nanded", "Maharashtra"]
    .filter(Boolean)
    .join(", ");

  const mapLink = business.area
    ? `<a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(mapQuery)}"
        target="_blank" rel="noopener noreferrer">View map ↗</a>`
    : "";

  return `
    <article class="business-card" style="animation-delay:${Math.min(index, 8) * 45}ms">
      <div class="business-card-top">
        <div class="business-avatar" aria-hidden="true">${icon}</div>
        <div>
          <h3>${name}</h3>
          <span class="business-category">${category}</span>
        </div>
      </div>
      <p class="business-description">${description}</p>
      <div class="business-meta">
        ${area ? `<span>📍 ${area}, Nanded</span>` : ""}
      </div>
      <div class="business-actions">
        ${callLink}
        ${whatsappLink}
        ${mapLink}
      </div>
    </article>
  `;
}

function renderBusinesses() {
  const filtered = getFilteredBusinesses();

  resultsCount.textContent =
    `${filtered.length} ${filtered.length === 1 ? "service" : "services"} found`;

  if (filtered.length === 0) {
    const hasFilters = Boolean(
      listingSearch.value.trim() ||
      categoryFilter.value ||
      areaFilter.value
    );

    businessGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon" aria-hidden="true">
          ${hasFilters ? "🔎" : "🏡"}
        </div>
        <h3>${hasFilters ? "No matching services found" : "Local listings are coming soon"}</h3>
        <p>${
          hasFilters
            ? "Try another search, select a different category, or reset your filters."
            : "There are no published business listings yet. Know a local provider? Submit their details below."
        }</p>
        ${
          hasFilters
            ? '<button class="button button-outline" id="emptyReset" type="button">Reset filters</button>'
            : '<a class="button button-primary" href="#add-business">Add a business →</a>'
        }
      </div>
    `;

    const emptyReset = $("#emptyReset");
    if (emptyReset) emptyReset.addEventListener("click", clearFilters);
    return;
  }

  businessGrid.innerHTML = filtered
    .map((business, index) => makeBusinessCard(business, index))
    .join("");
}

function syncSearchFields(value) {
  searchInput.value = value;
  listingSearch.value = value;
}

function clearFilters() {
  syncSearchFields("");
  categoryFilter.value = "";
  areaFilter.value = "";

  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    card.classList.remove("active");
    card.setAttribute("aria-pressed", "false");
  });

  renderBusinesses();
}

function selectCategory(category) {
  categoryFilter.value =
    categoryFilter.value === category ? "" : category;

  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    const active = card.dataset.category === categoryFilter.value;
    card.classList.toggle("active", active);
    card.setAttribute("aria-pressed", String(active));
  });

  renderBusinesses();

  $("#businesses").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start"
  });
}

// Search form in the hero
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  syncSearchFields(searchInput.value);
  renderBusinesses();

  $("#businesses").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Keep the two search inputs synchronized.
searchInput.addEventListener("input", () => {
  listingSearch.value = searchInput.value;
});

listingSearch.addEventListener("input", () => {
  searchInput.value = listingSearch.value;
  renderBusinesses();
});

// Live filters
categoryFilter.addEventListener("change", () => {
  categoryGrid.querySelectorAll(".category-card").forEach((card) => {
    const active = card.dataset.category === categoryFilter.value;
    card.classList.toggle("active", active);
    card.setAttribute("aria-pressed", String(active));
  });

  renderBusinesses();
});

areaFilter.addEventListener("change", renderBusinesses);

resetFilters.addEventListener("click", clearFilters);

categoryGrid.querySelectorAll(".category-card").forEach((card) => {
  card.setAttribute("aria-pressed", "false");

  card.addEventListener("click", () => {
    selectCategory(card.dataset.category);
  });
});

showAllCategories.addEventListener("click", () => {
  clearFilters();
  $("#categories").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Light / dark theme
function applyTheme(theme) {
  const dark = theme === "dark";

  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.textContent = dark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    dark ? "Switch to light theme" : "Switch to dark theme"
  );
  themeToggle.title = dark ? "Switch to light theme" : "Switch to dark theme";

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.content = dark ? "#111913" : "#f8faf4";
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch (error) {
    // Storage may be unavailable; use the default theme.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

applyTheme(loadTheme());

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);

  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch (error) {
    // Theme still works for the current page.
  }
});

// Business submission form
function readPendingSubmissions() {
  try {
    const saved = localStorage.getItem(PENDING_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

businessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (!businessForm.reportValidity()) return;

  const data = new FormData(businessForm);

  const submission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(data.get("businessName") || "").trim(),
    owner: String(data.get("ownerName") || "").trim(),
    category: String(data.get("category") || "").trim(),
    area: String(data.get("area") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    description: String(data.get("description") || "").trim(),
    whatsapp: String(data.get("whatsapp") || "").trim(),
    status: "pending",
    submittedAt: new Date().toISOString()
  };

  if (
    !submission.name ||
    !submission.owner ||
    !submission.category ||
    !submission.area ||
    !submission.phone ||
    !submission.description
  ) {
    formMessage.textContent = "Please complete all required fields.";
    return;
  }

  try {
    const pending = readPendingSubmissions();
    pending.push(submission);
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));

    businessForm.reset();
    formMessage.textContent =
      "Saved in this browser as a pending demo submission. It has not been sent or published.";
  } catch (error) {
    formMessage.textContent =
      "Could not save this submission in browser storage. Please try again.";
  }
});

// Footer year
$("#currentYear").textContent = new Date().getFullYear();

// Initialise the directory.
// No fabricated business entries are added.
updateAreaOptions();
renderBusinesses();
