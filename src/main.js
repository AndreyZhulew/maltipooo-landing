import { PUPPIES, REVIEWS, FAQ, QUIZ, CREDITS } from "./data.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rub = (n) => `${n.toLocaleString("ru-RU")} ₽`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
const plural = (n, [one, few, many]) => {
  const a = n % 10, b = n % 100;
  return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 12 || b > 14) ? few : many;
};
const isMini = (p) => /до 2(,5)? кг/.test(p.weight);
const ARR = '<span class="btn__arr" aria-hidden="true">↗</span>';

/* ==========================================================================
   Fit giant lines to the content column width
   ========================================================================== */
function fit() {
  $$("[data-fit]").forEach((el) => {
    const box = el.parentElement;
    const cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    // measure the text's own width, not the block's
    el.style.width = "max-content";
    el.style.fontSize = "100px";
    const w = el.getBoundingClientRect().width;
    el.style.fontSize = `${Math.floor(((100 * avail) / w) * 10) / 10}px`;
    el.style.width = "";
  });
}
fit();
document.fonts?.ready.then(fit);
let fitRaf;
addEventListener("resize", () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fit); });

/* ==========================================================================
   Catalog — puppy "passport" cards
   ========================================================================== */
const stampFor = (p) =>
  p.status === "reserved"
    ? `<span class="stamp stamp--reserved">забронирован${p.sex === "girl" ? "а" : ""}${p.reservedBy ? `<small>${esc(p.reservedBy)}</small>` : ""}</span>`
    : p.status === "home"
      ? '<span class="stamp stamp--home">нашёл дом ♥</span>'
      : "";

function pupCard(p, i) {
  const free = p.status === "available";
  return `
  <article class="pup pup--${p.status} reveal" data-id="${p.id}" data-sex="${p.sex}" data-mini="${isMini(p)}" data-status="${p.status}">
    <div class="pup__media" data-pup-open>
      <img src="${p.photo}" alt="Щенок мальтипу ${esc(p.name)}" loading="lazy" width="600" height="570" />
      <span class="pup__no">№ ${String(i + 1).padStart(2, "0")}</span>
      <span class="pup__sex pup__sex--${p.sex}" aria-label="${p.sex === "boy" ? "Мальчик" : "Девочка"}">${p.sex === "boy" ? "♂" : "♀"}</span>
      ${stampFor(p)}
    </div>
    <div class="pup__body">
      <div class="pup__top"><h3 class="pup__name">${esc(p.name)}</h3><span class="pup__age">${esc(p.age)}</span></div>
      <dl class="pup__rows">
        <div><dt>окрас</dt><dd>${esc(p.color)}</dd></div>
        <div><dt>взрослый вес</dt><dd>${esc(p.weight)}</dd></div>
        <div><dt>документы</dt><dd>прививки · чип</dd></div>
      </dl>
      <div class="pup__foot">
        ${free
          ? `<p class="pup__price">${rub(p.price)}<small>+ подарочный набор</small></p><button class="btn btn--ink btn--sm" data-reserve="${p.id}">Бронь ${ARR}</button>`
          : `<p class="pup__note">${p.status === "home" ? "Уже радует свою семью" : "Встаньте в очередь на похожего"}</p><button class="btn btn--line btn--sm" data-open-modal data-topic="Похожий щенок: ${esc(p.name)}">Похожий</button>`}
      </div>
    </div>
  </article>`;
}

const pupsEl = $("[data-pups]");
pupsEl.innerHTML = PUPPIES.map(pupCard).join("");

const available = PUPPIES.filter((p) => p.status === "available").length;
$("[data-available-count]").textContent = `${available}`;
$("[data-available-word]").textContent = plural(available, ["щенок", "щенка", "щенков"]);
$("[data-updated]").textContent = `обновлено ${new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}`;

const FILTERS = {
  all: () => true,
  boy: (el) => el.dataset.sex === "boy",
  girl: (el) => el.dataset.sex === "girl",
  mini: (el) => el.dataset.mini === "true",
  available: (el) => el.dataset.status === "available",
};
$("[data-filters]").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  $$("button", e.currentTarget).forEach((x) => x.setAttribute("aria-selected", x === b));
  let k = 0;
  $$(".pup", pupsEl).forEach((el) => {
    const show = FILTERS[b.dataset.filter](el);
    el.classList.toggle("is-hidden", !show);
    if (show && !reduceMotion) {
      el.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: k++ * 50, easing: "cubic-bezier(0.22,0.8,0.24,1)", fill: "backwards" });
    }
  });
});

/* Puppy detail */
function openPup(id) {
  const p = PUPPIES.find((x) => x.id === id);
  if (!p) return;
  const free = p.status === "available";
  $("[data-pup-detail]").innerHTML = `
    <div class="pupd__media"><img src="${p.photo}" alt="Щенок мальтипу ${esc(p.name)}" />${stampFor(p)}</div>
    <div class="pupd__body">
      <h2 class="pupd__name" id="pup-title">${esc(p.name)} ${p.sex === "boy" ? "♂" : "♀"}</h2>
      <p class="pupd__about">${esc(p.about)}</p>
      <dl class="pupd__rows">
        <div><dt>возраст</dt><dd>${esc(p.age)}</dd></div>
        <div><dt>пол</dt><dd>${p.sex === "boy" ? "мальчик" : "девочка"}</dd></div>
        <div><dt>окрас</dt><dd>${esc(p.color)}</dd></div>
        <div><dt>взрослый вес</dt><dd>${esc(p.weight)}</dd></div>
      </dl>
      <ul class="pupd__incl"><li>ветпаспорт</li><li>прививки</li><li>чип</li><li>договор</li><li>гарантия 1 год</li><li>подарок 🎁</li></ul>
      ${free ? `<p class="pupd__price">${rub(p.price)} <small>· бронь по договору</small></p>` : ""}
      <div class="pupd__cta">
        ${free
          ? `<button class="btn btn--accent btn--lg btn--block" data-reserve="${p.id}">Забронировать ${esc(p.name)} ${ARR}</button>
             <button class="btn btn--line btn--block" data-open-modal data-topic="Видеозвонок: ${esc(p.name)}" data-pup="${p.id}">Посмотреть по видеосвязи</button>`
          : `<button class="btn btn--accent btn--lg btn--block" data-open-modal data-topic="Похожий щенок: ${esc(p.name)}">Хочу похожего малыша ${ARR}</button>`}
      </div>
    </div>`;
  openModal("pup");
}
pupsEl.addEventListener("click", (e) => {
  const m = e.target.closest("[data-pup-open]");
  if (m) openPup(m.closest(".pup").dataset.id);
});

/* ==========================================================================
   Chat quiz — breeder asks, visitor taps replies
   ========================================================================== */
const log = $("[data-chat-log]");
const reply = $("[data-chat-reply]");
const answers = {};
let chatStarted = false;

function push(html, who = "bot", extra = "") {
  const el = document.createElement("div");
  el.className = `msg msg--${who} ${extra}`;
  el.innerHTML = html;
  log.append(el);
  log.scrollTop = log.scrollHeight;
  return el;
}
async function botSay(html, extra) {
  const t = push('<span class="typing" aria-label="печатает"><i></i><i></i><i></i></span>', "bot");
  t.style.padding = "0";
  await wait(700);
  t.remove();
  return push(html, "bot", extra);
}
function offer(options) {
  reply.innerHTML = options.map((o, i) => `<button style="--i:${i}">${esc(o)}</button>`).join("");
  return new Promise((resolve) => {
    reply.onclick = (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      reply.onclick = null;
      reply.innerHTML = "";
      push(esc(b.textContent), "me");
      resolve(b.textContent);
    };
  });
}
async function runChat() {
  if (chatStarted) return;
  chatStarted = true;
  await botSay("Здравствуйте! Я Анна, заводчик 🐾 Помогу подобрать щенка — всего 4 вопроса.");
  for (const q of QUIZ) {
    await botSay(esc(q.q));
    answers[q.name] = await offer(q.options);
  }
  await botSay("Отлично, уже вижу 2–3 подходящих малышей! Куда прислать видео и расчёт?");
  const slot = push('<div data-form-slot="quiz"></div>', "bot", "msg--form");
  mountForm($("[data-form-slot]", slot), "quiz");
  log.scrollTop = log.scrollHeight;
}
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { runChat(); o.disconnect(); } }, { threshold: 0.4 }).observe($("[data-chat]"));

/* ==========================================================================
   Reviews — taped polaroids, drag to scroll
   ========================================================================== */
const revs = $("[data-revs]");
revs.innerHTML = REVIEWS.map(
  (r, i) => `
  <article class="rev" style="--rot:${[-2.5, 1.8, -1.2, 2.4][i % 4]}deg">
    <img src="${r.photo}" alt="" loading="lazy" width="600" height="600" draggable="false" />
    <p class="rev__name">${esc(r.name)} <small>· ${esc(r.city)}</small></p>
    <p class="rev__text">${esc(r.text)}</p>
  </article>`
).join("");
const step = () => revs.firstElementChild.getBoundingClientRect().width + 28;
$("[data-rev-prev]").addEventListener("click", () => revs.scrollBy({ left: -step() }));
$("[data-rev-next]").addEventListener("click", () => revs.scrollBy({ left: step() }));
let drag = null;
revs.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") drag = { x: e.clientX, s: revs.scrollLeft }; });
addEventListener("pointermove", (e) => {
  if (!drag) return;
  revs.classList.add("is-drag");
  revs.scrollLeft = drag.s - (e.clientX - drag.x);
});
addEventListener("pointerup", () => { drag = null; revs.classList.remove("is-drag"); });

/* ==========================================================================
   FAQ
   ========================================================================== */
$("[data-faq]").innerHTML = FAQ.map(
  ([q, a], i) => `
  <div class="acc__item reveal${i === 0 ? " is-open" : ""}">
    <button class="acc__q" aria-expanded="${i === 0}"><span class="acc__n">${String(i + 1).padStart(2, "0")}</span><span class="acc__t">${esc(q)}</span><span class="acc__plus" aria-hidden="true"></span></button>
    <div class="acc__a"><div><p>${esc(a)}</p></div></div>
  </div>`
).join("");
$("[data-faq]").addEventListener("click", (e) => {
  const q = e.target.closest(".acc__q");
  if (!q) return;
  const open = !q.parentElement.classList.contains("is-open");
  q.parentElement.classList.toggle("is-open", open);
  q.setAttribute("aria-expanded", open);
});

/* Marquee: duplicate content for a seamless loop */
const mq = $("[data-marquee]");
mq.innerHTML += mq.innerHTML;

/* Photo credits */
$("[data-credits]").innerHTML = "Временные фото: Wikimedia Commons — " + CREDITS.map(([, t, a, l, u]) => `<a href="${u}" target="_blank" rel="noopener">«${esc(t)}»</a>, ${esc(a)}, ${l}`).join("; ") + ".";
$("[data-credits-toggle]").addEventListener("click", (e) => {
  e.preventDefault();
  $("[data-credits]").hidden = !$("[data-credits]").hidden;
});

/* ==========================================================================
   Reveal on scroll
   ========================================================================== */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    io.unobserve(e.target);
  }),
  { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
);
$$(".reveal").forEach((el) => {
  const sibs = $$(":scope > .reveal", el.parentElement);
  el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 5) * 0.08}s`);
  io.observe(el);
});

/* ==========================================================================
   Header, menu, mobile dock
   ========================================================================== */
const header = $("[data-header]");
const dock = $("[data-dock]");
const hero = $(".hero");
const onScroll = () => {
  header.classList.toggle("is-scrolled", scrollY > 8);
  dock.classList.toggle("is-shown", scrollY > hero.offsetHeight * 0.6);
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = $("[data-burger]");
const nav = $("[data-nav]");
const setMenu = (open) => {
  burger.setAttribute("aria-expanded", open);
  nav.classList.toggle("is-open", open);
  header.classList.toggle("is-menu", open);
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ==========================================================================
   Lead forms (inline, modal, chat)
   ========================================================================== */
const forms = {};
function mountForm(slot, kind) {
  slot.append($("#lead-form").content.cloneNode(true));
  const f = $("form", slot);
  forms[kind] = f;
  initForm(f, kind);
}
$$("[data-form-slot]").forEach((slot) => mountForm(slot, slot.dataset.formSlot));

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
    if (kind === "quiz") Object.assign(data, { topic: "Подбор в чате", ...answers });
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
    $("[data-modal-title]", m).innerHTML = trigger?.dataset.reserve
      ? `бронь: <em>${esc(p.name.toLowerCase())}</em>`
      : trigger?.dataset.topic?.startsWith("Видео") ? "покажем щенка <em>по видео</em>" : "подберём <em>щенка</em>";
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
