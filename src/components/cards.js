const PAD = 2;
const stage = document.getElementById("stage");
const section = document.getElementById("projects");

const projects = JSON.parse(stage.dataset.projects);
const ghost = () => Array.from({ length: PAD }, () => ({ title: "Coming soon", soon: true }));
const cards = [...ghost(), ...projects, ...ghost()];
cards.forEach(c => { if (!c.image && !c.description) c.soon = true; });

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
    (c.image ? `<img src="${c.image}" alt="">` : c.description ? `<span class="desc">${c.description}</span>` : `<span class="loading">LOADING...</span>`) +
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
  const step = Math.min(w * 1.25, (innerWidth - w) / 2 / Math.max(1, Math.min(2, cards.length / 2)));
  els.forEach((el, i) => {
    const d = i - active, a = Math.abs(d);
    el.classList.toggle("active", d === 0);
    el.style.setProperty("--s", d === 0 ? 1.2 : 1);
    el.style.setProperty("--x", `${d * step + Math.sign(d) * w * 0.1}px`);
    el.style.setProperty("--y", `${a * a * w * 0.12 + (d ? w * 0.1 : 0)}px`);
    el.style.setProperty("--r", `${Math.sign(d) * Math.min(a, 3) * 9 + Math.sign(d) * 1}deg`);
    el.style.setProperty("--o", [1, 0.8, 0.35][a] ?? 0);
    el.style.setProperty("--z", 10 - a);
    el.style.pointerEvents = a > 2 ? "none" : "";
  });
}


section.style.setProperty("--cards", projects.length);

addEventListener("pointermove", e => {
  const el = els[active], r = el.getBoundingClientRect();
  const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
  const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
  els.forEach(c => { c.style.setProperty("--tx", "0deg"); c.style.setProperty("--ty", "0deg"); });
  el.style.setProperty("--tx", `${-dy * 14}deg`);
  el.style.setProperty("--ty", `${dx * 14}deg`);
}, { passive: true });

let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const a = activeFromScroll();
    if (a !== active) { active = a; layout(); }
  });
}, { passive: true });
addEventListener("resize", () => { active = activeFromScroll(); layout(); });

active = activeFromScroll();
layout();
