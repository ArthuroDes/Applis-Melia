/* Petites fonctions utilitaires */
const U = {
  $(sel, root) { return (root || document).querySelector(sel); },
  $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); },
  esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
  slug(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); },
  shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  sample(a, n) { return U.shuffle(a).slice(0, n); },
  pick(a) { return a[Math.floor(Math.random() * a.length)]; },
  uniq(a) { return Array.from(new Set(a)); },
  dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  daysBetween(a, b) { return Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5); },
  /* Normalisation pour comparer des réponses */
  norm(s) {
    return String(s || '').toLowerCase()
      .replace(/[’`]/g, "'")
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\(.*?\)/g, ' ')
      .replace(/[^a-z0-9' ]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  },
  words(s) { return U.norm(s).split(' ').filter(Boolean); },
  lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i), cur = new Array(n + 1);
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      [prev, cur] = [cur, prev];
    }
    return prev[n];
  },
  /* Similarité 0..1 entre deux chaînes (caractères) */
  sim(a, b) { a = U.norm(a); b = U.norm(b); if (!a && !b) return 1; return 1 - U.lev(a, b) / Math.max(a.length, b.length); },
  /* Compare une réponse à plusieurs variantes acceptées : 'exact' | 'typo' | false */
  check(answer, accepted) {
    const a = U.norm(U.expandContractions(answer));
    let best = 0;
    for (const acc of [].concat(accepted)) {
      for (const variant of U.variants(acc)) {
        const v = U.norm(U.expandContractions(variant));
        if (a === v) return 'exact';
        const d = U.lev(a, v), tol = v.length <= 4 ? 0 : v.length <= 9 ? 1 : Math.max(2, Math.floor(v.length * 0.08));
        if (d <= tol) best = Math.max(best, 1);
      }
    }
    return best ? 'typo' : false;
  },
  /* "Aeroplane / Airplane" → ["Aeroplane","Airplane"], "Tyre (UK) / Tire (US)" → ... */
  variants(s) {
    const parts = String(s).split(/\s\/\s|\//).map(p => p.trim()).filter(Boolean);
    const out = [s];
    parts.forEach(p => { out.push(p); out.push(p.replace(/\(.*?\)/g, '').trim()); });
    if (/^to /i.test(s)) out.push(s.replace(/^to /i, ''));
    return U.uniq(out.filter(Boolean));
  },
  expandContractions(s) {
    return String(s || '').replace(/[’`]/g, "'")
      .replace(/\bcan't\b/gi, 'cannot').replace(/\bwon't\b/gi, 'will not').replace(/n't\b/gi, ' not')
      .replace(/'re\b/gi, ' are').replace(/'ll\b/gi, ' will').replace(/'ve\b/gi, ' have').replace(/\bI'm\b/gi, 'I am')
      .replace(/\b(it|he|she|that|there|what|where)'s\b/gi, '$1 is').replace(/'d\b/gi, ' would');
  },
  /* Libellé principal d'un mot (sans parenthèses ni variantes) */
  main(s) { return String(s).split(/\s\/\s/)[0].replace(/\s*\(.*?\)\s*/g, ' ').trim(); },
  /* Découpe une phrase en jetons pour les exercices de remise en ordre */
  tokens(s) { return String(s).replace(/[.?!]$/, '').split(/\s+/).filter(Boolean); },
  toast(msg, ms) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.remove(), ms || 2200);
  },
  modal(html, onMount) {
    const bg = document.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = '<div class="modal" role="dialog">' + html + '</div>';
    bg.addEventListener('click', e => { if (e.target === bg) bg.remove(); });
    document.body.appendChild(bg);
    const close = () => bg.remove();
    if (onMount) onMount(bg.firstChild, close);
    return close;
  },
  download(name, text, type) {
    const blob = new Blob([text], { type: type || 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  },
  fmtMin(m) { m = Math.round(m); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0'); }
};
