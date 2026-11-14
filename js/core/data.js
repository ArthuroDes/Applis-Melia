/* Construction du lexique et du programme de leçons à partir des données brutes */
const Data = {
  cats: {},      // id -> catégorie
  words: {},     // id -> mot
  tracks: {
    aero: { id: 'aero', name: 'Anglais technique aéro', icon: '✈️',
      order: ['general', 'structure', 'safety', 'tools', 'verbs', 'measures', 'engines', 'mechanics', 'sys-hyd', 'sys-elec', 'sys-fuel', 'sys-gear', 'sys-controls', 'materials', 'maintenance', 'defects', 'sys-avionics', 'linking', 'docs'] },
    conv: { id: 'conv', name: 'Anglais conversationnel', icon: '💬',
      order: ['conv-hello', 'conv-polite', 'conv-numbers', 'conv-work', 'conv-smalltalk', 'conv-training', 'conv-travel', 'conv-phone', 'conv-training2', 'conv-problems', 'conv-opinion', 'conv-past-future'] }
  },
  lessons: [],   // toutes les leçons
  byId: {},

  LEVELS: { 1: 'A2 · Facile', 2: 'B1 · Moyen', 3: 'B2 · Avancé' },

  build() {
    for (const raw of window.VOCAB_RAW) {
      const cat = { id: raw.id, name: raw.name, icon: raw.icon, track: raw.track, level: raw.level, diagram: raw.diagram, words: [] };
      Data.cats[cat.id] = cat;
      raw.words.trim().split('\n').forEach(line => {
        const p = line.split('|').map(x => x.trim());
        if (p.length < 5 || !p[0]) return;
        const id = U.slug(p[0]);
        let w = Data.words[id];
        if (!w) {
          let level = cat.level;
          if (p[0].length > 22 && level < 3) level++;
          w = Data.words[id] = { id, en: p[0], fr: p[1], def: p[2], ex: p[3], exFr: p[4], emoji: p[5] || '', cat: cat.id, level };
        }
        cat.words.push(w);
      });
    }
    Data.buildLessons();
  },

  /* Découpe chaque catégorie en leçons de ~7 mots + une leçon-bilan par catégorie */
  buildLessons() {
    let globalN = 0;
    for (const tr of Object.values(Data.tracks)) {
      tr.lessons = [];
      tr.units = [];
      tr.order.forEach((cid, ui) => {
        const cat = Data.cats[cid]; if (!cat) return;
        const n = Math.max(1, Math.round(cat.words.length / 7));
        const size = Math.ceil(cat.words.length / n);
        const unit = { cat, index: ui, lessons: [] };
        for (let i = 0; i < n; i++) {
          const words = cat.words.slice(i * size, (i + 1) * size);
          if (!words.length) continue;
          const L = { id: tr.id + '-' + cid + '-' + (i + 1), track: tr.id, cat: cid, part: i + 1, parts: n, kind: 'lesson', words: words.map(w => w.id),
            title: cat.name + (n > 1 ? ' · ' + (i + 1) + '/' + n : ''), n: ++globalN };
          unit.lessons.push(L);
        }
        unit.lessons.push({ id: tr.id + '-' + cid + '-bilan', track: tr.id, cat: cid, kind: 'review', words: cat.words.map(w => w.id),
          title: 'Bilan · ' + cat.name, n: ++globalN });
        unit.lessons.forEach(L => { L.index = tr.lessons.length; L.unit = ui; tr.lessons.push(L); Data.lessons.push(L); Data.byId[L.id] = L; });
        tr.units.push(unit);
      });
    }
  },

  isUnlocked(L) {
    const s = Store.state;
    if (s.settings.unlockAll) return true;
    const tr = Data.tracks[L.track];
    if (L.index <= (s.start[L.track] || 0)) return true;
    const prev = tr.lessons[L.index - 1];
    return !prev || !!(s.lessons[prev.id] && s.lessons[prev.id].done);
  },
  nextLesson(track) {
    const tr = Data.tracks[track];
    return tr.lessons.find(L => !(Store.state.lessons[L.id] && Store.state.lessons[L.id].done) && Data.isUnlocked(L)) || tr.lessons[tr.lessons.length - 1];
  },
  doneCount(track) { return Data.tracks[track].lessons.filter(L => Store.state.lessons[L.id] && Store.state.lessons[L.id].done).length; },
  /* Distracteurs : mots de la même catégorie puis de la même piste */
  distractors(word, n, field) {
    field = field || 'en';
    const cat = Data.cats[word.cat];
    let pool = cat.words.filter(w => w.id !== word.id && U.norm(w[field]) !== U.norm(word[field]));
    if (pool.length < n) pool = pool.concat(Object.values(Data.words).filter(w => Data.cats[w.cat].track === cat.track && w.id !== word.id));
    return U.uniq(U.sample(pool, n * 2).map(w => w[field])).filter(x => U.norm(x) !== U.norm(word[field])).slice(0, n);
  },
  levelLabel(l) { return Data.LEVELS[l] || ''; },
  tierName(i) {
    const tiers = ['Élève pilote', 'Pilote privé', 'Copilote', 'Commandant de bord', 'Instructeur', 'Ingénieur navigant', 'Expert Part-66', 'As du ciel'];
    return tiers[Math.min(tiers.length - 1, i)];
  }
};
