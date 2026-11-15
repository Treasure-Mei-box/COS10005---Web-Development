/* ==========================================================================
   GUSTIO - script.js
   COS10005 Web Development - Assignment 2

   All JavaScript for the website lives in this single file. It is linked
   from every page with <script src="js/script.js" defer>.
   Each init function checks that its own form exists, so this one file
   can be used on every page without errors.

   Contents
   1.  Restaurant data (used by the recommendation and reservation pages)
   2.  Small helper functions
   3.  Mobile navigation menu
   4.  Registration page (form validation)
   5.  Recommendation page (rule-based matching)
   6.  Reservation page (deposit, payment sections, form validation)
   7.  Start-up: run the init functions after the page loads
   ========================================================================== */

"use strict";

/* ==========================================================================
   1. RESTAURANT DATA
   One array holds all six restaurants. The recommendation page uses
   priceMin/priceMax/diets/purposes and the reservation page uses deposit.
   Prices are in Malaysian Ringgit (RM) per person.
   diets    : dietary needs the restaurant can cater for
   purposes : dining purposes the restaurant is best suited to
   ========================================================================== */

const RESTAURANTS = [
  {
    id: "orchid",
    name: "ORCHID Restaurant",
    cuisine: "Arabic (Halal)",
    category: "arabic",
    image: "images/restaurant1.jpg",
    imageAlt: "ORCHID HOUSE Restaurant in Kampung Baru, KLCC",
    foodImage: "images/index/shawama.jpg",
    foodAlt: "Shawarma wrap from ORCHID Restaurant",
    priceMin: 25,
    priceMax: 45,
    deposit: 20,
    diets: ["halal"],
    purposes: ["family", "date"]
  },
  {
    id: "nando",
    name: "Nando's",
    cuisine: "Malaysian Food",
    category: "malaysian",
    image: "images/restaurant2.jpg",
    imageAlt: "Nando's flame-grilled chicken at the Sunway Pyramid branch",
    foodImage: "images/index/hotrice.jpg",
    foodAlt: "Hot rice dish inspired by Nando's meals",
    priceMin: 22,
    priceMax: 55,
    deposit: 20,
    diets: ["halal"],
    purposes: ["family"]
  },
  {
    id: "hiro",
    name: "Sushi Hiro",
    cuisine: "Japanese (Non-Halal)",
    category: "japanese",
    image: "images/restaurant3.jpg",
    imageAlt: "Sushi Hiro restaurant frontage at USJ Taipan",
    foodImage: "images/index/sushi.jpg",
    foodAlt: "Fresh sushi platter from Sushi Hiro",
    priceMin: 25,
    priceMax: 90,
    deposit: 30,
    diets: [],
    purposes: ["family", "date", "business"]
  },
  {
    id: "upstairs",
    name: "Upstairs Cafe",
    cuisine: "Dine to Desserts",
    category: "cafe",
    image: "images/restaurant4.jpg",
    imageAlt: "Upstairs Cafe cosy interior in SS12",
    foodImage: "images/index/strawberry.jpg",
    foodAlt: "Strawberry dessert from Upstairs Cafe",
    priceMin: 13,
    priceMax: 45,
    deposit: 15,
    diets: [],
    purposes: ["family", "date"]
  },
  {
    id: "talker",
    name: "Talker Cafe & Chocolate Factory",
    cuisine: "Desserts (Halal)",
    category: "desserts",
    image: "images/restaurant5.jpg",
    imageAlt: "Talker Cafe and Chocolate Factory in SS13",
    foodImage: "images/index/latte.jpg",
    foodAlt: "Cafe latte from Talker Cafe",
    priceMin: 12,
    priceMax: 35,
    deposit: 10,
    diets: ["halal"],
    purposes: ["family", "date"]
  },
  {
    id: "pocha",
    name: "Ajooma Pocha",
    cuisine: "Korean",
    category: "korean",
    image: "images/restaurant6.jpg",
    imageAlt: "Ajooma Pocha Korean restaurant in SS15",
    foodImage: "images/index/kfood.jpg",
    foodAlt: "Korean comfort food from Ajooma Pocha",
    priceMin: 15.9,
    priceMax: 46,
    deposit: 0,
    diets: [],
    purposes: ["family", "date"]
  }
];

/* Budget bands for the recommendation page (RM per person) */
const BUDGET_BANDS = {
  low:    { label: "Up to RM 50",     min: 0,   max: 50 },
  medium: { label: "RM 51 - RM 100",  min: 51,  max: 100 },
  high:   { label: "RM 101 - RM 200", min: 101, max: 200 },
  luxury: { label: "Above RM 200",    min: 201, max: Infinity }
};

/* Used to turn stored values such as "family" into readable text */
const PURPOSE_LABELS = { family: "Family", date: "Date night", business: "Business" };
const DIET_LABELS = { none: "No dietary requirement", vegan: "Vegan", vegetarian: "Vegetarian", halal: "Halal" };
const CATEGORY_LABELS = {
  any: "Any cuisine",
  arabic: "Arabic",
  malaysian: "Malaysian",
  japanese: "Japanese",
  cafe: "Cafe / Dine to Desserts",
  desserts: "Desserts",
  korean: "Korean"
};

/* ==========================================================================
   2. SMALL HELPER FUNCTIONS
   ========================================================================== */

/* Show or clear the error message under a form field.
   Every field has an error paragraph with the id "fieldId-error".
   An empty message clears the error. */
function setError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + "-error");
  if (errorElement) {
    errorElement.textContent = message;
  }
  const field = document.getElementById(fieldId);
  if (field) {
    if (message !== "") {
      field.classList.add("invalid");
      field.setAttribute("aria-invalid", "true");
    } else {
      field.classList.remove("invalid");
      field.removeAttribute("aria-invalid");
    }
  }
}

/* Format a number as Malaysian Ringgit, e.g. 20 -> "RM 20.00" */
function formatRM(amount) {
  return "RM " + amount.toFixed(2);
}

/* Text such as "RM 25 - RM 45" for a restaurant's price range */
function priceRangeText(restaurant) {
  return "RM " + restaurant.priceMin + " - RM " + restaurant.priceMax;
}

/* Look up a restaurant object by its id (returns null if not found) */
function findRestaurant(id) {
  for (let i = 0; i < RESTAURANTS.length; i++) {
    if (RESTAURANTS[i].id === id) {
      return RESTAURANTS[i];
    }
  }
  return null;
}

/* Today's date as YYYY-MM-DD, used for the "not in the past" date rule */
function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

/* A simple email format check used by the forms */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/* ==========================================================================
   3. MOBILE NAVIGATION MENU
   The "Menu" button only appears on small screens (CSS hides it unless
   JavaScript adds the js-enabled class, so the menu still works without JS).
   ========================================================================== */

function initNavigation() {
  document.documentElement.classList.add("js-enabled");

  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (toggle === null || nav === null) {
    return; // nothing to do on pages without the nav
  }

  toggle.addEventListener("click", function () {
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    }
  });
}

/* ==========================================================================
   4. REGISTRATION PAGE
   All fields are required. When Submit is pressed, every field is checked
   with standard beginner if-statements. If anything fails, the form is NOT
   submitted (event.preventDefault) and the errors are shown under the fields.
   ========================================================================== */

function initRegistration() {
  const form = document.getElementById("register-form");
  if (form === null) {
    return; // this page has no registration form
  }

  /* "None" cannot be combined with other dietary preferences:
     ticking one of them unticks the other. */
  const dietBoxes = document.getElementsByName("diet");
  for (let i = 0; i < dietBoxes.length; i++) {
    dietBoxes[i].addEventListener("change", function () {
      if (!this.checked) {
        return;
      }
      if (this.value === "none") {
        for (let j = 0; j < dietBoxes.length; j++) {
          if (dietBoxes[j].value !== "none") {
            dietBoxes[j].checked = false;
          }
        }
      } else {
        const noneBox = document.getElementById("diet-none");
        if (noneBox) {
          noneBox.checked = false;
        }
      }
    });
  }

  /* Show / hide password buttons */
  const toggleButtons = document.querySelectorAll(".toggle-password");
  for (let i = 0; i < toggleButtons.length; i++) {
    toggleButtons[i].addEventListener("click", function () {
      const fieldId = this.getAttribute("data-toggle-password");
      const field = document.getElementById(fieldId);
      if (field.type === "password") {
        field.type = "text";
        this.textContent = "Hide";
      } else {
        field.type = "password";
        this.textContent = "Show";
      }
    });
  }

  /* Validate the whole form when Submit is pressed */
  form.addEventListener("submit", function (event) {
    let ok = true;

    /* 1. Username: required, at least 5 characters, letters/numbers/underscores */
    const username = document.getElementById("username").value.trim();
    if (username === "") {
      setError("username", "Username is required.");
      ok = false;
    } else if (username.length < 5) {
      setError("username", "Username must be at least 5 characters long.");
      ok = false;
    } else if (!/^[A-Za-z0-9_]+$/.test(username)) {
      setError("username", "Username may only contain letters, numbers and underscores.");
      ok = false;
    } else {
      setError("username", "");
    }

    /* 2. Email address */
    const email = document.getElementById("email").value.trim();
    if (email === "") {
      setError("email", "Email address is required.");
      ok = false;
    } else if (!isValidEmail(email)) {
      setError("email", "Enter a valid email address (e.g. name@example.com).");
      ok = false;
    } else {
      setError("email", "");
    }

    /* 3. Phone: digits only, 8 to 15 digits */
    const phone = document.getElementById("phone").value.trim();
    if (phone === "") {
      setError("phone", "Phone number is required.");
      ok = false;
    } else if (!/^\d+$/.test(phone)) {
      setError("phone", "Phone number must contain digits only.");
      ok = false;
    } else if (phone.length < 8 || phone.length > 15) {
      setError("phone", "Phone number must be between 8 and 15 digits long.");
      ok = false;
    } else {
      setError("phone", "");
    }

    /* 4. Password: at least 10 characters with upper, lower, number, special */
    const password = document.getElementById("password").value;
    if (password === "") {
      setError("password", "Password is required.");
      ok = false;
    } else if (password.length < 10) {
      setError("password", "Password must be at least 10 characters long.");
      ok = false;
    } else if (!/[A-Z]/.test(password)) {
      setError("password", "Password must contain at least one uppercase letter (A-Z).");
      ok = false;
    } else if (!/[a-z]/.test(password)) {
      setError("password", "Password must contain at least one lowercase letter (a-z).");
      ok = false;
    } else if (!/\d/.test(password)) {
      setError("password", "Password must contain at least one number (0-9).");
      ok = false;
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      setError("password", "Password must contain at least one special character.");
      ok = false;
    } else {
      setError("password", "");
    }

    /* 5. Confirm password must match the password */
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (confirmPassword === "") {
      setError("confirmPassword", "Please confirm your password.");
      ok = false;
    } else if (confirmPassword !== password) {
      setError("confirmPassword", "Passwords do not match.");
      ok = false;
    } else {
      setError("confirmPassword", "");
    }

    /* 6. Gender: standard beginner loop over radio buttons */
    let genderSelected = false;
    const genderRadios = document.getElementsByName("gender");
    for (let i = 0; i < genderRadios.length; i++) {
      if (genderRadios[i].checked) {
        genderSelected = true;
        break;
      }
    }
    if (!genderSelected) {
      setError("gender", "Please select a gender.");
      ok = false;
    } else {
      setError("gender", "");
    }

    /* 7. Dietary preferences: standard beginner loop over checkboxes */
    let dietSelected = false;
    const dietCheckboxes = document.getElementsByName("diet");
    for (let i = 0; i < dietCheckboxes.length; i++) {
      if (dietCheckboxes[i].checked) {
        dietSelected = true;
        break;
      }
    }
    if (!dietSelected) {
      setError("diet", "Please choose at least one dietary preference (or select None).");
      ok = false;
    } else {
      setError("diet", "");
    }

    /* 8. Country/Region */
    if (document.getElementById("country").value === "") {
      setError("country", "Please select your country or region.");
      ok = false;
    } else {
      setError("country", "");
    }

    /* Block the submission if anything failed */
    const summary = document.getElementById("form-summary");
    if (!ok) {
      event.preventDefault();
      if (summary) {
        summary.hidden = false;
        summary.textContent = "Please fix the highlighted fields above, then submit again.";
      }
    } else {
      if (summary) {
        summary.hidden = true;
      }
    }
  });
}

/* ==========================================================================
   5. RECOMMENDATION PAGE
   Rule-based matching:
     1. Cuisine category is a hard rule: the restaurant must match the chosen
        category ("Any" allows all restaurants).
     2. Diet is a hard rule: the restaurant must cater for the chosen diet
        ("None" allows all restaurants).
     3. Budget: +3 points if the average price is inside the chosen band,
        +1 point if the price range only partly overlaps the band.
        No overlap at all = the restaurant is removed.
     4. Purpose: +2 points if the restaurant suits the dining purpose.
     5. Matched diet: +1 bonus point.
   The three highest scores are shown. If nothing fits the budget, the
   closest in price are shown with a note instead.
   ========================================================================== */

function recommendRestaurants(category, diet, budgetKey, purpose) {
  const band = BUDGET_BANDS[budgetKey];
  const maxScore = 3 + 2 + (diet === "none" ? 0 : 1);
  const results = [];

  for (let i = 0; i < RESTAURANTS.length; i++) {
    const r = RESTAURANTS[i];

    /* Rule 1: the cuisine category filter */
    if (category !== "any" && r.category !== category) {
      continue; // not the chosen cuisine, skip the restaurant
    }

    /* Rule 2: the diet filter */
    if (diet !== "none" && r.diets.indexOf(diet) === -1) {
      continue; // cannot cater for this diet, skip the restaurant
    }

    const average = (r.priceMin + r.priceMax) / 2;
    const overlaps = r.priceMin <= band.max && r.priceMax >= band.min;
    let score = 0;
    const reasons = [];

    /* Rule 3: budget points */
    if (average >= band.min && average <= band.max) {
      score = score + 3;
      reasons.push("Average spend of " + formatRM(average) + " per person fits your budget");
    } else if (overlaps) {
      score = score + 1;
      reasons.push("Some dishes fall within your budget (" + priceRangeText(r) + ")");
    } else {
      reasons.push("Priced at " + priceRangeText(r) + ", outside your chosen budget");
    }

    /* Rule 4: purpose points */
    if (r.purposes.indexOf(purpose) !== -1) {
      score = score + 2;
      reasons.push("Well suited to " + PURPOSE_LABELS[purpose].toLowerCase() + " dining");
    }

    /* Rule 5: diet bonus */
    if (diet !== "none") {
      score = score + 1;
      reasons.push("Caters for your " + DIET_LABELS[diet].toLowerCase() + " preference");
    }

    /* How far the average price is outside the band (0 when inside),
       used only by the fallback when nothing fits the budget */
    let distance = 0;
    if (average < band.min) {
      distance = band.min - average;
    } else if (average > band.max) {
      distance = average - band.max;
    }

    results.push({
      restaurant: r,
      score: score,
      percent: Math.round((score / maxScore) * 100),
      overlaps: overlaps,
      distance: distance,
      reasons: reasons
    });
  }

  /* Keep only restaurants whose price range overlaps the budget band.
     If none do, keep them all and remember that we relaxed the rule. */
  let pool = [];
  for (let i = 0; i < results.length; i++) {
    if (results[i].overlaps) {
      pool.push(results[i]);
    }
  }
  let relaxed = false;
  if (pool.length === 0) {
    pool = results;
    relaxed = true;
  }

  /* Highest score first (in relaxed mode: closest price first).
     Ties are broken alphabetically by name. */
  pool.sort(function (a, b) {
    if (relaxed && a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return a.restaurant.name.localeCompare(b.restaurant.name);
  });

  return { matches: pool.slice(0, 3), relaxed: relaxed };
}

/* Show the top matches on the page as selectable radio-button cards */
function showRecommendations(category, diet, budgetKey, purpose) {
  const result = recommendRestaurants(category, diet, budgetKey, purpose);
  const box = document.getElementById("recommend-results");

  let html = "<h2 id=\"results-heading\">Your recommended restaurants</h2>";
  html += "<p class=\"results-summary\">Based on: " + CATEGORY_LABELS[category] + " | " + DIET_LABELS[diet] + " | " + BUDGET_BANDS[budgetKey].label + " per person | " + PURPOSE_LABELS[purpose] + "</p>";

  /* No match at all (for example vegan or a specific cuisine + diet: no restaurant matches) */
  if (result.matches.length === 0) {
    html += "<p class=\"notice\">Sorry, no restaurants match those choices. Please try a different combination.</p>";
    box.innerHTML = html;
    box.hidden = false;
    box.scrollIntoView({ block: "start" });
    return;
  }

  /* Relaxed mode: nothing fitted the budget, show a note */
  if (result.relaxed) {
    html += "<p class=\"notice\">No restaurant matches your cuisine and diet within that budget, so these are the closest options for your preferences.</p>";
  }

  html += "<ol class=\"result-list\">";
  for (let i = 0; i < result.matches.length; i++) {
    const item = result.matches[i];
    const r = item.restaurant;

    html += "<li class=\"result-card\">";
    html += "<div class=\"result-top\">";
    html += "<input type=\"radio\" name=\"chosenRestaurant\" id=\"choice-" + r.id + "\" value=\"" + r.id + "\"" + (i === 0 ? " checked" : "") + ">";
    html += "<label class=\"result-name\" for=\"choice-" + r.id + "\">" + r.name + "</label>";
    if (i === 0) {
      html += "<span class=\"badge\">Best match</span>";
    }
    html += "<span class=\"match-score\">" + item.percent + "% match</span>";
    html += "</div>";
    html += "<div class=\"result-images\">";
    html += "<img src=\"" + r.image + "\" alt=\"" + r.imageAlt + "\" width=\"800\" height=\"520\" loading=\"lazy\">";
    if (r.foodImage) {
      html += "<img src=\"" + r.foodImage + "\" alt=\"" + r.foodAlt + "\" width=\"800\" height=\"520\" loading=\"lazy\">";
    }
    html += "</div>";
    html += "<p class=\"meta\">" + r.cuisine + " | " + priceRangeText(r) + " per person | Deposit " + formatRM(r.deposit) + "</p>";
    html += "<ul class=\"reasons\">";
    for (let j = 0; j < item.reasons.length; j++) {
      html += "<li>" + item.reasons[j] + "</li>";
    }
    html += "</ul>";
    html += "</li>";
  }
  html += "</ol>";

  html += "<div class=\"result-actions\">";
  html += "<button type=\"button\" class=\"btn\" id=\"reserve-button\">Reserve selected restaurant</button>";
  html += "<a class=\"btn btn-secondary\" href=\"restaurants.html\">View all restaurants</a>";
  html += "</div>";

  box.innerHTML = html;
  box.hidden = false;
  box.scrollIntoView({ block: "start" });

  /* Go to the reservation page with the chosen restaurant in the address */
  document.getElementById("reserve-button").addEventListener("click", function () {
    let chosenValue = "";
    const chosenRadios = document.getElementsByName("chosenRestaurant");
    for (let i = 0; i < chosenRadios.length; i++) {
      if (chosenRadios[i].checked) {
        chosenValue = chosenRadios[i].value;
        break;
      }
    }
    if (chosenValue !== "") {
      window.location.href = "reservation.html?restaurant=" + encodeURIComponent(chosenValue);
    }
  });
}

function initRecommendation() {
  const form = document.getElementById("recommend-form");
  if (form === null) {
    return; // this page has no recommendation form
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // this form never sends data anywhere

    let ok = true;

    /* The four questions must all be answered */
    const category = document.getElementById("category").value;
    if (category === "") {
      setError("category", "Please choose a cuisine category.");
      ok = false;
    } else {
      setError("category", "");
    }

    const diet = document.getElementById("diet").value;
    if (diet === "") {
      setError("diet", "Please choose your dietary preference.");
      ok = false;
    } else {
      setError("diet", "");
    }

    const budget = document.getElementById("budget").value;
    if (budget === "") {
      setError("budget", "Please choose a budget range.");
      ok = false;
    } else {
      setError("budget", "");
    }

    /* Dining purpose: loop through radio buttons (beginner style) */
    let purposeSelected = false;
    let purposeValue = "";
    const purposeRadios = document.getElementsByName("purpose");
    for (let i = 0; i < purposeRadios.length; i++) {
      if (purposeRadios[i].checked) {
        purposeSelected = true;
        purposeValue = purposeRadios[i].value;
        break;
      }
    }
    if (!purposeSelected) {
      setError("purpose", "Please choose a dining purpose.");
      ok = false;
    } else {
      setError("purpose", "");
    }

    const summary = document.getElementById("form-summary");
    if (!ok) {
      if (summary) {
        summary.hidden = false;
        summary.textContent = "Please choose all the options above.";
      }
      return;
    }
    if (summary) {
      summary.hidden = true;
    }

    showRecommendations(category, diet, budget, purposeValue);
  });
}

/* ==========================================================================
   6. RESERVATION PAGE
   - The deposit box and the info panel update when the restaurant changes.
   - Only the fields of the chosen payment method are shown and validated.
   - When Submit is pressed, every field is checked; the form is only sent
     to the Mercury test script when everything is valid.
   ========================================================================== */

function initReservation() {
  const form = document.getElementById("reservation-form");
  if (form === null) {
    return; // this page has no reservation form
  }

  const restaurantSelect = document.getElementById("restaurant");
  const emailInput = document.getElementById("email");

  /* ----- restaurant drop-down: update deposit and the info panel ----- */
  function updateRestaurantDetails() {
    const r = findRestaurant(restaurantSelect.value);
    const info = document.getElementById("restaurant-info");

    if (r === null) {
      document.getElementById("deposit").value = "";
      info.hidden = true;
      return;
    }
    document.getElementById("deposit").value = formatRM(r.deposit);
    document.getElementById("info-name").textContent = r.name;
    document.getElementById("info-cuisine").textContent = r.cuisine;
    document.getElementById("info-price").textContent = priceRangeText(r) + " per person";
    document.getElementById("info-deposit").textContent = formatRM(r.deposit);
    info.hidden = false;
  }

  /* ----- helper: enable/disable all fields inside a hidden section ----- */
  function setDisabled(boxId, disabled) {
    const fields = document.getElementById(boxId).querySelectorAll("input, select");
    for (let i = 0; i < fields.length; i++) {
      fields[i].disabled = disabled; // disabled fields are not sent or validated
    }
  }

  /* ----- payment method: only show the fields that are needed ----- */
  function updatePaymentSections() {
    let methodValue = "";
    const payRadios = document.getElementsByName("paymentMethod");
    for (let i = 0; i < payRadios.length; i++) {
      if (payRadios[i].checked) {
        methodValue = payRadios[i].value;
        break;
      }
    }
    const isVoucher = (methodValue === "voucher");
    const isOnline = (methodValue === "online");

    document.getElementById("voucher-box").hidden = !isVoucher;
    document.getElementById("card-box").hidden = !isOnline;
    setDisabled("voucher-box", !isVoucher);
    setDisabled("card-box", !isOnline);

    /* Switching method must not leave old error messages behind */
    if (!isOnline) {
      setError("cardType", "");
      setError("cardNumber", "");
      setError("cardName", "");
      setError("cardExpiry", "");
      setError("cardCvv", "");
    }
    if (methodValue !== "") {
      setError("paymentMethod", "");
    }
  }

  /* ----- billing email: copy from the email box when the box is ticked ----- */
  function syncBillingEmail() {
    const sameEmail = document.getElementById("sameEmail");
    const billingEmail = document.getElementById("billingEmail");
    if (sameEmail.checked) {
      billingEmail.value = emailInput.value;
      billingEmail.readOnly = true;
    } else {
      billingEmail.readOnly = false;
    }
  }

  /* ----- the whole form is validated when Submit is pressed ----- */
  form.addEventListener("submit", function (event) {
    let ok = true;

    /* Deposit method: loop through radio buttons (beginner style) */
    let payMethod = "";
    const payRadios = document.getElementsByName("paymentMethod");
    for (let i = 0; i < payRadios.length; i++) {
      if (payRadios[i].checked) {
        payMethod = payRadios[i].value;
        break;
      }
    }

    /* Full name */
    const fullName = document.getElementById("fullName").value.trim();
    if (fullName === "") {
      setError("fullName", "Full name is required.");
      ok = false;
    } else if (fullName.length < 2) {
      setError("fullName", "Please enter your full name.");
      ok = false;
    } else {
      setError("fullName", "");
    }

    /* Email address */
    const email = emailInput.value.trim();
    if (email === "") {
      setError("email", "Email address is required.");
      ok = false;
    } else if (!isValidEmail(email)) {
      setError("email", "Enter a valid email address (e.g. name@example.com).");
      ok = false;
    } else {
      setError("email", "");
    }

    /* Phone: normal punctuation allowed, at least 10 digits */
    const phone = document.getElementById("phone").value.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    if (phone === "") {
      setError("phone", "Phone number is required.");
      ok = false;
    } else if (!/^\+?[\d\s\-()]+$/.test(phone)) {
      setError("phone", "Phone number may only contain digits, spaces, dashes, brackets and a leading +.");
      ok = false;
    } else if (phoneDigits.length < 10) {
      setError("phone", "Phone number must contain at least 10 digits.");
      ok = false;
    } else if (phoneDigits.length > 15) {
      setError("phone", "Phone number cannot contain more than 15 digits.");
      ok = false;
    } else {
      setError("phone", "");
    }

    /* Restaurant */
    if (restaurantSelect.value === "") {
      setError("restaurant", "Please select a restaurant.");
      ok = false;
    } else {
      setError("restaurant", "");
    }

    /* Date: required and not in the past */
    const resDate = document.getElementById("resDate").value;
    if (resDate === "") {
      setError("resDate", "Please choose a reservation date.");
      ok = false;
    } else if (resDate < todayString()) {
      setError("resDate", "Reservation date cannot be in the past.");
      ok = false;
    } else {
      setError("resDate", "");
    }

    /* Time: required, and if the booking is for today it must be in the future */
    const resTime = document.getElementById("resTime").value;
    if (resTime === "") {
      setError("resTime", "Please choose a reservation time.");
      ok = false;
    } else if (resDate === todayString() && new Date(resDate + "T" + resTime) < new Date()) {
      setError("resTime", "That time has already passed today. Please choose a later time.");
      ok = false;
    } else {
      setError("resTime", "");
    }

    /* Number of people: a whole number greater than 0 */
    const peopleRaw = document.getElementById("people").value.trim();
    const people = Number(peopleRaw);
    if (peopleRaw === "") {
      setError("people", "Please enter the number of people.");
      ok = false;
    } else if (!Number.isInteger(people) || people <= 0) {
      setError("people", "Number of people must be a whole number greater than 0.");
      ok = false;
    } else if (people > 30) {
      setError("people", "For more than 30 guests, please contact the restaurant directly.");
      ok = false;
    } else {
      setError("people", "");
    }

    /* Deposit method */
    if (payMethod === "") {
      setError("paymentMethod", "Please choose a deposit method (Voucher or Online payment).");
      ok = false;
    } else {
      setError("paymentMethod", "");
    }

    /* Card fields are only checked when "Online payment" is chosen */
    if (payMethod === "online") {
      const cardType = document.getElementById("cardType").value;

      if (cardType === "") {
        setError("cardType", "Please select a card type.");
        ok = false;
      } else {
        setError("cardType", "");
      }

      /* Visa/Mastercard: 16 digits. American Express: 15 digits. Format only. */
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const neededDigits = (cardType === "amex" ? 15 : 16);
      if (cardNumber === "") {
        setError("cardNumber", "Credit card number is required.");
        ok = false;
      } else if (!/^\d+$/.test(cardNumber)) {
        setError("cardNumber", "Card number must contain digits only (no spaces or dashes).");
        ok = false;
      } else if (cardType !== "" && cardNumber.length !== neededDigits) {
        setError("cardNumber", (cardType === "amex" ? "American Express" : "Visa / Mastercard") +
          " card numbers must be exactly " + neededDigits + " digits.");
        ok = false;
      } else {
        setError("cardNumber", "");
      }

      if (document.getElementById("cardName").value.trim() === "") {
        setError("cardName", "Name on card is required.");
        ok = false;
      } else {
        setError("cardName", "");
      }

      /* Expiry as MM/YY and not already expired */
      const cardExpiry = document.getElementById("cardExpiry").value.trim();
      if (cardExpiry === "") {
        setError("cardExpiry", "Card expiry date is required.");
        ok = false;
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        setError("cardExpiry", "Enter the expiry date as MM/YY, for example 08/29.");
        ok = false;
      } else {
        const parts = cardExpiry.split("/");
        const expiryYear = 2000 + Number(parts[1]);
        const expiryMonth = Number(parts[0]);
        const now = new Date();
        if (expiryYear < now.getFullYear() || (expiryYear === now.getFullYear() && expiryMonth < now.getMonth() + 1)) {
          setError("cardExpiry", "This card has expired.");
          ok = false;
        } else {
          setError("cardExpiry", "");
        }
      }

      /* Security code: 3 digits, or 4 digits for American Express */
      const cardCvv = document.getElementById("cardCvv").value.trim();
      const neededCvv = (cardType === "amex" ? 4 : 3);
      if (cardCvv === "") {
        setError("cardCvv", "Security code (CVV) is required.");
        ok = false;
      } else if (!/^\d+$/.test(cardCvv) || cardCvv.length !== neededCvv) {
        setError("cardCvv", "Security code must be " + neededCvv + " digits.");
        ok = false;
      } else {
        setError("cardCvv", "");
      }
    }

    /* Billing email: always required and must be a valid email */
    const billingEmail = document.getElementById("billingEmail").value.trim();
    if (billingEmail === "") {
      setError("billingEmail", "Billing email address is required.");
      ok = false;
    } else if (!isValidEmail(billingEmail)) {
      setError("billingEmail", "Enter a valid billing email address.");
      ok = false;
    } else {
      setError("billingEmail", "");
    }

    /* Block the submission if anything failed */
    const summary = document.getElementById("form-summary");
    if (!ok) {
      event.preventDefault();
      if (summary) {
        summary.hidden = false;
        summary.textContent = "Please fix the highlighted fields above, then submit again.";
      }
    } else {
      if (summary) {
        summary.hidden = true;
      }
    }
  });

  /* ----- event listeners for the interactive parts ----- */
  restaurantSelect.addEventListener("change", updateRestaurantDetails);

  const payRadios = document.getElementsByName("paymentMethod");
  for (let i = 0; i < payRadios.length; i++) {
    payRadios[i].addEventListener("change", updatePaymentSections);
  }

  document.getElementById("sameEmail").addEventListener("change", syncBillingEmail);
  emailInput.addEventListener("input", function () {
    if (document.getElementById("sameEmail").checked) {
      syncBillingEmail(); // keep the two boxes in sync while typing
    }
  });

  /* Voucher code: digits only, maximum 12 */
  document.getElementById("voucherCode").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 12);
  });

  /* ----- start-up state ----- */

  /* Block past days in the date picker as well */
  document.getElementById("resDate").min = todayString();

  /* Pre-select a restaurant sent from the home, listing or recommendation page,
     e.g. reservation.html?restaurant=orchid */
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("restaurant");
  if (requested !== null && findRestaurant(requested) !== null) {
    restaurantSelect.value = requested;
    document.getElementById("restaurant-note").hidden = false;
  }

  updateRestaurantDetails();
  updatePaymentSections();
  syncBillingEmail();
}

/* Rotate the home page hero image every 3 seconds (skipped if user prefers reduced motion) */
function initHeroImageRotation() {
  const heroImage = document.getElementById("hero-rotating-image");
  if (heroImage === null) {
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const slides = [
    { src: "images/index/sushi.jpg", alt: "Fresh sushi platter with assorted rolls and sashimi" },
    { src: "images/index/shawama.jpg", alt: "Freshly prepared shawarma wrap" },
    { src: "images/index/lambrice.jpg", alt: "Aromatic lamb rice dish" },
    { src: "images/index/ramen.jpg", alt: "Steaming bowl of ramen" },
    { src: "images/index/kfood.jpg", alt: "Korean comfort food spread" },
    { src: "images/index/strawberry.jpg", alt: "Strawberry dessert treat" },
    { src: "images/index/latte.jpg", alt: "Freshly made cafe latte" },
    { src: "images/index/drinks.jpg", alt: "Refreshing drinks selection" },
    { src: "images/index/hotrice.jpg", alt: "Hot rice dish served fresh" }
  ];

  let index = 0;
  setInterval(function () {
    index = (index + 1) % slides.length;
    heroImage.src = slides[index].src;
    heroImage.alt = slides[index].alt;
  }, 3000);
}

/* ==========================================================================
   7. START-UP
   Every init function checks that its own form exists, so one script file
   can safely be linked from every page.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initHeroImageRotation();
  initRegistration();
  initRecommendation();
  initReservation();
});
