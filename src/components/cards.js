const PAD = 2;
const stage = document.getElementById("stage");
const section = document.getElementById("projects");

const projects = JSON.parse(stage.dataset.projects);
const ghost = () => Array.from({ length: PAD }, () => ({ title: "Coming soon", soon: true }));
const cards = [...ghost(), ...projects, ...ghost()];

let active = PAD;

const range = () => section.offsetHeight - innerHeight;

const activeFromScroll = () => {
  const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range()));
  return PAD + Math.round(p * (projects.length - 1));
};

const scrollToCard = i => {
  const k = i - PAD;
  if (k < 0 || k >= projects.length) return;
  const top = section.getBoundingClientRect().top + scrollY;
  scrollTo({ top: top + range() * (k / Math.max(1, projects.length - 1)), behavior: "smooth" });
};

const els = cards.map((c, i) => {
  const el = document.createElement(c.soon || !c.url ? "div" : "a");
  el.className = "card" + (c.soon ? " soon" : "");
  if (!c.soon && c.url) el.href = c.url;
  el.innerHTML =
    (c.image ? `<img src="${c.image}" alt="">` : c.soon ? `<span class="loading">LOADING...</span>` : "") +
    `<span class="label">${c.title}</span>`;
  el.addEventListener("click", e => {
    if (i !== active) { e.preventDefault(); scrollToCard(i); }
    else if (c.soon) e.preventDefault();
  });
  stage.appendChild(el);
  return el;
});

function layout() {
  const w = els[0].offsetWidth;
  const narrow = innerWidth < 700;
  const opacity = narrow ? [1, 0.45] : [1, 0.8, 0.35];
  const step = narrow ? w * 0.95 : Math.min(w * 1.25, (innerWidth - w) / 2 / Math.max(1, Math.min(2, cards.length / 2)));
  const tilt = narrow ? 7 : 9;
  els.forEach((el, i) => {
    const d = i - active, a = Math.abs(d);
    el.classList.toggle("active", d === 0);
    el.style.setProperty("--s", d === 0 ? 1.2 : 1);
    el.style.setProperty("--x", `${d * step + Math.sign(d) * w * 0.1}px`);
    el.style.setProperty("--y", `${a * a * w * 0.12 + (d ? w * 0.1 : 0)}px`);
    el.style.setProperty("--r", `${Math.sign(d) * Math.min(a, 3) * tilt + Math.sign(d) * 1}deg`);
    el.style.setProperty("--o", opacity[a] ?? 0);
    el.style.setProperty("--z", 10 - a);
    el.style.pointerEvents = a >= opacity.length ? "none" : "";
  });
}

section.style.setProperty("--cards", projects.length);

const MAX_TILT = 5;
const clampTilt = deg => Math.max(-MAX_TILT, Math.min(MAX_TILT, deg));

addEventListener("pointermove", e => {
  if (e.pointerType !== "mouse") return;
  const el = els[active], r = el.getBoundingClientRect();
  const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
  const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
  els.forEach(c => { c.style.setProperty("--tx", "0deg"); c.style.setProperty("--ty", "0deg"); });
  el.style.setProperty("--tx", `${clampTilt(-dy * 10)}deg`);
  el.style.setProperty("--ty", `${clampTilt(dx * 10)}deg`);
}, { passive: true });

let locked = false;

const sync = () => {
  const a = activeFromScroll();
  if (a === active) return;
  active = a;
  layout();
};

let ticking = false;
addEventListener("scroll", () => {
  if (ticking || locked) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; if (!locked) sync(); });
}, { passive: true });

addEventListener("resize", () => {
  if (!locked) active = activeFromScroll();
  layout();
});

addEventListener("fan:lock", e => {
  locked = true;
  active = e.detail === "last" ? PAD + projects.length - 1 : PAD;
  layout();
});

addEventListener("fan:unlock", () => {
  locked = false;
  sync();
});

active = activeFromScroll();
layout();
