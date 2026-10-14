/* ==========================================================
   Carrossel — Aqualand Resort
   Uso: <div class="carousel" data-autoplay="5000"> ... </div>
   - data-autoplay (opcional): intervalo em ms; sem ele, só navegação manual
   - Os indicadores (dots) são gerados automaticamente
   ========================================================== */
(function () {
  "use strict";

  function initCarousel(root) {
    var track = root.querySelector(".carousel__track");
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var prev = root.querySelector(".carousel__btn--prev");
    var next = root.querySelector(".carousel__btn--next");
    var dotsBox = root.querySelector(".carousel__dots");
    var delay = parseInt(root.dataset.autoplay, 10) || 0;

    if (!track || slides.length < 2) {
      // Com uma imagem só, esconde os controles
      [prev, next, dotsBox].forEach(function (el) {
        if (el) el.hidden = true;
      });
      return;
    }

    var index = 0;
    var timer = null;
    var dots = [];

    if (dotsBox) {
      slides.forEach(function (slide, i) {
        var caption = slide.querySelector(".carousel__caption");
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel__dot";
        dot.setAttribute("aria-label", "Ir para " + (caption ? caption.textContent : "imagem " + (i + 1)));
        dot.addEventListener("click", function () {
          goTo(i);
          startAutoplay();
        });
        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    function render() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length; // volta ao início/fim
      render();
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAutoplay() {
      if (!delay) return;
      stopAutoplay();
      timer = setInterval(function () {
        goTo(index + 1);
      }, delay);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(index - 1);
        startAutoplay();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        goTo(index + 1);
        startAutoplay();
      });
    }

    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    // Swipe no mobile
    var startX = 0;
    root.addEventListener(
      "touchstart",
      function (e) {
        startX = e.touches[0].clientX;
        stopAutoplay();
      },
      { passive: true }
    );
    root.addEventListener(
      "touchend",
      function (e) {
        var diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) goTo(diff < 0 ? index + 1 : index - 1);
        startAutoplay();
      },
      { passive: true }
    );

    render();
    startAutoplay();
  }

  function initAll() {
    document.querySelectorAll(".carousel").forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
