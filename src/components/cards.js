const MIN_CARDS = 3;
const stage = document.getElementById("stage");

const cards = JSON.parse(stage.dataset.projects);
while (cards.length < MIN_CARDS) cards.push({ title: "Coming soon", soon: true });
cards.forEach(c => { if (!c.image) c.soon = true; });

let active = Math.floor((cards.length - 1) / 2);

const els = cards.map((c, i) => {
  const el = document.createElement(c.soon ? "div" : "a");
  el.className = "card" + (c.soon ? " soon" : "");
  if (!c.soon) el.href = c.url;
  el.innerHTML =
    (c.image ? `<img src="${c.image}" alt="">` : `<span class="loading">LOADING...</span>`) +
    `<span class="label">${c.title}</span>`;
  el.addEventListener("click", e => {
    if (i !== active) { e.preventDefault(); active = i; layout(); }
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

const go = d => { active = Math.max(0, Math.min(cards.length - 1, active + d)); layout(); };

addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});
let wheelLock = 0;
addEventListener("wheel", e => {
  if (Date.now() - wheelLock < 350) return;
  wheelLock = Date.now();
  go(Math.sign(e.deltaY || e.deltaX));
});
let sx = null;
addEventListener("touchstart", e => sx = e.touches[0].clientX);
addEventListener("touchend", e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  sx = null;
});
addEventListener("resize", layout);

layout();
