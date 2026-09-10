(function () {
  "use strict";

  var PRODUCTS = {
    "krotka-wiadomosc": {
      tag: "Wiązany",
      title: "Krótka wiadomość",
      desc: "Czerwone róże i gałązka eukaliptusa, spięte lnianym sznurkiem zamiast wstążki.",
      sizes: [
        { name: "Mały", count: "3 róże + eukaliptus", price: 70 },
        { name: "Średni", count: "4 róże + eukaliptus", price: 90 },
        { name: "Duży", count: "6 róż + eukaliptus", price: 125 },
      ],
    },
    "klasyczny-tuzin": {
      tag: "Owijany",
      title: "Klasyczny tuzin",
      desc: "Czerwone róże owinięte w papier rzemieślniczy i spięte sznurkiem.",
      sizes: [
        { name: "Mały", count: "9 róż", price: 145 },
        { name: "Średni", count: "12 róż", price: 180 },
        { name: "Duży", count: "19 róż", price: 260 },
      ],
    },
    "wiosna-w-sloiku": {
      tag: "W słoiku",
      title: "Wiosna w słoiku",
      desc: "Tulipany w słoiku po dżemie — gotowe, żeby postawić na parapecie.",
      sizes: [
        { name: "Mały", count: "6 tulipanów", price: 55 },
        { name: "Średni", count: "9 tulipanów", price: 70 },
        { name: "Duży", count: "13 tulipanów", price: 95 },
      ],
    },
    "pierwsze-cieple-dni": {
      tag: "Wiązany",
      title: "Pierwsze ciepłe dni",
      desc: "Tulipany w różowo-pomarańczowo-fioletowej gamie, wiązane sznurkiem.",
      sizes: [
        { name: "Mały", count: "11 tulipanów", price: 65 },
        { name: "Średni", count: "15 tulipanów", price: 85 },
        { name: "Duży", count: "21 tulipanów", price: 115 },
      ],
    },
    "wiosenna-obfitosc": {
      tag: "Duży",
      title: "Wiosenna obfitość",
      desc: "Tulipany w cynkowym wiadrze — bukiet, który zajmuje cały stół.",
      sizes: [
        { name: "Mały", count: "20 tulipanów", price: 105 },
        { name: "Średni", count: "32 tulipany", price: 140 },
        { name: "Duży", count: "45 tulipanów", price: 190 },
      ],
    },
    "ciemna-elegancja": {
      tag: "Kompozycja",
      title: "Ciemna elegancja",
      desc: "Protea, czerwona róża, ostróżka i jaskier w czarnym wazonie.",
      sizes: [
        { name: "Mały", count: "1 protea, 3 róże, ostróżka", price: 165 },
        { name: "Średni", count: "1 protea, 5 róż, ostróżka, jaskier", price: 210 },
        { name: "Duży", count: "2 protee, 8 róż, ostróżka, jaskier", price: 285 },
      ],
    },
    "wielki-bukiet": {
      tag: "Kompozycja",
      title: "Wielki bukiet",
      desc: "Ta sama kompozycja, co nasz Bukiet dnia — protea, róża, storczyk, hortensja, lilia.",
      sizes: [
        { name: "Mały", count: "1 protea, 4 róże, storczyk, hortensja", price: 195 },
        { name: "Średni", count: "1 protea, 6 róż, storczyk, 2 hortensje, lilia", price: 245 },
        { name: "Duży", count: "2 protee, 9 róż, 2 storczyki, 3 hortensje, lilie", price: 320 },
      ],
    },
    "czerwien-ktora-nie-prosi": {
      tag: "Wiązany",
      title: "Czerwień, która nie prosi o pozwolenie",
      desc: "Trzydzieści czerwonych róż związanych jedną wstążką, otulonych eukaliptusem i paprocią. Bukiet, który nie potrzebuje okazji — sam nią jest.",
      sizes: [
        { name: "Mały", count: "ok. 18 róż, eukaliptus, paproć", price: 220 },
        { name: "Średni", count: "ok. 30 róż, eukaliptus, paproć", price: 320 },
        { name: "Duży", count: "ok. 45 róż, eukaliptus, paproć", price: 430 },
      ],
    },
    "cisza-w-donicy": {
      tag: "Kompozycja",
      title: "Cisza w donicy",
      desc: "Jeden kwiat storczyka, garść liści i gałązka bruni — więcej przestrzeni niż kwiatów. Dla kogoś, kto woli ciszę od tłumu.",
      sizes: [
        { name: "Mały", count: "1 storczyk, garść liści", price: 145 },
        { name: "Średni", count: "1 storczyk, liście egzotyczne, gałązka bruni", price: 180 },
        { name: "Duży", count: "2 storczyki, więcej liści i gałązek", price: 235 },
      ],
    },
  };

  var CUSTOM_SIZE = {
    name: "Specjalny",
    count: "Powiedz nam, o co chodzi — dopasujemy kwiaty i cenę.",
    custom: true,
  };

  // All products share the same three tiers (Mały/Średni/Duży) in order, so the
  // flower graphic scales the same way regardless of which bouquet is open —
  // custom orders default to the medium scale since no size is committed yet.
  var SIZE_SCALE = [0.68, 0.85, 1];
  var CUSTOM_SCALE = 0.85;

  var FULFILLMENT = [
    { id: "odbior", name: "Odbiór osobisty", desc: "W pracowni przy alei Niepodległości 15A, Żórawina.", fee: 0 },
    { id: "dowoz", name: "Dowóz do domu", desc: "W Żórawinie i okolicach Wrocławia, w trzygodzinnym oknie.", fee: 15, freeAbove: 250 },
    { id: "kwiatomat", name: "Kwiatomat", desc: "Odbiór 24/7 z automatu przy stacji — idealny na niedziele.", fee: 0 },
  ];

  var modal = document.getElementById("bukiet-modal");
  if (!modal) return;

  var dialog = modal.querySelector(".modal__dialog");
  var elImg = modal.querySelector("[data-modal-img]");
  var elTag = modal.querySelector("[data-modal-tag]");
  var elTitle = modal.querySelector("[data-modal-title]");
  var elDesc = modal.querySelector("[data-modal-desc]");
  var elSizes = modal.querySelector("[data-modal-sizes]");
  var elFulfillment = modal.querySelector("[data-modal-fulfillment]");
  var elSizeDetail = modal.querySelector("[data-modal-size-detail]");
  var elFulfillmentDetail = modal.querySelector("[data-modal-fulfillment-detail]");
  var elPrice = modal.querySelector("[data-modal-price]");
  var elSummaryNote = modal.querySelector("[data-modal-summary-note]");
  var elNote = modal.querySelector("[data-modal-note]");
  var actionsStandard = modal.querySelector("[data-modal-actions-standard]");
  var actionsCustom = modal.querySelector("[data-modal-actions-custom]");
  var cartBtn = modal.querySelector("[data-modal-cart]");
  var checkoutBtn = modal.querySelector("[data-modal-checkout]");
  var inquiryLink = modal.querySelector("[data-modal-inquiry]");

  var activeProductId = null;
  var activeSizeIndex = 1; // default to "Średni"
  var activeFulfillmentIndex = 0; // default to pickup — never adds a fee
  var lastFocused = null;
  var noteTimer = null;

  function money(n) {
    return n + " zł";
  }

  function isCustomActive(product) {
    return activeSizeIndex === product.sizes.length;
  }

  function computeTotal(product) {
    if (isCustomActive(product)) return null;
    var base = product.sizes[activeSizeIndex].price;
    var fulfillment = FULFILLMENT[activeFulfillmentIndex];
    var fee = fulfillment.fee && !(fulfillment.freeAbove && base >= fulfillment.freeAbove) ? fulfillment.fee : 0;
    return { base: base, fee: fee, total: base + fee };
  }

  function renderSizes(product) {
    elSizes.querySelectorAll(".modal__pill").forEach(function (el) { el.remove(); });
    var allOptions = product.sizes.concat([CUSTOM_SIZE]);
    allOptions.forEach(function (size, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "modal__pill" + (size.custom ? " modal__pill--custom" : "");
      btn.setAttribute("role", "radio");
      btn.textContent = size.name;
      btn.setAttribute("aria-checked", i === activeSizeIndex ? "true" : "false");
      btn.addEventListener("click", function () {
        activeSizeIndex = i;
        updateSelection(product);
      });
      elSizes.appendChild(btn);
    });
  }

  function renderFulfillment() {
    elFulfillment.querySelectorAll(".modal__pill").forEach(function (el) { el.remove(); });
    FULFILLMENT.forEach(function (method, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "modal__pill";
      btn.setAttribute("role", "radio");
      btn.textContent = method.name;
      btn.setAttribute("aria-checked", i === activeFulfillmentIndex ? "true" : "false");
      btn.addEventListener("click", function () {
        activeFulfillmentIndex = i;
        updateSelection(PRODUCTS[activeProductId]);
      });
      elFulfillment.appendChild(btn);
    });
  }

  function updateFulfillmentActive() {
    elFulfillment.querySelectorAll(".modal__pill").forEach(function (btn, i) {
      var isActive = i === activeFulfillmentIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });
    var method = FULFILLMENT[activeFulfillmentIndex];
    elFulfillmentDetail.textContent = method.desc;
  }

  function updateSelection(product) {
    var buttons = elSizes.querySelectorAll(".modal__pill");
    buttons.forEach(function (btn, i) {
      var isActive = i === activeSizeIndex;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });
    updateFulfillmentActive();

    var custom = isCustomActive(product);
    var scale = custom ? CUSTOM_SCALE : SIZE_SCALE[activeSizeIndex];
    elImg.style.transform = "scale(" + scale + ")";

    actionsStandard.hidden = custom;
    actionsCustom.hidden = !custom;

    if (custom) {
      elSizeDetail.innerHTML = CUSTOM_SIZE.count;
      elPrice.textContent = "Wycena indywidualna";
      elSummaryNote.textContent = "";
      var subject = encodeURIComponent("Zapytanie o wycenę — " + product.title);
      var body = encodeURIComponent(
        "Cześć! Chciał(a)bym zapytać o wycenę bukietu \"" + product.title + "\" — potrzebuję czegoś nietypowego. " +
        "Sposób odbioru: " + FULFILLMENT[activeFulfillmentIndex].name + "."
      );
      inquiryLink.href = "mailto:czesc@zielnik.pl?subject=" + subject + "&body=" + body;
    } else {
      var size = product.sizes[activeSizeIndex];
      var totals = computeTotal(product);
      elSizeDetail.innerHTML = size.count + ' — <span class="modal__group-price">' + money(size.price) + "</span>";
      elPrice.textContent = money(totals.total);
      if (totals.fee > 0) {
        elSummaryNote.textContent = "W tym " + money(totals.fee) + " za dowóz (gratis od 250 zł).";
      } else if (FULFILLMENT[activeFulfillmentIndex].id === "dowoz") {
        elSummaryNote.textContent = "Dowóz gratis od 250 zł.";
      } else {
        elSummaryNote.textContent = "";
      }
    }
  }

  function openModal(trigger) {
    var id = trigger.getAttribute("data-product");
    var product = PRODUCTS[id];
    if (!product) return;

    activeProductId = id;
    activeSizeIndex = 1;
    activeFulfillmentIndex = 0;
    lastFocused = trigger;

    var img = trigger.querySelector("img");
    if (img) {
      elImg.src = img.src;
      elImg.alt = img.alt;
    }
    elTag.textContent = product.tag;
    elTitle.textContent = product.title;
    elDesc.textContent = product.desc;
    elNote.textContent = "";

    renderSizes(product);
    renderFulfillment();
    updateSelection(product);

    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add("is-open"); });
    document.body.classList.add("modal-open");
    dialog.focus();

    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onKeydown);
    window.setTimeout(function () { modal.hidden = true; }, 200);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      var focusable = dialog.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  document.querySelectorAll("[data-product]").forEach(function (trigger) {
    trigger.addEventListener("click", function () { openModal(trigger); });
    // Non-<button> triggers (the spread articles) need manual Enter/Space activation —
    // real <button> katalog cards already get this natively and would double-fire.
    if (trigger.tagName !== "BUTTON") {
      trigger.addEventListener("keydown", function (e) {
        if (e.target !== trigger) return; // ignore keydowns bubbling up from the nested quick-add button
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(trigger);
        }
      });
    }
  });

  modal.querySelectorAll("[data-modal-dismiss]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  // ---- cart (client-side only — this site has no payment backend; "checkout"
  // means finishing the order by phone or email, same as every other CTA here) ----
  var CART_KEY = "zielnik-cart";

  function readCart() {
    try {
      return JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(cart) {
    try {
      sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      // sessionStorage unavailable (private mode etc.) — badge just won't persist across reloads.
    }
    updateCartBadge(cart.length);
  }

  function updateCartBadge(count) {
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = String(count);
      el.hidden = count === 0;
    });
  }

  function addToCart() {
    var product = PRODUCTS[activeProductId];
    var size = product.sizes[activeSizeIndex];
    var totals = computeTotal(product);
    var fulfillment = FULFILLMENT[activeFulfillmentIndex];
    var cart = readCart();
    cart.push({ title: product.title, size: size.name, fulfillment: fulfillment.name, price: totals.total });
    writeCart(cart);
    return size;
  }

  function flashNote(text) {
    elNote.textContent = text;
    if (noteTimer) window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(function () { elNote.textContent = ""; }, 3500);
  }

  cartBtn.addEventListener("click", function () {
    var size = addToCart();
    flashNote("Dodano do koszyka: " + PRODUCTS[activeProductId].title + " (" + size.name + ").");
  });

  checkoutBtn.addEventListener("click", function () {
    addToCart();
    closeModal();
    var kontakt = document.getElementById("kontakt");
    if (kontakt) kontakt.scrollIntoView({ behavior: "smooth" });
  });

  inquiryLink.addEventListener("click", function () {
    window.setTimeout(closeModal, 50);
  });

  // ---- quick-add: the small cart icon on every card/spread, for adding the
  // default ("Średni") size + pickup straight from the list, no modal needed ----
  var CHECK_ICON =
    '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  document.querySelectorAll("[data-quick-add]").forEach(function (btn) {
    var originalIcon = btn.innerHTML;
    var originalLabel = btn.getAttribute("aria-label");
    var resetTimer = null;

    btn.addEventListener("click", function (e) {
      e.stopPropagation(); // don't also open the modal on the parent card
      var product = PRODUCTS[btn.getAttribute("data-quick-add")];
      if (!product) return;
      var size = product.sizes[1]; // "Średni" — same default as the modal, pickup, no fee
      var cart = readCart();
      cart.push({ title: product.title, size: size.name, fulfillment: FULFILLMENT[0].name, price: size.price });
      writeCart(cart);

      btn.classList.add("is-added");
      btn.innerHTML = CHECK_ICON;
      btn.setAttribute("aria-label", "Dodano do koszyka");
      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        btn.classList.remove("is-added");
        btn.innerHTML = originalIcon;
        btn.setAttribute("aria-label", originalLabel);
      }, 1400);
    });
  });

  updateCartBadge(readCart().length);
})();
