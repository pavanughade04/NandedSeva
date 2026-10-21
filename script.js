("use strict");

const $ = (selector) => document.querySelector(selector);
const businesses = [
  {
    name: "PS Electrical & Engineers",
    category: "Electrical",
    area: "Waman Nagar",
    address: "Taroda Kh., Dhanvantri Colony, Waman Nagar, Nanded, Maharashtra 431605",
    phone: "+919130007955",
    rating: 5.0,
    reviews: 116,
    description: "Electrical services and contracting. Contact the provider to confirm the exact service you need.",
    icon: "⚡",
    mapQuery: "PS Electrical & engineers Waman Nagar Nanded"
  },
  {
    name: "SP Electrical",
    category: "Electrical",
    area: "Bhagya Nagar",
    address: "Geeta Nagar, Bhagya Nagar, Anand Nagar, Nanded, Maharashtra 431605",
    phone: "+919175957795",
    rating: 4.9,
    reviews: 49,
    description: "Local electrician listing. Confirm availability, pricing and service coverage directly.",
    icon: "⚡",
    mapQuery: "SP Electrical Geeta Nagar Nanded"
  },
  {
    name: "Kesari Laptop Care",
    category: "Computer & Mobile",
    area: "Vazirabad",
    address: "Yashodeep Malpani Building, 3-1-33, Collector Office Road, Shivaji Putala, Vazirabad, Nanded 431601",
    phone: "+919028106171",
    rating: 4.9,
    reviews: 616,
    description: "Computer and laptop sales/service listing. Call to confirm repair options and current timings.",
    icon: "💻",
    mapQuery: "Kesari Laptop Care Vazirabad Nanded"
  },
  {
    name: "M TECH Computers",
    category: "Computer & Mobile",
    area: "Anand Nagar",
    address: "Sai Bhawan, Anand Nagar Road, Vasant Nagar, Hyder Bagh, Nanded, Maharashtra 431602",
    phone: "+919545434318",
    rating: 5.0,
    reviews: 80,
    description: "Computer sales and repair listing. Confirm parts, pricing and availability before visiting.",
    icon: "🖥️",
    mapQuery: "M TECH Computers Anand Nagar Nanded"
  },
  {
    name: "Arman Mobile & Computer Services",
    category: "Computer & Mobile",
    area: "Khoja Colony",
    address: "Khoja Colony, Sai Nagar, Mafco Khoja Colony Road, Itwara Bazar Road, Nanded 431604",
    phone: "+919405383786",
    rating: 5.0,
    reviews: 208,
    description: "Mobile and computer repair listing in the Itwara area. Contact the shop to confirm repair details.",
    icon: "📱",
    mapQuery: "Arman Mobile Computer Services Khoja Colony Nanded"
  },
  {
    name: "Orion Computers",
    category: "Computer & Mobile",
    area: "Shivaji Nagar",
    address: "Mahatma Phule Market, Shop 38, ITI Road, near Chandu Kaka Saraf Jewels, Shivaji Nagar, Nanded 431602",
    phone: "+919823125503",
    rating: 4.8,
    reviews: 471,
    description: "Computer shop and service listing. Check the map listing or call for current details.",
    icon: "💻",
    mapQuery: "Orion Computers ITI Road Nanded"
  },
  {
    name: "Balaji Computers",
    category: "Computer & Mobile",
    area: "Vishnu Nagar",
    address: "Shop A-13, ITI Corner, Vishnu Complex, Visavanagar Colony, Vishnu Nagar, Nanded 431602",
    phone: "+918484925321",
    rating: 5.0,
    reviews: 44,
    description: "Computer and printer service listing. Confirm services and opening hours before visiting.",
    icon: "🖨️",
    mapQuery: "Balaji Computers Vishnu Complex Nanded"
  },
  {
    name: "Shiva's Skyline Computers",
    category: "Computer & Mobile",
    area: "Anand Nagar",
    address: "Jijau Nagar Road, near Rama Furniture, Geeta Nagar, Anand Nagar, Nanded 431605",
    phone: "+919890798136",
    rating: 4.8,
    reviews: 96,
    description: "Computer sales, service and networking listing. Contact the provider for current offerings.",
    icon: "🖥️",
    mapQuery: "Shiva Skyline Computers Anand Nagar Nanded"
  },
  {
    name: "Nucleus Computers",
    category: "Computer & Mobile",
    area: "Vasant Nagar",
    address: "Opposite Post Office, Vasant Nagar, Hyder Bagh, Dashmesh Nagar, Nanded 431602",
    phone: "+919021094013",
    rating: 5.0,
    reviews: 937,
    description: "Computer retail listing. Confirm current stock, repairs and opening hours directly.",
    icon: "💻",
    mapQuery: "Nucleus Computers Vasant Nagar Nanded"
  },
  {
    name: "Guru Bramha Pure Veg Restaurant",
    category: "Restaurants",
    area: "Vazirabad",
    address: "Near Chhatrapati Shivaji Maharaj Statue, Railway Station Road, Shivaji Putala, Vazirabad, Nanded 431601",
    phone: "+918484886681",
    rating: 4.8,
    reviews: 5785,
    description: "Vegetarian restaurant listing near Railway Station Road. Confirm current menu and timings directly.",
    icon: "🍽️",
    mapQuery: "Guru Bramha Pure Veg Restaurant Nanded"
  },
  {
    name: "Aamantran Garden Restaurant",
    category: "Restaurants",
    area: "Dhanvantri Colony",
    address: "Chhatrapati Chowk to More Chowk Road, Gopal Krishna Nagar, Dhanvantri Colony, Nanded 431605",
    phone: "+919373456899",
    rating: 4.6,
    reviews: 1070,
    description: "Restaurant listing near Chhatrapati Chowk. Call to verify today's opening hours and menu.",
    icon: "🍴",
    mapQuery: "Aamantran Garden Restaurant Nanded"
  },
  {
    name: "Kailash Parbat",
    category: "Restaurants",
    area: "Kabra Nagar",
    address: "Near More Chowk, Kabra Nagar, Tirumala Nagar, Nanded 431605",
    phone: "",
    rating: 4.7,
    reviews: 966,
    description: "Vegetarian restaurant listing. Use the map link to confirm current contact details and hours.",
    icon: "🥗",
    mapQuery: "Kailash Parbat Kabra Nagar Nanded"
  },
  {
    name: "Dwarka Dine-In Restaurant",
    category: "Restaurants",
    area: "Waman Nagar",
    address: "Chhatrapati Chowk to Kabra Nagar Road, Gopal Krishna Nagar, Waman Nagar, Nanded 431605",
    phone: "+918626036636",
    rating: 4.6,
    reviews: 401,
    description: "Vegetarian dine-in restaurant listing. Contact the restaurant for current menu and timings.",
    icon: "🍲",
    mapQuery: "Dwarka Dine In Restaurant Nanded"
  },
  {
    name: "Hotel Qureshiya",
    category: "Restaurants",
    area: "Degloor Naka",
    address: "Maltekri Road, Degloor Naka, Nanded, Maharashtra 431604",
    phone: "+919890910037",
    rating: 4.1,
    reviews: 1390,
    description: "Restaurant listing around Degloor Naka. Verify service details and opening hours before visiting.",
    icon: "🍛",
    mapQuery: "Hotel Qureshiya Degloor Naka Nanded"
  }
];

const heroSearchForm = $("#heroSearchForm");
const heroSearch = $("#heroSearch");
const directorySearch = $("#directorySearch");
const categoryFilter = $("#categoryFilter");
const areaFilter = $("#areaFilter");
const businessGrid = $("#businessGrid");
const resultCount = $("#resultCount");
const themeToggle = $("#themeToggle");
const form = $("#businessForm");
const formMessage = $("#formMessage");
const categoryGrid = $("#categoryGrid");
const navLinks = $("#navLinks");
const mobileMenu = $("#mobileMenu");
const THEME_KEY = "nandedseva_theme";
const SUBMISSIONS_KEY = "nandedseva_draft_submissions";

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function norm(value) { return String(value ?? "").trim().toLocaleLowerCase("en-IN"); }
function mapUrl(business) {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(business.mapQuery || `${business.name}, ${business.address}`);
}
function getFiltered() {
  const query = norm(directorySearch.value);
  const category = categoryFilter.value;
  const area = norm(areaFilter.value);
  return businesses.filter((b) => {
    const text = norm([b.name, b.category, b.area, b.address, b.description].join(" "));
    return (!query || text.includes(query)) &&
      (!category || b.category === category) &&
      (!area || norm(b.area) === area);
  });
}
function buildCard(b, index) {
  const phone = String(b.phone || "").replace(/[^\d+]/g, "");
  const call = phone ? `<a class="call-link" href="tel:${esc(phone)}">☎ Call</a>` : "";
  const map = `<a href="${mapUrl(b)}" target="_blank" rel="noopener noreferrer">Map ↗</a>`;
  const rating = Number.isFinite(b.rating) && b.reviews
    ? `<div class="business-rating" aria-label="Listed rating ${b.rating} from ${b.reviews} reviews">★ ${b.rating.toFixed(1)} <span>(${b.reviews.toLocaleString("en-IN")} public reviews shown in listing)</span></div>`
    : "";
  return `<article class="business-card" style="animation-delay:${Math.min(index,7)*35}ms">
    <div class="business-top"><div class="business-icon" aria-hidden="true">${esc(b.icon || "📍")}</div><div><h3>${esc(b.name)}</h3><span class="business-category">${esc(b.category)}</span></div></div>
    ${rating}
    <p class="business-desc">${esc(b.description)}</p>
    <div class="business-meta"><span>📍 ${esc(b.area)}, Nanded</span><span>${esc(b.address)}</span></div>
    <div class="business-actions">${call}${map}</div>
  </article>`;
}
function render() {
  const filtered = getFiltered();
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "business" : "businesses"} found`;
  if (!filtered.length) {
    businessGrid.innerHTML = `<div class="empty-state"><div class="empty-icon">🔎</div><h3>No matching businesses</h3><p>Try a different search or remove one of the filters. You can also suggest a business using the form below.</p><button class="btn btn-outline" type="button" id="emptyReset">Reset filters</button></div>`;
    $("#emptyReset").addEventListener("click", reset);
    return;
  }
  businessGrid.innerHTML = filtered.map(buildCard).join("");
}
function updateAreas() {
  const selected = areaFilter.value;
  const areas = [...new Set(businesses.map((b) => b.area).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"en-IN"));
  areaFilter.replaceChildren(new Option("All localities", ""));
  areas.forEach((area) => areaFilter.add(new Option(area, area)));
  if (areas.includes(selected)) areaFilter.value = selected;
}
function reset() {
  heroSearch.value = "";
  directorySearch.value = "";
  categoryFilter.value = "";
  areaFilter.value = "";
  categoryGrid.querySelectorAll(".category").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  render();
}
function setCategory(category) {
  categoryFilter.value = categoryFilter.value === category ? "" : category;
  categoryGrid.querySelectorAll(".category").forEach((button) => {
    const active = button.dataset.category === categoryFilter.value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  render();
  $("#directory").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
}
heroSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  directorySearch.value = heroSearch.value;
  render();
  $("#directory").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
});
heroSearch.addEventListener("input", () => { directorySearch.value = heroSearch.value; });
directorySearch.addEventListener("input", () => { heroSearch.value = directorySearch.value; render(); });
categoryFilter.addEventListener("change", () => {
  categoryGrid.querySelectorAll(".category").forEach((button) => {
    const active = button.dataset.category === categoryFilter.value;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  render();
});
areaFilter.addEventListener("change", render);
$("#resetFilters").addEventListener("click", reset);
$("#clearCategory").addEventListener("click", reset);
categoryGrid.querySelectorAll(".category").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => setCategory(button.dataset.category));
});

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.textContent = dark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = dark ? "#111812" : "#f7f8f2";
}
function preferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (_) {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
applyTheme(preferredTheme());
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
});

mobileMenu.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  mobileMenu.setAttribute("aria-expanded", String(open));
  mobileMenu.textContent = open ? "✕" : "☰";
  mobileMenu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  mobileMenu.setAttribute("aria-expanded", "false");
  mobileMenu.textContent = "☰";
}));

function readDrafts() {
  try {
    const value = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (_) { return []; }
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const draft = {
    name: String(data.get("name") || "").trim(),
    contact: String(data.get("contact") || "").trim(),
    category: String(data.get("category") || "").trim(),
    area: String(data.get("area") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    description: String(data.get("description") || "").trim(),
    whatsapp: String(data.get("whatsapp") || "").trim(),
    status: "draft-not-submitted",
    savedAt: new Date().toISOString()
  };
  if (!draft.name || !draft.contact || !draft.category || !draft.area || !draft.phone || !draft.description) {
    formMessage.textContent = "Please complete all required fields.";
    return;
  }
  try {
    const drafts = readDrafts();
    drafts.push(draft);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(drafts));
    form.reset();
    formMessage.textContent = "Draft saved in this browser only. It has not been sent to NandedSeva or published.";
  } catch (_) {
    formMessage.textContent = "Browser storage is unavailable. Please try again or copy your details before leaving.";
  }
});
$("#year").textContent = new Date().getFullYear();
updateAreas();
render();
