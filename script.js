
(() => {
  "use strict";

  const categories = [
    ["Electrician", "⚡", "Electrical repairs, switches and wiring."],
    ["Plumber", "🔧", "Leaks, pipes and plumbing repairs."],
    ["Tiffin Service", "🍱", "Homemade meals and daily tiffin."],
    ["Home Tuition", "🎓", "School subjects and exam preparation."],
    ["Mobile Repair", "📱", "Phone diagnostics and repairs."],
    ["AC Repair", "❄️", "AC servicing and installation."],
    ["Carpenter", "🪚", "Furniture repairs and woodwork."],
    ["Painter", "🖌️", "Home painting and touch-ups."],
    ["Cleaning Service", "🧹", "Home and office cleaning."],
    ["Computer Repair", "💻", "Computer and laptop troubleshooting."],
    ["CCTV Installation", "📹", "CCTV setup and maintenance."],
    ["RO Service", "🚰", "Water purifier installation and service."],
    ["Bike Repair", "🏍️", "Two-wheeler maintenance."],
    ["Pest Control", "🐜", "Pest treatment for homes and offices."],
    ["Gas Stove Repair", "🔥", "Gas stove inspection and repair."],
    ["Other", "🧰", "Other services in Nanded."]
  ];

  const areas = [
    "Vazirabad", "Shivaji Nagar", "CIDCO", "Taroda", "Itwara",
    "Bhagya Nagar", "Waghala", "Railway Station Road",
    "Other Nanded areas"
  ];

  // These are placeholders, not real businesses.
  const demoProviders = [
    {id:"demo-1",name:"Demo Electrician",service:"Electrician",area:"Vazirabad",description:"Sample listing. Replace with a real provider.",phone:"",whatsapp:"",status:"approved",demo:true},
    {id:"demo-2",name:"Demo Plumbing Service",service:"Plumber",area:"Shivaji Nagar",description:"Sample listing. Replace with a real provider.",phone:"",whatsapp:"",status:"approved",demo:true},
    {id:"demo-3",name:"Demo Homemade Tiffin",service:"Tiffin Service",area:"CIDCO",description:"Sample listing. Replace with a real provider.",phone:"",whatsapp:"",status:"approved",demo:true},
    {id:"demo-4",name:"Demo Home Tutor",service:"Home Tuition",area:"Taroda",description:"Sample listing. Replace with a real provider.",phone:"",whatsapp:"",status:"approved",demo:true},
    {id:"demo-5",name:"Demo Mobile Repair",service:"Mobile Repair",area:"Itwara",description:"Sample listing. Replace with a real provider.",phone:"",whatsapp:"",status:"approved",demo:true},
    {id:"demo-6",name:"Demo AC Repair",service:"AC Repair",area:"Other Nanded areas",description:"Sample listing. Replace with a real provider.",phone:"",whatsapp:"",status:"approved",demo:true}
  ];

  const $ = selector => document.querySelector(selector);
  const cards = $("#provider-cards");
  const query = $("#query");
  const categoryFilter = $("#category-filter");
  const areaFilter = $("#area-filter");
  const toast = $("#toast");

  const STORAGE = {
    listings: "nandedseva-listings-v1",
    reviews: "nandedseva-reviews-v1"
  };

  function readStore(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      notify("Browser storage unavailable. Data was not saved.");
      return false;
    }
  }

  let submissions = readStore(STORAGE.listings);
  let reviews = readStore(STORAGE.reviews);

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function fillSelect(select, values, label) {
    select.replaceChildren();

    const first = document.createElement("option");
    first.value = "";
    first.textContent = label;
    select.append(first);

    values.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }

  fillSelect(
    categoryFilter,
    categories.filter(item => item[0] !== "Other").map(item => item[0]),
    "All categories"
  );

  fillSelect($("#form-category"), categories.map(item => item[0]), "Select a service");
  fillSelect(areaFilter, areas, "All areas");
  fillSelect($("#form-area"), areas, "Select your area");

  // Build category cards.
  $("#category-cards").innerHTML = categories
    .filter(item => item[0] !== "Other")
    .map(([name, icon, description]) => `
      <article class="category">
        <div class="cat-icon">${icon}</div>
        <h3>${escapeHTML(name)}</h3>
        <p>${escapeHTML(description)}</p>
        <button class="btn btn-light" type="button" data-pick="${escapeHTML(name)}">
          View listings →
        </button>
      </article>
    `).join("");

  function allProviders() {
    return [
      ...demoProviders,
      ...submissions.filter(item => item.status === "approved")
    ];
  }

  function getRating(providerId) {
    const matching = reviews.filter(review => review.providerId === providerId);
    if (!matching.length) return null;

    const average = matching.reduce(
      (sum, review) => sum + Number(review.rating), 0
    ) / matching.length;

    return { average, count: matching.length };
  }

  function createLink(label, href, className, unavailableMessage) {
    const link = document.createElement("a");
    link.className = className;
    link.textContent = label;

    if (href) {
      link.href = href;

      if (href.startsWith("https://")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } else {
      link.href = "#";
      link.setAttribute("aria-disabled", "true");

      link.addEventListener("click", event => {
        event.preventDefault();
        notify(unavailableMessage);
      });
    }

    return link;
  }

  function phoneHref(phone) {
    return "tel:" + String(phone).replace(/[^\d+]/g, "");
  }

  function whatsappHref(phone) {
    let number = String(phone || "").replace(/\D/g, "");

    // Indian 10-digit mobile number.
    if (number.length === 10) number = "91" + number;

    if (number.length < 11 || number.length > 15) return "";
    return "https://wa.me/" + number;
  }

  function render() {
    const searchText = query.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedArea = areaFilter.value;

    const results = allProviders().filter(provider => {
      const searchable = [
        provider.name,
        provider.service,
        provider.area,
        provider.description,
        provider.address
      ].join(" ").toLowerCase();

      return (!searchText || searchable.includes(searchText)) &&
        (!selectedCategory || provider.service === selectedCategory) &&
        (!selectedArea || provider.area === selectedArea);
    });

    cards.replaceChildren();

    $("#result-summary").textContent =
      `${results.length} listing${results.length === 1 ? "" : "s"} found.`;

    if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No matching listings yet. Try another category or area.";
      cards.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();

    results.forEach(provider => {
      const card = document.createElement("article");
      card.className = "provider";

      const head = document.createElement("div");
      head.className = "provider-head";

      const icon = document.createElement("div");
      icon.className = "provider-icon";
      icon.textContent =
        (categories.find(item => item[0] === provider.service) || ["", "🧰"])[1];

      const titleWrap = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = provider.name;

      const badge = document.createElement("span");
      badge.className = "tag";
      badge.textContent = provider.demo ? "Demo listing" : "Approved listing";

      titleWrap.append(title, badge);
      head.append(icon, titleWrap);
      card.append(head);

      const service = document.createElement("p");
      service.className = "meta";
      service.textContent = "🛠 " + provider.service;

      const location = document.createElement("p");
      location.className = "meta";
      location.textContent = "📍 " + provider.area + ", Nanded";

      const description = document.createElement("p");
      description.className = "description";
      description.textContent = provider.description || "Contact provider for details.";

      card.append(service, location, description);

      if (provider.address) {
        const address = document.createElement("p");
        address.className = "meta";
        address.textContent = "⌖ " + provider.address;
        card.append(address);
      }

      const rating = getRating(provider.id);
      const ratingLine = document.createElement("p");
      ratingLine.className = "rating-line";
      ratingLine.textContent = rating
        ? `★ ${rating.average.toFixed(1)} (${rating.count} review${rating.count === 1 ? "" : "s"})`
        : "No reviews yet";

      card.append(ratingLine);

      const actions = document.createElement("div");
      actions.className = "provider-actions";

      actions.append(createLink(
        "☎ Call",
        provider.phone ? phoneHref(provider.phone) : "",
        "btn",
        "This listing has no phone number."
      ));

      actions.append(createLink(
        "WhatsApp ↗",
        provider.whatsapp ? whatsappHref(provider.whatsapp) : "",
        "btn btn-whatsapp",
        "This listing has no valid WhatsApp number."
      ));

      const mapQuery = encodeURIComponent(
        [provider.address, provider.area, "Nanded Maharashtra"]
          .filter(Boolean).join(", ")
      );

      actions.append(createLink(
        "⌖ Map",
        "https://www.google.com/maps/search/?api=1&query=" + mapQuery,
        "btn btn-light"
      ));

      card.append(actions);
      fragment.append(card);
    });

    cards.append(fragment);
  }

  function renderReviewOptions() {
    const select = $("#review-provider");
    select.replaceChildren();

    const first = document.createElement("option");
    first.value = "";
    first.textContent = "Choose a listing";
    select.append(first);

    allProviders().forEach(provider => {
      const option = document.createElement("option");
      option.value = provider.id;
      option.textContent = `${provider.name} — ${provider.service}`;
      select.append(option);
    });
  }

  function renderReviews() {
    const list = $("#review-list");
    list.replaceChildren();

    if (!reviews.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No reviews submitted yet.";
      list.append(empty);
      return;
    }

    reviews.slice().reverse().slice(0, 12).forEach(review => {
      const provider = allProviders().find(
        item => item.id === review.providerId
      );

      const card = document.createElement("article");
      card.className = "review-card";

      const stars = document.createElement("div");
      stars.className = "stars";
      stars.textContent =
        "★".repeat(Number(review.rating)) +
        "☆".repeat(5 - Number(review.rating));

      const name = document.createElement("strong");
      name.textContent = provider ? provider.name : "Listing";

      const comment = document.createElement("p");
      comment.textContent = review.comment;

      const date = document.createElement("small");
      date.textContent = "Browser demo review · " +
        new Date(review.createdAt).toLocaleDateString();

      card.append(stars, name, comment, date);
      list.append(card);
    });
  }

  function renderAdmin() {
    const target = $("#admin-listings");
    target.replaceChildren();

    const pending = submissions.filter(item => item.status === "pending");

    if (!pending.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No pending submissions.";
      target.append(empty);
      return;
    }

    pending.forEach(provider => {
      const item = document.createElement("article");
      item.className = "admin-item";

      const info = document.createElement("div");

      const name = document.createElement("strong");
      name.textContent = provider.name;

      const details = document.createElement("p");
      details.textContent = `${provider.service} · ${provider.area}`;

      const phone = document.createElement("p");
      phone.textContent = provider.phone;

      const description = document.createElement("p");
      description.textContent = provider.description || "";

      info.append(name, details, phone, description);

      const actions = document.createElement("div");
      actions.className = "admin-actions";

      const approve = document.createElement("button");
      approve.type = "button";
      approve.className = "btn";
      approve.textContent = "Approve";
      approve.dataset.approve = provider.id;

      const reject = document.createElement("button");
      reject.type = "button";
      reject.className = "btn btn-danger";
      reject.textContent = "Reject";
      reject.dataset.reject = provider.id;

      actions.append(approve, reject);
      item.append(info, actions);
      target.append(item);
    });
  }

  $("#search-form").addEventListener("submit", event => {
    event.preventDefault();
    render();
    $("#listings").scrollIntoView({ behavior: "smooth" });
  });

  $("#reset-filters").addEventListener("click", () => {
    query.value = "";
    categoryFilter.value = "";
    areaFilter.value = "";
    render();
  });

  // Category buttons and admin approval actions.
  document.addEventListener("click", event => {
    const pick = event.target.closest("[data-pick]");

    if (pick) {
      categoryFilter.value = pick.dataset.pick;
      query.value = "";
      render();
      $("#listings").scrollIntoView({ behavior: "smooth" });
    }

    const approve = event.target.closest("[data-approve]");

    if (approve) {
      submissions = submissions.map(provider =>
        provider.id === approve.dataset.approve
          ? { ...provider, status: "approved" }
          : provider
      );

      if (writeStore(STORAGE.listings, submissions)) {
        render();
        renderAdmin();
        renderReviewOptions();
        notify("Listing approved in this browser demo.");
      }
    }

    const reject = event.target.closest("[data-reject]");

    if (reject) {
      submissions = submissions.filter(
        provider => provider.id !== reject.dataset.reject
      );

      if (writeStore(STORAGE.listings, submissions)) {
        renderAdmin();
        renderReviewOptions();
        notify("Submission removed from this browser demo.");
      }
    }
  });

  // Business submissions remain pending until approved.
  $("#listing-form").addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const item = {
      id: "listing-" + Date.now(),
      name: String(data.get("business") || "").trim(),
      service: String(data.get("service") || ""),
      phone: String(data.get("phone") || "").trim(),
      whatsapp: String(data.get("whatsapp") || "").trim(),
      area: String(data.get("area") || ""),
      address: String(data.get("address") || "").trim(),
      description: String(data.get("description") || "").trim(),
      status: "pending",
      demo: false,
      createdAt: new Date().toISOString()
    };

    submissions.push(item);

    if (writeStore(STORAGE.listings, submissions)) {
      event.currentTarget.reset();
      $("#form-message").textContent =
        "Saved as pending in this browser. Admin can review it on this device/browser.";
      renderAdmin();
      notify("Business submitted for approval.");
    }
  });

  // Browser-demo reviews. These are not independently verified.
  $("#review-form").addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const comment = String(data.get("comment") || "").trim();
    const providerId = String(data.get("provider") || "");
    const rating = Number(data.get("rating"));

    if (!providerId || !comment || rating < 1 || rating > 5) {
      notify("Please select a listing and valid rating.");
      return;
    }

    reviews.push({
      id: "review-" + Date.now(),
      providerId,
      rating,
      comment,
      createdAt: new Date().toISOString()
    });

    if (writeStore(STORAGE.reviews, reviews)) {
      event.currentTarget.reset();
      $("#review-message").textContent =
        "Review saved in this browser demo.";
      renderReviews();
      render();
      notify("Review saved.");
    }
  });

  $("#admin-open").addEventListener("click", () => {
    $("#admin-panel").hidden = false;
    renderAdmin();
    $("#admin-panel").scrollIntoView({ behavior: "smooth" });
  });

  $("#admin-close").addEventListener("click", () => {
    $("#admin-panel").hidden = true;
  });

  $("#clear-demo-data").addEventListener("click", () => {
    if (!confirm("Clear saved submissions and reviews in this browser?")) return;

    const oldSubmissions = submissions;
    const oldReviews = reviews;

    submissions = [];
    reviews = [];

    const listingsSaved = writeStore(STORAGE.listings, submissions);
    const reviewsSaved = writeStore(STORAGE.reviews, reviews);

    if (!listingsSaved || !reviewsSaved) {
      submissions = oldSubmissions;
      reviews = oldReviews;
      return;
    }

    render();
    renderAdmin();
    renderReviews();
    renderReviewOptions();
    notify("Local demo submissions and reviews cleared.");
  });

  $("#menu-toggle").addEventListener("click", () => {
    const button = $("#menu-toggle");
    const open = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!open));
    $("#nav-links").classList.toggle("open", !open);
  });

  $("#nav-links").addEventListener("click", event => {
    if (event.target.closest("a")) {
      $("#nav-links").classList.remove("open");
      $("#menu-toggle").setAttribute("aria-expanded", "false");
    }
  });

  render();
  renderReviewOptions();
  renderReviews();
  renderAdmin();
})();
