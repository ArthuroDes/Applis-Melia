/* Sauvegarde locale de la progression (localStorage) + export / import par fichier */
const Store = {
  KEY: 'aeroenglish.v1',
  state: null,
  defaults() {
    return {
      version: 1,
      created: Date.now(),
      settings: {
        name: '', slow: false, sound: true, autoplay: true, theme: 'auto',
        dailyGoal: 15, reminderTime: '19:00', notify: false,
        voice: '', apiKey: '', aiModel: 'claude-opus-5-5', unlockAll: false, noInterrupt: true
      },
      xp: 0,
      streak: { count: 0, last: '' },
      lessons: {},          // id -> { done, best, stars, date, count }
      start: { aero: 0, conv: 0 }, // index de départ issu du test de positionnement
      placement: {},        // conv/aero -> { level, score, date }
      words: {},            // wordId -> données SRS
      sessions: [],         // { t, min, xp, kind, ref, acc }
      daily: {},            // jour -> { xp, min, sessions }
      onboarded: false
    };
  },
  load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(Store.KEY)); } catch (e) { s = null; }
    const d = Store.defaults();
    if (!s || typeof s !== 'object') s = d;
    s.settings = Object.assign({}, d.settings, s.settings || {});
    for (const k of Object.keys(d)) if (s[k] === undefined) s[k] = d[k];
    Store.state = s;
    return s;
  },
  save() {
    try { localStorage.setItem(Store.KEY, JSON.stringify(Store.state)); }
    catch (e) { console.warn('Sauvegarde impossible', e); }
  },
  exportFile() {
    U.download('aeroenglish-progression-' + U.dayKey() + '.json', JSON.stringify(Store.state, null, 1));
  },
  importText(txt) {
    const s = JSON.parse(txt);
    if (!s || !s.settings || !s.words) throw new Error('Fichier non reconnu');
    localStorage.setItem(Store.KEY, JSON.stringify(s));
    Store.load();
  },
  reset() { localStorage.removeItem(Store.KEY); Store.load(); },

  /* Enregistre une séance (temps actif, XP) et met à jour la série de jours */
  logSession(kind, ref, minutes, xp, acc) {
    const s = Store.state, day = U.dayKey();
    minutes = Math.max(0.2, Math.round(minutes * 10) / 10);
    s.sessions.push({ t: Date.now(), min: minutes, xp, kind, ref, acc });
    if (s.sessions.length > 3000) s.sessions.splice(0, s.sessions.length - 3000);
    const d = s.daily[day] || (s.daily[day] = { xp: 0, min: 0, sessions: 0 });
    d.xp += xp; d.min += minutes; d.sessions += 1;
    s.xp += xp;
    if (s.streak.last !== day) {
      const gap = s.streak.last ? U.daysBetween(s.streak.last, day) : 99;
      s.streak.count = gap === 1 ? s.streak.count + 1 : 1;
      s.streak.last = day;
    }
    Store.save();
  },
  streakAlive() {
    const s = Store.state; if (!s.streak.last) return 0;
    const gap = U.daysBetween(s.streak.last, U.dayKey());
    return gap <= 1 ? s.streak.count : 0;
  },
  today() { return Store.state.daily[U.dayKey()] || { xp: 0, min: 0, sessions: 0 }; }
};
