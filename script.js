'use strict';
/* ===== Core (pure, testable in Node) ===== */
const AD = {'٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9','۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'};
// Canonical decimal string: no Number/parseInt. Returns {id} or {err}.
function normalize(raw) {
  let s = String(raw == null ? '' : raw).replace(/[\u200e\u200f\u202a-\u202e\s]/g, '').replace(/[٠-٩۰-۹]/g, c => AD[c]);
  if (!s) return { err: 'empty' };
  if (!/^[0-9]+$/.test(s)) return { err: 'invalid' };
  s = s.replace(/^0+/, '');
  return s ? { id: s } : { err: 'zero' };
}
// Exact +1 on a decimal string.
function inc(s) {
  const a = s.split(''); let i = a.length - 1;
  while (i >= 0) { if (a[i] === '9') { a[i] = '0'; i--; } else { a[i] = String.fromCharCode(a[i].charCodeAt(0) + 1); return a.join(''); } }
  return '1' + a.join('');
}
// Hash of the COMPLETE id string -> 4 seeds (cyrb128). Identity is the string itself; hash only drives attributes.
function hash(s) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0; i < s.length; i++) { const k = s.charCodeAt(i); h1 = h2 ^ Math.imul(h1 ^ k, 597399067); h2 = h3 ^ Math.imul(h2 ^ k, 2869860233); h3 = h4 ^ Math.imul(h3 ^ k, 951274213); h4 = h1 ^ Math.imul(h4 ^ k, 2716044179); }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067); h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233); h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213); h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}
function rng(a, b, c, d) { return () => { a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; let t = (a + b) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); d = (d + 1) | 0; t = (t + d) | 0; c = (c + t) | 0; return (t >>> 0) / 4294967296; }; }
const FN = [['نور','Nour'],['ريحان','Rayhan'],['سلسبيل','Salsabil'],['لؤلؤة','Lulua'],['زمرد','Zumurrud'],['فجر','Fajr'],['ياسمين','Yasmin'],['سكينة','Sakina'],['جمان','Juman'],['غيداء','Ghayda'],['مرجان','Marjan'],['رضوى','Radwa'],['هدى','Huda'],['بشرى','Bushra'],['سحاب','Sahab'],['أنهار','Anhar']];
const EP = [['الصفاء','Safa'],['الضياء','Diya'],['الظلال','Zilal'],['الندى','Nada'],['الأصيل','Aseel'],['الأفق','Ufuq'],['الجداول','Jadawil'],['الأقواس','Aqwas'],['الغدير','Ghadir'],['الغيم','Ghaym'],['الزهر','Zahr'],['السكون','Sukun']];
const ENV = [
  ['حديقة الزمرد','Emerald garden',150,'حديقة هادئة تجري فيها جداول صافية بين أشجار وارفة.','A quiet garden of clear streams between leafy trees.'],
  ['فناء مضيء','Luminous courtyard',170,'فناء رخامي تغمره أنوار ناعمة وتتوسطه نافورة.','A marble courtyard bathed in soft light, a fountain at its centre.'],
  ['أروقة الأقواس','Arched walkways',185,'أروقة من الأقواس الرشيقة تطل على ماء ساكن.','Graceful arched walkways overlooking still water.'],
  ['بحيرة اللآلئ','Pearl lake',200,'بركة ساكنة تعكس سماءً صافية بتفاصيل لؤلؤية.','A calm pool reflecting a clear sky with pearl-like details.'],
  ['جناح الزخارف','Geometric pavilion',165,'جناح تزيّنه زخارف هندسية دقيقة وقبة هادئة.','A pavilion with fine geometric ornament and a gentle dome.'],
  ['شرفة الأصيل','Evening terrace',215,'شرفة تطل على سماء مضيئة وحدائق ممتدة.','A terrace facing a luminous sky and wide gardens.']];
const TL = [['تصوّر فني خيالي.','An imaginative artistic impression.'],['مشهد مستوحى من وصف الجنة بالخيال.','A scene loosely inspired by descriptions of Paradise.'],['لوحة رقمية تأملية.','A contemplative digital painting.'],['رسم زخرفي هادئ.','A calm ornamental drawing.']];
function art(r, e, hue, uid) {
  const H = hue + ((r() * 30 - 15) | 0), g = 'g' + uid, sx = (40 + r() * 240) | 0;
  let s = `<svg viewBox="0 0 320 168" preserveAspectRatio="xMidYMid slice" role="img" aria-label="تصوّر فني خيالي: ${ENV[e][0]}"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${H + 30},70%,${r() < .5 ? 80 : 70}%)"/><stop offset="1" stop-color="hsl(${H},55%,35%)"/></linearGradient><linearGradient id="${g}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${H + 40},75%,60%)"/><stop offset="1" stop-color="hsl(${H + 60},70%,25%)"/></linearGradient></defs><rect width="320" height="168" fill="url(#${g})"/><circle cx="${sx}" cy="${(28 + r() * 30) | 0}" r="${(12 + r() * 10) | 0}" fill="#fffbe8" opacity=".9"/>`;
  s += `<path d="M0 105Q80 ${70 + r() * 20 | 0} 160 100T320 95V168H0Z" fill="hsl(${H},45%,28%)" opacity=".8"/>`;
  if (e === 1 || e === 2) { const n = 2 + (r() * 2 | 0), w = 320 / n; for (let i = 0; i < n; i++) s += `<path d="M${i * w + 8} 128V80a${w / 2 - 8} ${w / 2 - 8} 0 0 1 ${w - 16} 0V128Z" fill="hsl(${H},30%,92%)" opacity=".55" stroke="#f5f1e6" stroke-width="2"/>`; }
  else if (e === 3 || e === 4) { const cx = (90 + r() * 140) | 0; s += `<rect x="${cx - 38}" y="92" width="76" height="40" fill="hsl(${H},25%,90%)"/><path d="M${cx - 42} 92a42 42 0 0 1 84 0Z" fill="hsl(${H + 20},60%,45%)" stroke="#d9b45a" stroke-width="2"/>`; if (e === 4) s += `<path d="M${cx} 100l5 9 10-1-6 8 6 8-10-1-5 9-5-9-10 1 6-8-6-8 10 1z" fill="#d9b45a"/>`; }
  else for (let i = 0; i < 6; i++) { const x = (r() * 300 + 10) | 0, y = 100 + (r() * 24 | 0); s += `<rect x="${x - 2}" y="${y}" width="4" height="22" fill="#3a2a1a"/><circle cx="${x}" cy="${y - 4}" r="${14 + r() * 10 | 0}" fill="hsl(${H - 10 + r() * 20 | 0},60%,${26 + r() * 14 | 0}%)"/>`; }
  return s + `<path d="M0 130H320V168H0Z" fill="url(#${g}w)"/><path d="M0 142q20-6 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0" fill="none" stroke="#fff" opacity=".4" stroke-width="2"/></svg>`;
}
function makeProfile(id) {
  const h = hash(id), r = rng(h[0], h[1], h[2], h[3]), f = FN[r() * FN.length | 0], p = EP[r() * EP.length | 0], e = r() * ENV.length | 0, t = TL[r() * TL.length | 0], en = ENV[e];
  return { id, env: e, ar: { name: f[0] + ' ' + p[0], desc: en[3] + ' ' + t[0], envName: en[0] }, en: { name: f[1] + ' ' + p[1], desc: en[4] + ' ' + t[1] },
    user: (f[1] + '.' + p[1] + '.' + id).toLowerCase(), svg: art(r, e, en[2], h[0].toString(36)) };
}
// Exact username -> profile (username embeds the full id after the last dot).
function userToId(u) {
  const n = normalize(String(u).trim().split('.').pop()); if (!n.id) return null;
  return makeProfile(n.id).user === String(u).trim().toLowerCase() ? n.id : null;
}
if (typeof module !== 'undefined') module.exports = { normalize, inc, makeProfile, userToId, hash };

/* ===== Browser app ===== */
if (typeof document !== 'undefined') (function () {
  const $ = id => document.getElementById(id), feed = $('feed'), dock = $('dock');
  const BATCH = 300, AHEAD = 200, GAP = 14, CH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ch')) || 450, MINW = 290, OVER = 2;
  let ids = [], base = 0, startId = '1', next = '1', epoch = 0, busy = false, blocked = 0, fails = 0;
  let cols = 1, cw = 300, RH = 464, lastVis = 0, vel = 0, hl = null, hlT = 0, raf = 0;
  const mounted = new Map(), tr = new Set(), cache = new Map(), tick = () => new Promise(r => setTimeout(r));
  const P = id => { let p = cache.get(id); if (!p) { p = makeProfile(id); cache.set(id, p); if (cache.size > 4000) cache.delete(cache.keys().next().value); } return p; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ready = () => base + ids.length;

  function layout() {
    const W = feed.clientWidth || innerWidth; RH = CH() + GAP; cols = Math.max(1, Math.floor((W + GAP) / (MINW + GAP))); cw = (W + GAP) / cols;
    mounted.forEach(e => e.remove()); mounted.clear(); sizeFeed();
  }
  function sizeFeed() { feed.style.height = Math.ceil(ids.length / cols) * RH + 'px'; }
  function card(i) {
    const p = P(ids[i - base]), t = tr.has(p.id), L = t ? p.en : p.ar, el = document.createElement('article'), k = i - base;
    el.className = 'card' + (p.id === hl ? ' hl' : ''); el.dataset.i = i; el.dataset.id = p.id;
    el.style.cssText = `top:${Math.floor(k / cols) * RH}px;inset-inline-start:${(k % cols) * cw}px;width:${cw - GAP}px`;
    el.setAttribute('aria-posinset', k + 1); el.setAttribute('aria-setsize', -1);
    el.innerHTML = `<div class="art">${p.svg}</div><h2 class="nm" ${t ? 'lang="en" dir="ltr"' : ''}>${esc(L.name)}</h2><p class="ds" ${t ? 'lang="en" dir="ltr"' : ''}>${esc(L.desc)}</p><div class="idb"><span>المعرّف</span><b>${p.id}</b></div><div class="un" dir="ltr" aria-label="اسم المستخدم">${esc(p.user)}</div><div class="ac"><button type="button" class="tr" aria-pressed="${t}">${t ? 'العودة إلى العربية' : 'الترجمة إلى الإنجليزية'}</button><button type="button" class="cp">نسخ المعرّف</button></div>`;
    return el;
  }
  function update() {
    raf = 0; const rel = -feed.getBoundingClientRect().top, vh = innerHeight;
    const a = base + Math.max(0, Math.floor((rel - OVER * RH) / RH)) * cols, b = Math.min(ready() - 1, base + (Math.floor((rel + vh + OVER * RH) / RH) + 1) * cols - 1);
    mounted.forEach((el, i) => { if (i < a || i > b) { el.remove(); mounted.delete(i); } });
    const fr = document.createDocumentFragment();
    for (let i = a; i <= b; i++) if (!mounted.has(i)) { const el = card(i); mounted.set(i, el); fr.append(el); }
    feed.append(fr);
    lastVis = base + (Math.max(0, Math.floor((rel + vh) / RH)) + 1) * cols - 1;
    trim(); ensure();
  }
  // Bounded memory: drop far-behind items, compensate scroll so the view does not move.
  function trim() {
    if (ids.length < 12000 || lastVis - base < 8000) return;
    const K = Math.floor(4000 / cols) * cols; mounted.forEach((el, i) => { if (i < base + K) { el.remove(); mounted.delete(i); } });
    ids.splice(0, K); base += K; sizeFeed(); scrollBy(0, -(K / cols) * RH);
    mounted.forEach(el => { const k = el.dataset.i - base; el.style.top = Math.floor(k / cols) * RH + 'px'; el.style.insetInlineStart = (k % cols) * cw + 'px'; });
  }
  async function batch() {
    if (busy || Date.now() < blocked) return; busy = true; const ep = epoch;
    try {
      for (let k = 0; k < BATCH; k++) {
        if (ep !== epoch) return; ids.push(next); P(next); next = inc(next);
        if (k % 50 === 49) { sizeFeed(); if (k === 49) schedule(); await tick(); }
      }
      fails = 0; sizeFeed(); schedule();
    } catch (e) { fails++; blocked = Date.now() + Math.min(5000, 300 * fails * fails); console.warn('batch failed', e); }
    finally { if (ep === epoch) busy = false; }
    if (ep === epoch) ensure();
  }
  function ensure() { const boost = Math.min(2500, Math.abs(vel) * 700 / RH * cols); if (lastVis + AHEAD + boost >= ready() && !busy) batch(); }
  function schedule() { if (!raf) raf = requestAnimationFrame(update); }

  // scroll: velocity + search dock hide/show (hysteresis)
  let ly = scrollY, lt = performance.now(), acc = 0;
  addEventListener('scroll', () => {
    const y = scrollY, t = performance.now(), dy = y - ly; vel = dy / Math.max(1, t - lt); ly = y; lt = t;
    if (dy * acc < 0) acc = 0; acc += dy;
    if (!$('sform').hidden || y < 40) dock.classList.remove('hide'); else if (acc > 90) dock.classList.add('hide'); else if (acc < -25) dock.classList.remove('hide');
    schedule();
  }, { passive: true });
  let rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { const k = Math.floor(Math.max(0, -feed.getBoundingClientRect().top) / RH) * cols; const w = feed.clientWidth, c = cols; layout(); if (c !== cols || w) scrollTo(0, scrollY + Math.floor(k / cols) * RH - Math.floor(k / c) * (CH() + GAP)); update(); }, 120); });
  new IntersectionObserver(es => { if (es[0].isIntersecting) { ensure(); schedule(); } }, { rootMargin: '1500px' }).observe($('snt'));
  setInterval(() => { if (!document.hidden) { if (Date.now() > blocked) fails = Math.min(fails, 3); schedule(); } }, 700); // watchdog
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));

  // feed actions
  feed.addEventListener('click', e => {
    const c = e.target.closest('.card'); if (!c) return; const id = c.dataset.id, p = P(id);
    if (e.target.closest('.tr')) {
      const on = !tr.has(id); on ? tr.add(id) : tr.delete(id); const L = on ? p.en : p.ar;
      const nm = c.querySelector('.nm'), ds = c.querySelector('.ds'), b = e.target.closest('.tr');
      nm.textContent = L.name; ds.textContent = L.desc;
      for (const n of [nm, ds]) on ? (n.lang = 'en', n.dir = 'ltr') : (n.removeAttribute('lang'), n.removeAttribute('dir'));
      b.setAttribute('aria-pressed', on); b.textContent = on ? 'العودة إلى العربية' : 'الترجمة إلى الإنجليزية';
    } else if (e.target.closest('.cp')) {
      const b = e.target.closest('.cp'), done = ok => { b.textContent = ok ? 'تم النسخ' : 'تعذّر النسخ'; setTimeout(() => b.textContent = 'نسخ المعرّف', 1500); };
      (navigator.clipboard ? navigator.clipboard.writeText(id).then(() => done(1), () => done(0)) : done(0));
    }
  });

  // navigation / search
  function go(id) {
    epoch++; busy = false; blocked = 0; mounted.forEach(e => e.remove()); mounted.clear(); ids = []; base = 0; startId = id; next = id; lastVis = 0;
    hl = id; clearTimeout(hlT); hlT = setTimeout(() => { hl = null; const c = feed.querySelector('.hl'); if (c) c.classList.remove('hl'); }, 5000);
    $('home').hidden = id === '1'; scrollTo(0, feed.offsetTop - 70); batch().then(update);
  }
  const msg = (t, err) => { const m = $('msg'); m.textContent = t; m.className = err ? 'err' : ''; };
  const ERR = { empty: 'اكتب معرّفًا رقميًا أو اسم مستخدم.', invalid: 'المعرّف يجب أن يتكوّن من أرقام عشرية فقط (٠–٩).', zero: 'المعرّف يجب أن يكون عددًا موجبًا.' };
  $('sform').addEventListener('submit', e => {
    e.preventDefault(); const raw = $('q').value.trim(), res = $('res'); res.textContent = '';
    if (!raw) return msg(ERR.empty, 1);
    if (/^[\s\u200e\u200f٠-٩۰-۹0-9]+$/.test(raw)) {
      const n = normalize(raw); if (n.err) return msg(ERR[n.err], 1);
      go(n.id); return msg(`تم الانتقال إلى المعرّف كاملًا (${n.id.length} رقمًا). هذا ملف مُولَّد خوارزميًا.`);
    }
    const u = userToId(raw); if (u) { go(u); return msg('تطابق تام لاسم المستخدم.'); }
    const q = raw.toLowerCase(), hits = []; // partial: only among currently prepared profiles
    for (let i = 0; i < ids.length && hits.length < 8; i++) { const p = P(ids[i]); if (p.ar.name.includes(raw) || p.user.includes(q) || p.en.name.toLowerCase().includes(q)) hits.push(p); }
    if (!hits.length) return msg('لا يوجد اسم مستخدم مطابق تمامًا، ولا تطابق جزئي ضمن الملفات المحمّلة. جرّب معرّفًا رقميًا.', 1);
    msg('تطابق جزئي (ضمن الملفات المحمّلة فقط):');
    hits.forEach(p => { const li = document.createElement('li'), b = document.createElement('button'); b.type = 'button'; b.textContent = p.ar.name + ' — ' + p.id; b.dir = 'auto'; b.onclick = () => go(p.id); li.append(b); res.append(li); });
  });
  const open = o => { $('sform').hidden = !o; $('sbtn').setAttribute('aria-expanded', o); if (o) { dock.classList.remove('hide'); $('q').focus({ preventScroll: true }); } else $('sbtn').focus({ preventScroll: true }); };
  $('sbtn').onclick = () => open($('sform').hidden);
  $('sclose').onclick = () => open(false);
  $('q').addEventListener('keydown', e => { if (e.key === 'Escape') open(false); });
  $('home').onclick = () => { go('1'); };
  $('info').onclick = () => $('dlg').showModal();
  $('rm').addEventListener('change', e => { document.body.classList.toggle('rm', e.target.checked); try { localStorage.setItem('rm', e.target.checked ? '1' : ''); } catch (_) {} });
  try { if (localStorage.getItem('rm')) { $('rm').checked = true; document.body.classList.add('rm'); } } catch (_) {}

  window.__nur = { state: () => ({ ready: ready(), base, mounted: mounted.size, busy, cols, RH, lastVis }) }; // test hook
  layout(); batch().then(update);
  if (!ids.length) schedule();
})();
