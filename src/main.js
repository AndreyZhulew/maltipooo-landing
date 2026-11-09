import { PUPPIES, REVIEWS, FAQ, QUIZ, CREDITS, GALLERY, REELS } from "./data.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = (n) => `${n.toLocaleString("ru-RU")} ₽`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const WA = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.6 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.4z" /></svg>';
const PAGE = 6;

/* ==========================================================================
   Reels carousel — the card nearest the center is enlarged
   ========================================================================== */
const reels = $("[data-reels]");
reels.innerHTML = [...REELS, ...REELS].map((f) => `<figure class="reel"><img src="/img/${f}" alt="Щенок мальтипу" loading="lazy" /></figure>`).join("");
function markCenter() {
  const mid = reels.getBoundingClientRect().left + reels.clientWidth / 2;
  let best, dist = Infinity;
  $$(".reel", reels).forEach((r) => {
    const b = r.getBoundingClientRect();
    const d = Math.abs(b.left + b.width / 2 - mid);
    if (d < dist) { dist = d; best = r; }
  });
  $$(".reel", reels).forEach((r) => r.classList.toggle("is-center", r === best));
}
let reelRaf;
reels.addEventListener("scroll", () => { cancelAnimationFrame(reelRaf); reelRaf = requestAnimationFrame(markCenter); }, { passive: true });
const reelStep = () => $(".reel", reels).getBoundingClientRect().width + parseFloat(getComputedStyle(reels).columnGap || 16);
$("[data-reels-prev]").addEventListener("click", () => reels.scrollBy({ left: -reelStep(), behavior: "smooth" }));
$("[data-reels-next]").addEventListener("click", () => reels.scrollBy({ left: reelStep(), behavior: "smooth" }));
requestAnimationFrame(() => {
  // start on the 3rd card so there are neighbours on both sides
  const third = $$(".reel", reels)[3];
  reels.scrollLeft = third.offsetLeft - (reels.clientWidth - third.offsetWidth) / 2;
  markCenter();
});

/* Gallery */
$("[data-gallery]").innerHTML = GALLERY.map((f) => `<figure class="reveal"><img src="/img/${f}" alt="Щенок мальтипу" loading="lazy" /></figure>`).join("");

/* ==========================================================================
   Catalog
   ========================================================================== */
const STATUS = { available: "В наличии", reserved: "Забронирован", sold: "Продан" };
const statusLabel = (p) => (p.sex === "girl" && p.status !== "available" ? STATUS[p.status] + "а" : STATUS[p.status]);
const title = (p) => `Щенок мальтипу, ${p.sex === "boy" ? "мальчик" : "девочка"} ${esc(p.name)} | ${esc(p.age)}`;

function pupCard(p) {
  const free = p.status === "available";
  const g = p.sex === "girl" ? "а" : "";
  return `
  <article class="pup pup--${p.status} reveal" data-id="${p.id}" data-sex="${p.sex}" data-status="${p.status}">
    <div class="pup__media" data-pup-open>
      <img src="${p.photo}" alt="${title(p)}" loading="lazy" width="600" height="570" />
      <span class="status status--${p.status}">${statusLabel(p)}</span>
    </div>
    <div class="pup__body">
      <h3 class="pup__title">${title(p)}</h3>
      <ul class="pup__list">
        <li>Окрас: ${esc(p.color)}</li>
        <li>Пол: ${p.sex === "boy" ? "мальчик" : "девочка"}</li>
        <li>Взрослый вес: ${esc(p.weight)}</li>
        <li>Привит${g} · чипирован${g}</li>
      </ul>
      <p class="pup__price${free ? "" : " pup__price--muted"}">${free ? `${rub(p.price)}<span>+ подарок</span>` : p.status === "sold" ? "Уже в новой семье" : "Ожидает переезда"}</p>
      <div class="pup__foot">
        <button class="btn btn--soft" data-pup-more="${p.id}">Подробнее</button>
        ${free
          ? `<button class="btn btn--primary" data-reserve="${p.id}">Забронировать</button><a href="#" class="pup__wa" aria-label="Спросить в WhatsApp">${WA}</a>`
          : `<button class="btn btn--line" data-open-modal data-topic="Похожий щенок: ${esc(p.name)}">Хочу похожего</button>`}
      </div>
    </div>
  </article>`;
}

const pupsEl = $("[data-pups]");
const moreBtn = $("[data-load-more]");
pupsEl.innerHTML = PUPPIES.map(pupCard).join("");
$("[data-updated]").textContent = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

let filter = "all";
let limit = PAGE;
const FILTERS = {
  all: () => true,
  boy: (el) => el.dataset.sex === "boy",
  girl: (el) => el.dataset.sex === "girl",
  available: (el) => el.dataset.status === "available",
};
function renderCatalog(animateFrom = 0) {
  let shown = 0;
  const matches = $$(".pup", pupsEl).filter((el) => FILTERS[filter](el));
  $$(".pup", pupsEl).forEach((el) => {
    const visible = matches.includes(el) && shown < limit;
    if (visible) shown++;
    el.classList.toggle("is-hidden", !visible);
    if (visible && shown > animateFrom && !reduceMotion) {
      el.classList.add("is-in");
      el.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: (shown - animateFrom - 1) * 60, easing: "cubic-bezier(0.22,0.8,0.24,1)", fill: "backwards" });
    }
  });
  moreBtn.hidden = matches.length <= limit;
}
$("[data-filters]").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  $$("button", e.currentTarget).forEach((x) => x.setAttribute("aria-selected", x === b));
  filter = b.dataset.filter;
  limit = PAGE;
  renderCatalog(0);
});
moreBtn.addEventListener("click", () => {
  const from = limit;
  limit += PAGE;
  renderCatalog(from);
});
renderCatalog(PAGE);

/* Puppy detail */
function openPup(id) {
  const p = PUPPIES.find((x) => x.id === id);
  if (!p) return;
  const free = p.status === "available";
  $("[data-pup-detail]").innerHTML = `
    <div class="pupd__media"><img src="${p.photo}" alt="${title(p)}" /><span class="status status--${p.status}">${statusLabel(p)}</span></div>
    <div class="pupd__body">
      <h2 class="pupd__title" id="pup-title">${title(p)}</h2>
      <p class="pupd__about">${esc(p.about)}</p>
      <dl class="pupd__rows">
        <div><dt>Возраст</dt><dd>${esc(p.age)}</dd></div>
        <div><dt>Пол</dt><dd>${p.sex === "boy" ? "мальчик" : "девочка"}</dd></div>
        <div><dt>Окрас</dt><dd>${esc(p.color)}</dd></div>
        <div><dt>Взрослый вес</dt><dd>${esc(p.weight)}</dd></div>
      </dl>
      <ul class="pupd__incl"><li>ветпаспорт</li><li>прививки</li><li>чип</li><li>договор</li><li>подарочный набор</li></ul>
      ${free ? `<p class="pupd__price">${rub(p.price)} <small>· бронь по договору</small></p>` : ""}
      <div class="pupd__cta">
        ${free
          ? `<button class="btn btn--primary btn--lg btn--block" data-reserve="${p.id}">Забронировать</button>
             <button class="btn btn--line btn--block" data-open-modal data-topic="Видеозвонок: ${esc(p.name)}" data-pup="${p.id}">Посмотреть по видеосвязи</button>`
          : `<button class="btn btn--primary btn--lg btn--block" data-open-modal data-topic="Похожий щенок: ${esc(p.name)}">Хочу похожего малыша</button>`}
      </div>
    </div>`;
  openModal("pup");
}
pupsEl.addEventListener("click", (e) => {
  const t = e.target.closest("[data-pup-open], [data-pup-more]");
  if (t) openPup(t.dataset.pupMore || t.closest(".pup").dataset.id);
});

/* ==========================================================================
   Quiz — step-by-step price calculator
   ========================================================================== */
const quiz = $("[data-quiz]");
const stage = $("[data-quiz-stage]", quiz);
const bar = $("[data-quiz-bar]", quiz);
const stepLbl = $("[data-quiz-step]", quiz);
const prevBtn = $("[data-quiz-prev]", quiz);
const nextBtn = $("[data-quiz-next]", quiz);
const answers = {};
let qi = 0;

stage.innerHTML =
  QUIZ.map((q, i) => `
  <div class="quiz__q${i ? " is-pre" : ""}" data-q="${i}" ${i ? "inert" : ""}>
    <h3>${esc(q.q)}</h3>
    <div class="opts" role="radiogroup">
      ${q.options.map((o) => `<label class="opt"><input type="radio" name="quiz-${q.name}" value="${esc(o)}" /><span class="opt__dot"></span>${esc(o)}</label>`).join("")}
    </div>
  </div>`).join("") +
  `<div class="quiz__q is-pre" data-q="${QUIZ.length}" inert>
    <h3>Расчёт готов! Куда его прислать?</h3>
    <p>Подберём 2–3 подходящих щенков и пришлём видео с точной стоимостью и доставкой.</p>
    <div data-form-slot="quiz"></div>
  </div>`;

function showQ(i) {
  qi = i;
  $$(".quiz__q", stage).forEach((el, j) => {
    el.classList.toggle("is-out", j < i);
    el.classList.toggle("is-pre", j > i);
    el.toggleAttribute("inert", j !== i);
  });
  const last = i === QUIZ.length;
  bar.style.width = `${((i + 1) / (QUIZ.length + 1)) * 100}%`;
  stepLbl.textContent = last ? "Последний шаг" : `Шаг ${i + 1} из ${QUIZ.length}`;
  prevBtn.hidden = i === 0;
  nextBtn.hidden = last;
  nextBtn.disabled = !last && !answers[QUIZ[i].name];
}
stage.addEventListener("change", (e) => {
  const q = QUIZ[qi];
  if (!q || e.target.name !== `quiz-${q.name}`) return;
  answers[q.name] = e.target.value;
  nextBtn.disabled = false;
  setTimeout(() => qi < QUIZ.length && answers[QUIZ[qi].name] && showQ(qi + 1), 380);
});
nextBtn.addEventListener("click", () => showQ(qi + 1));
prevBtn.addEventListener("click", () => showQ(Math.max(qi - 1, 0)));

/* ==========================================================================
   Reviews — photo cards next to the rating summary
   ========================================================================== */
const revs = $("[data-revs]");
const revCount = $("[data-rev-count]");
revs.innerHTML = REVIEWS.map((r) => `
  <article class="rev">
    <div class="rev__media"><img src="${r.photo}" alt="${esc(r.pup)} в новой семье" loading="lazy" /><span class="rev__pup">🐾 ${esc(r.pup)}</span></div>
    <div class="rev__body">
      <div class="rev__top"><span class="stars" aria-label="5 из 5">★★★★★</span><span class="rev__date">${esc(r.date)}</span></div>
      <p class="rev__text">${esc(r.text)}</p>
      <div class="rev__author"><span class="rev__avatar" aria-hidden="true">${esc(r.name[0])}</span><span><b>${esc(r.name)}</b><small>${esc(r.city)}</small></span><span class="rev__src">${esc(r.source)}</span></div>
    </div>
  </article>`).join("");
const revStep = () => revs.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(revs).columnGap);
const revIndex = () => Math.round(revs.scrollLeft / revStep());
const updateRevCount = () => { revCount.textContent = `${Math.min(revIndex() + 1, REVIEWS.length)} / ${REVIEWS.length}`; };
$("[data-rev-prev]").addEventListener("click", () => revs.scrollBy({ left: -revStep() }));
$("[data-rev-next]").addEventListener("click", () => {
  // wrap to the first card after the end
  const atEnd = revs.scrollLeft + revs.clientWidth >= revs.scrollWidth - 4;
  atEnd ? revs.scrollTo({ left: 0 }) : revs.scrollBy({ left: revStep() });
});
revs.addEventListener("scroll", () => requestAnimationFrame(updateRevCount), { passive: true });
updateRevCount();

/* FAQ */
$("[data-faq]").innerHTML = FAQ.map(([q, a], i) => `
  <div class="acc__item reveal${i === 0 ? " is-open" : ""}">
    <button class="acc__q" aria-expanded="${i === 0}">${esc(q)}<span class="acc__plus" aria-hidden="true"></span></button>
    <div class="acc__a"><div><p>${esc(a)}</p></div></div>
  </div>`).join("");
$("[data-faq]").addEventListener("click", (e) => {
  const q = e.target.closest(".acc__q");
  if (!q) return;
  const open = !q.parentElement.classList.contains("is-open");
  q.parentElement.classList.toggle("is-open", open);
  q.setAttribute("aria-expanded", open);
});

/* Photo credits */
$("[data-credits]").innerHTML = "Временные фото: Wikimedia Commons — " + CREDITS.map(([, t, a, l, u]) => `<a href="${u}" target="_blank" rel="noopener">«${esc(t)}»</a>, ${esc(a)}, ${l}`).join("; ") + ".";
$("[data-credits-toggle]").addEventListener("click", (e) => {
  e.preventDefault();
  $("[data-credits]").hidden = !$("[data-credits]").hidden;
});

/* ==========================================================================
   Reveal on scroll + counters
   ========================================================================== */
function countUp(el) {
  const to = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) return;
  const t0 = performance.now();
  const tick = (t) => {
    const k = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(to * (1 - (1 - k) ** 3)) + suffix;
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }),
  { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
);
$$(".reveal").forEach((el) => {
  const sibs = $$(":scope > .reveal", el.parentElement);
  el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 5) * 0.07}s`);
  io.observe(el);
});
io.observe($("[data-timeline]"));

/* ==========================================================================
   Header, menu, floating WhatsApp
   ========================================================================== */
const header = $("[data-header]");
const wa = $(".wa-float");
const hero = $(".hero");
const onScroll = () => {
  header.classList.toggle("is-scrolled", scrollY > 8);
  wa.classList.toggle("is-shown", scrollY > hero.offsetHeight * 0.5);
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = $("[data-burger]");
const nav = $("[data-nav]");
const setMenu = (open) => {
  burger.setAttribute("aria-expanded", open);
  nav.classList.toggle("is-open", open);
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ==========================================================================
   Lead forms (inline, modal, quiz)
   ========================================================================== */
const forms = {};
$$("[data-form-slot]").forEach((slot) => {
  slot.append($("#lead-form").content.cloneNode(true));
  forms[slot.dataset.formSlot] = $("form", slot);
  initForm(forms[slot.dataset.formSlot], slot.dataset.formSlot);
});

/** Replace with a real request (CRM / Telegram bot / email); throw on failure. */
async function submitLead(data) {
  console.info("lead", data);
  await new Promise((r) => setTimeout(r, 700));
}

function maskPhone(input) {
  input.addEventListener("input", () => {
    let d = input.value.replace(/\D/g, "");
    if (!d) return void (input.value = "");
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    input.value = "+7" + (p[0] ? ` (${p[0]}` : "") + (p[0].length === 3 ? ")" : "") + (p[1] ? ` ${p[1]}` : "") + (p[2] ? `-${p[2]}` : "") + (p[3] ? `-${p[3]}` : "");
  });
}

function initForm(form, kind) {
  const { name, phone, consent } = form.elements;
  maskPhone(phone);
  form.addEventListener("input", (e) => e.target.closest(".field, .check")?.classList.remove("is-error"));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const checks = [
      [name, name.value.trim().length > 1],
      [phone, phone.value.replace(/\D/g, "").length === 11],
      [consent, consent.checked],
    ];
    checks.forEach(([el, ok]) => el.closest(".field, .check").classList.toggle("is-error", !ok));
    const bad = checks.find(([, ok]) => !ok);
    if (bad) return bad[0].focus();

    const data = Object.fromEntries(new FormData(form));
    if (kind === "quiz") Object.assign(data, { topic: "Калькулятор стоимости", ...answers });
    const label = $(".lead__submit-text", form);
    const text = label.textContent;
    form.classList.add("is-sending");
    label.textContent = "Отправляем…";
    try {
      await submitLead(data);
      form.classList.add("is-done");
      form.closest(".modal__panel")?.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      form.classList.remove("is-sending");
      label.textContent = text;
    }
  });
}

/* ==========================================================================
   Modals (panels open from scale 0.95)
   ========================================================================== */
const modals = Object.fromEntries($$("[data-modal]").map((m) => [m.dataset.modal, m]));
let lastFocus = null;

function openModal(kind, trigger) {
  const m = modals[kind];
  if (kind === "lead") {
    const f = forms.modal;
    if (f.classList.contains("is-done")) { f.reset(); f.classList.remove("is-done"); }
    $$(".is-error", f).forEach((el) => el.classList.remove("is-error"));
    const id = trigger?.dataset.reserve || trigger?.dataset.pup;
    const p = PUPPIES.find((x) => x.id === id);
    const card = $("[data-modal-pup]", m);
    card.hidden = !p;
    if (p) card.innerHTML = `<img src="${p.photo}" alt="" /><span><b>${esc(p.name)}</b><small>${esc(p.age)} · ${esc(p.color)} · ${rub(p.price)}</small></span>`;
    $("[data-modal-title]", m).textContent = trigger?.dataset.reserve
      ? `Бронь щенка: ${p.name}`
      : trigger?.dataset.topic?.startsWith("Видео") ? "Покажем щенка по видео" : "Подберём щенка для вас";
    f.elements.topic.value = trigger?.dataset.reserve ? "Бронь" : trigger?.dataset.topic || "Подбор щенка";
    f.elements.puppy.value = p?.name || "";
    setTimeout(() => f.elements.name.focus({ preventScroll: true }), 350);
  }
  Object.values(modals).forEach((x) => x !== m && x.classList.remove("is-open"));
  if (!document.body.classList.contains("is-locked")) lastFocus = document.activeElement;
  m.classList.add("is-open");
  m.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}
function closeModal() {
  Object.values(modals).forEach((m) => { m.classList.remove("is-open"); m.setAttribute("aria-hidden", "true"); });
  document.body.classList.remove("is-locked");
  lastFocus?.focus({ preventScroll: true });
  lastFocus = null;
}

document.addEventListener("click", (e) => {
  const reserve = e.target.closest("[data-reserve]");
  const opener = e.target.closest("[data-open-modal]");
  if (reserve || opener) {
    e.preventDefault();
    setMenu(false);
    openModal("lead", reserve || opener);
  }
  if (e.target.closest("[data-close-modal]")) closeModal();
});
document.addEventListener("keydown", (e) => {
  const open = Object.values(modals).find((m) => m.classList.contains("is-open"));
  if (!open) return;
  if (e.key === "Escape") return closeModal();
  if (e.key !== "Tab") return;
  const f = $$("button, input, a[href]", $(".modal__panel", open)).filter((el) => el.offsetParent && !el.closest(".lead__done") && el.type !== "hidden");
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
  else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
});

showQ(0);
