(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll reveal
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, (i % 6) * 60);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Hero video: respect reduced-motion, and don't fight autoplay restrictions
  var coverVideo = document.querySelector(".cover__video");
  if (coverVideo) {
    if (reduceMotion) {
      coverVideo.pause();
      coverVideo.removeAttribute("autoplay");
    } else {
      coverVideo.play().catch(function () {
        // Autoplay blocked (rare with muted video) — poster image stays visible.
      });
    }
  }

  // Gallery hover: beyond the tile's own pop-out scale, the photo inside
  // gently tracks the cursor as it moves across it — a soft "camera drift"
  // rather than a static zoom. Mouse-only: there's no cursor to track on touch.
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".gallery__item").forEach(function (item) {
      var img = item.querySelector("img");
      if (!img) return;
      var raf = null;

      item.addEventListener("mousemove", function (e) {
        var rect = item.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        var panX = relX * -16; // px — image drifts opposite the cursor, revealing that side
        var panY = relY * -16;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          img.style.transform = "scale(1.1) translate(" + panX.toFixed(1) + "px, " + panY.toFixed(1) + "px)";
        });
      });

      item.addEventListener("mouseleave", function () {
        if (raf) cancelAnimationFrame(raf);
        img.style.transform = "";
      });
    });
  }

  // Mobile nav toggle
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
