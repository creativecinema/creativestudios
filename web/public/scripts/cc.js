/* ============================================================================
   CreativeCinema — geteilte Interaktionen
   Alles graceful: respektiert prefers-reduced-motion, funktioniert ohne JS.
   ========================================================================== */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Scroll-Fortschritt (rote Linie) + Nav-Schatten ------------------- */
  var progress = document.querySelector(".progress");
  var nav = document.querySelector("nav.site");
  function onScroll() {
    if (progress) {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile-Navigation ------------------------------------------------ */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Hero: Kulissen-Wechsler mit Lichtsweep (Signature) --------------- */
  var chips = document.querySelectorAll(".chip");
  var backs = document.querySelectorAll(".backdrop");
  var wall = document.querySelector(".wall");
  if (chips.length && backs.length) {
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        if (c.classList.contains("active")) return;
        chips.forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
        c.classList.add("active"); c.setAttribute("aria-pressed", "true");
        if (wall && !reduced) {
          wall.classList.remove("sweeping"); void wall.offsetWidth; wall.classList.add("sweeping");
        }
        backs.forEach(function (b) { b.classList.toggle("active", b.dataset.bd === c.dataset.target); });
      });
    });
  }

  /* ---- Hero: Pointer-Glow (Spotlight folgt der Maus) -------------------- */
  var glow = document.querySelector(".wall .glow");
  if (glow && wall && !reduced && window.matchMedia("(pointer:fine)").matches) {
    wall.addEventListener("pointermove", function (e) {
      var r = wall.getBoundingClientRect();
      glow.style.left = (e.clientX - r.left) + "px";
      glow.style.top = (e.clientY - r.top) + "px";
    });
  }

  /* ---- Live-Timecode (HH:MM:SS:FF, 25 fps) ------------------------------ */
  var tc = document.getElementById("timecode");
  if (tc && !reduced) {
    var f = 0;
    setInterval(function () {
      f = (f + 1) % 25;
      var d = new Date();
      tc.textContent = [d.getHours(), d.getMinutes(), d.getSeconds()]
        .map(function (n) { return String(n).padStart(2, "0"); }).join(":") + ":" + String(f).padStart(2, "0");
    }, 40);
  }

  /* ---- Count-up für Proof-Zahlen ---------------------------------------- */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    if (reduced) { el.firstChild && (el.childNodes[0].nodeValue = String(target)); return; }
    var dur = 1100, start = null;
    var numNode = el.childNodes[0];
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      numNode.nodeValue = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---- IntersectionObserver: Reveal + Count-up -------------------------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("vis");
        e.target.querySelectorAll && e.target.querySelectorAll("[data-count]").forEach(countUp);
        if (e.target.hasAttribute && e.target.hasAttribute("data-count")) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.14 });
    document.querySelectorAll(".reveal, [data-count]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("vis"); });
    document.querySelectorAll("[data-count]").forEach(countUp);
  }

  /* ---- Loaded-State (Failsafe zum Inline-Head-Script) ------------------ */
  window.addEventListener("load", function () { document.body.classList.add("loaded"); });

  /* ---- Scrollytelling-Bühne: Kulissen per Scroll durchscrubben -------- */
  (function () {
    var section = document.querySelector(".scenes");
    if (!section) return;
    var scenes = section.querySelectorAll(".scene");
    var ticks = section.querySelectorAll(".scene-rail button");
    var idxEl = section.querySelector("[data-scene-index]");
    var nowEl = section.querySelector("[data-scene-now]");
    var descEl = section.querySelector("[data-scene-desc]");
    var data = Array.prototype.map.call(scenes, function (s) {
      return { num: s.dataset.num, name: s.dataset.name, desc: s.dataset.desc };
    });
    var n = scenes.length, cur = -1;
    function setScene(i) {
      if (i === cur) return; cur = i;
      scenes.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      ticks.forEach(function (t, k) { t.setAttribute("aria-current", k === i ? "true" : "false"); });
      if (idxEl) idxEl.textContent = data[i].num;
      if (nowEl) nowEl.textContent = data[i].name;
      if (descEl) descEl.textContent = data[i].desc;
    }
    setScene(0);
    if (reduced) return;                       // statisch: nur erste Szene
    section.style.minHeight = (n * 100) + "vh"; // Tall-Parent → Scrub-Strecke
    function onScrollScenes() {
      var rect = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      var p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      setScene(Math.min(n - 1, Math.floor(p * n)));
    }
    window.addEventListener("scroll", onScrollScenes, { passive: true });
    onScrollScenes();
    ticks.forEach(function (t, k) {
      t.addEventListener("click", function () {
        var top = section.offsetTop + (k + 0.5) / n * (section.offsetHeight - window.innerHeight);
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  })();

  /* ---- Vorher/Nachher-Slider (Drag + Tastatur via range) -------------- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var input = ba.querySelector("input[type=range]");
    if (!input) return;
    function apply() { ba.style.setProperty("--pos", input.value + "%"); }
    input.addEventListener("input", apply); apply();
  });

  /* ---- Magnetische Buttons (nur feiner Zeiger) ------------------------ */
  if (!reduced && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = "translate(" + (e.clientX - (r.left + r.width / 2)) * 0.18 + "px," +
          (e.clientY - (r.top + r.height / 2)) * 0.3 + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---- Showreel-Lightbox (Play -> Overlay; nimmt MP4/Stream auf) ------- */
  (function () {
    var triggers = document.querySelectorAll(".play-btn, [data-lightbox]");
    if (!triggers.length) return;
    var box, inner, lastFocus;
    function build() {
      box = document.createElement("div");
      box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
      box.innerHTML = '<div class="lightbox-inner"><button class="lightbox-close" aria-label="Schließen">×</button><div class="lightbox-ph"></div></div>';
      document.body.appendChild(box);
      inner = box.querySelector(".lightbox-inner");
      box.addEventListener("click", function (e) { if (e.target === box) close(); });
      box.querySelector(".lightbox-close").addEventListener("click", close);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("open")) close(); });
    }
    function open(src) {
      if (!box) build();
      var ph = inner.querySelector(".lightbox-ph");
      var old = inner.querySelector("video,iframe"); if (old) old.remove();
      if (src) {
        var v = document.createElement("video");
        v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
        inner.insertBefore(v, ph); ph.style.display = "none";
      } else {
        ph.style.display = "";
        ph.innerHTML = '<span class="mono" style="color:var(--led)">Showreel-Slot</span><p class="ph-note">Hier wird euer Showreel eingebunden – ein MP4 oder Stream-Link genügt.</p>';
      }
      lastFocus = document.activeElement;
      box.classList.add("open"); box.querySelector(".lightbox-close").focus();
    }
    function close() {
      box.classList.remove("open");
      var v = inner.querySelector("video"); if (v) v.pause();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) { e.preventDefault(); open(t.getAttribute("data-video")); });
    });
  })();
})();
