/* Répétition espacée (variante de SM-2) : les mots moins bien maîtrisés reviennent plus souvent */
const SRS = {
  DAY: 864e5,
  get(id) {
    const s = Store.state.words;
    return s[id] || (s[id] = { ef: 2.5, iv: 0, due: 0, reps: 0, lapses: 0, ok: 0, ko: 0, mine: false, seen: 0, last: 0 });
  },
  /* q : 5 = parfait, 4 = bon avec hésitation, 2 = erreur */
  grade(id, q) {
    if (!id || !Data.words[id]) return;
    const r = SRS.get(id), now = Date.now();
    r.seen++; r.last = now;
    if (q >= 3) {
      r.ok++;
      r.reps++;
      r.iv = r.reps === 1 ? 1 : r.reps === 2 ? 3 : Math.round(r.iv * r.ef);
      r.ef = Math.max(1.3, r.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
      r.due = now + r.iv * SRS.DAY;
    } else {
      r.ko++; r.lapses++;
      r.reps = 0; r.iv = 0;
      r.ef = Math.max(1.3, r.ef - 0.2);
      r.due = now + 10 * 60 * 1000; // revient dans 10 minutes
    }
  },
  /* Simple exposition (présentation) : programme une première révision */
  seen(id) {
    const r = SRS.get(id);
    if (!r.seen) { r.due = Date.now() + 6 * 3600 * 1000; }
    r.seen++;
  },
  toggleMine(id) { const r = SRS.get(id); r.mine = !r.mine; Store.save(); return r.mine; },
  isMine(id) { return !!(Store.state.words[id] && Store.state.words[id].mine); },
  strength(id) {
    const r = Store.state.words[id]; if (!r || !r.seen) return 0;
    return Math.max(0.05, Math.min(1, (r.iv || 0.3) / 21));
  },
  learned() { return Object.entries(Store.state.words).filter(([, r]) => r.ok > 0).map(([id]) => id); },
  mastered() { return Object.entries(Store.state.words).filter(([, r]) => r.iv >= 21).length; },
  /* Mots à réviser maintenant, les plus fragiles d'abord */
  dueList(limit) {
    const now = Date.now();
    const list = Object.entries(Store.state.words)
      .filter(([id, r]) => Data.words[id] && r.seen && r.due <= now)
      .sort((a, b) => (a[1].ef - b[1].ef) || (a[1].due - b[1].due))
      .map(([id]) => id);
    return limit ? list.slice(0, limit) : list;
  },
  /* À défaut, les mots les plus faibles */
  weakest(n) {
    return Object.entries(Store.state.words).filter(([id, r]) => Data.words[id] && r.seen)
      .sort((a, b) => (a[1].ef - b[1].ef) || (b[1].ko - a[1].ko)).slice(0, n).map(([id]) => id);
  }
};
