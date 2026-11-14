/* AeroEnglish — écrans et navigation */
const App = {
  track: 'aero',
  view: 'home',

  init() {
    Store.load();
    Data.build();
    Voice.init();
    App.applyTheme();
    App.globalHandlers();
    window.addEventListener('hashchange', () => App.go(location.hash.slice(1) || 'home', true));
    App.track = localStorage.getItem('aeroenglish.track') || 'aero';
    App.go(location.hash.slice(1) || 'home', true);
    if (!Store.state.onboarded) setTimeout(App.onboarding, 300);
    App.reminderLoop();
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); App.installEvt = e; if (App.view === 'home') App.home(); });
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
  },

  applyTheme() {
    const t = Store.state.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  },

  globalHandlers() {
    document.addEventListener('click', e => {
      const add = e.target.closest('[data-add]');
      if (add) {
        const on = SRS.toggleMine(add.dataset.add);
        add.classList.toggle('on', on);
        add.textContent = on ? '✓ In my vocabulary' : '＋ Add to my vocabulary';
        U.toast(on ? 'Ajouté à « Mon vocabulaire »' : 'Retiré de « Mon vocabulaire »');
        return;
      }
      const t = e.target.closest('[data-play],[data-say]');
      if (t) {
        if (t.dataset.play) Voice.say(t.dataset.play, { slow: t.dataset.slow ? true : undefined });
        else Voice.say(t.dataset.say);
      }
    });
    const tip = document.createElement('div'); tip.className = 'chart-tip'; document.body.appendChild(tip);
    document.addEventListener('pointermove', e => {
      const r = e.target.closest && e.target.closest('[data-tip]');
      if (!r) { tip.style.display = 'none'; return; }
      tip.textContent = r.dataset.tip; tip.style.display = 'block';
      tip.style.left = Math.min(window.innerWidth - 180, e.clientX + 12) + 'px'; tip.style.top = (e.clientY - 36) + 'px';
    });
  },

  go(view, fromHash) {
    App.view = view;
    if (!fromHash) { location.hash = view; return; }
    Voice.stop();
    const views = { home: App.home, review: App.review, talk: App.talk, vocab: App.vocab, stats: App.stats, settings: App.settings };
    (views[view] || App.home)();
    U.$$('.bottomnav button').forEach(b => b.classList.toggle('active', b.dataset.go === view));
    App.updateTop();
    window.scrollTo(0, 0);
  },

  updateTop() {
    U.$('#streak').textContent = '🔥 ' + Store.streakAlive();
    U.$('#xp').textContent = '⭐ ' + Store.state.xp + ' XP';
  },

  main(html) { const m = U.$('#main'); m.innerHTML = html; return m; },

  /* ======================= ACCUEIL / TABLEAU DE BORD ======================= */
  home() {
    const s = Store.state, today = Store.today(), goal = s.settings.dailyGoal;
    const tr = Data.tracks[App.track];
    const next = Data.nextLesson(App.track);
    const due = SRS.dueList().length;
    const pct = Math.min(100, Math.round(today.min / goal * 100));
    const totalDone = Data.doneCount('aero') + Data.doneCount('conv');
    const tier = Math.floor(totalDone / 15);
    const name = s.settings.name ? ', ' + U.esc(s.settings.name) : '';
    const placementTodo = !s.placement.conv || !s.placement.aero;
    const m = App.main(`<div class="page">
      ${today.sessions ? '' : `<div class="banner">⏰ <div><b>Rappel du jour${name} :</b> vous n'avez pas encore pratiqué aujourd'hui. 15 minutes suffisent pour garder votre série 🔥.</div></div>`}
      <div class="stats-strip" style="margin-bottom:14px">
        <div class="stat"><div class="v">🔥 ${Store.streakAlive()}</div><div class="l">jours d'affilée</div></div>
        <div class="stat"><div class="v">${s.xp}</div><div class="l">XP · ${Data.tierName(tier)}</div></div>
        <div class="stat"><div class="v">${Math.round(today.min)}/${goal}</div><div class="l">min aujourd'hui</div></div>
      </div>
      <div class="progressbar" style="margin-bottom:16px" title="Objectif du jour"><div style="width:${pct}%"></div></div>
      ${App.installBanner()}
      ${placementTodo ? `<div class="banner blue">🧭 <div style="flex:1"><b>Tests de positionnement</b><div class="small">Évaluez votre niveau (conversationnel et technique aéro) pour démarrer au bon palier.</div></div><button class="btn" data-placement>Passer</button></div>` : ''}
      <div class="card">
        <div class="row" style="justify-content:space-between"><div><div class="ex-kind">Prochaine étape recommandée</div><h2 style="margin:4px 0">${U.esc(Data.cats[next.cat].icon)} ${U.esc(next.title)}</h2>
        <div class="small muted">${tr.name} · leçon ${next.index + 1}/${tr.lessons.length} · ~15 min</div></div></div>
        <button class="btn block" style="margin-top:12px" data-start="${next.id}">▶ Continuer</button>
      </div>
      <div class="grid2" style="margin-bottom:14px">
        <button class="tile" data-goto="review"><span class="big">🔁</span><b>Révision</b><span class="small muted">${due ? due + ' mot(s) à revoir' : 'Tout est à jour'}</span></button>
        <button class="tile" data-goto="talk"><span class="big">🎙️</span><b>Conversation IA</b><span class="small muted">Parlez, l'IA corrige</span></button>
        <button class="tile" data-goto="vocab"><span class="big">📖</span><b>Mon vocabulaire</b><span class="small muted">${Object.values(s.words).filter(w => w.mine).length} mot(s) ajouté(s)</span></button>
        <button class="tile" data-placement><span class="big">🧭</span><b>Positionnement</b><span class="small muted">${s.placement.aero || s.placement.conv ? 'Repasser un test' : 'Évaluer mon niveau'}</span></button>
      </div>
      <div class="tabs" role="tablist">
        <button data-track="aero" class="${App.track === 'aero' ? 'active' : ''}">✈️ Technique aéro</button>
        <button data-track="conv" class="${App.track === 'conv' ? 'active' : ''}">💬 Conversationnel</button>
      </div>
      <p class="small muted" style="margin:0 0 8px">Votre route de vol : chaque nuage est un palier, chaque balise une leçon. ${Data.doneCount(App.track)}/${tr.lessons.length} leçons effectuées.</p>
      <div class="skymap" id="skymap">${App.skyMap(App.track)}</div>
    </div>`);
    const inst = m.querySelector('[data-install]');
    if (inst) inst.onclick = () => { App.installEvt.prompt(); App.installEvt = null; App.home(); };
    m.querySelectorAll('[data-start]').forEach(b => b.onclick = () => App.openLesson(Data.byId[b.dataset.start]));
    m.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => App.go(b.dataset.goto));
    m.querySelectorAll('[data-placement]').forEach(b => b.onclick = App.placementMenu);
    m.querySelectorAll('[data-track]').forEach(b => b.onclick = () => { App.track = b.dataset.track; localStorage.setItem('aeroenglish.track', App.track); App.home(); });
    m.querySelectorAll('.node').forEach(n => {
      const L = Data.byId[n.dataset.id];
      n.addEventListener('click', () => App.lessonSheet(L));
      n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); App.lessonSheet(L); } });
    });
    const cur = m.querySelector('.node.current');
    const map = m.querySelector('#skymap');
    if (cur && map) requestAnimationFrame(() => {
      const r = cur.getBoundingClientRect(), mr = map.getBoundingClientRect();
      map.scrollTop += (r.top - mr.top) - map.clientHeight / 2 + r.height / 2;
    });
  },

  /* Invitation à installer l'appli sur l'écran d'accueil */
  installBanner() {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    if (standalone || !/^https?:/.test(location.protocol)) return '';
    if (App.installEvt) return `<div class="banner blue">📲 <div style="flex:1"><b>Installer l'application</b><div class="small">Ajoutez AeroEnglish à votre écran d'accueil : elle fonctionnera comme une appli, même hors ligne.</div></div><button class="btn" data-install>Installer</button></div>`;
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return `<div class="banner blue">📲 <div class="small"><b>Installer sur iPhone :</b> dans Safari, touchez le bouton <b>Partager</b> (carré avec une flèche ↑), puis <b>« Sur l'écran d'accueil »</b>.</div></div>`;
    return '';
  },

  /* Carte du ciel : route de vol ascendante (1re leçon en bas), traînées de condensation */
  skyMap(trackId) {
    const tr = Data.tracks[trackId], s = Store.state;
    const W = 360, rowH = 86, unitH = 70, pad = 70;
    const items = [];
    tr.units.forEach((u, ui) => { items.push({ unit: u, ui }); u.lessons.forEach(L => items.push({ L })); });
    let y = 0; const pos = [];
    items.forEach(it => { y += it.unit ? unitH : rowH; it.y = y; });
    const H = y + pad * 2;
    let li = 0;
    items.forEach(it => {
      it.y = H - pad - it.y + (it.unit ? 0 : 0);
      if (it.L) { it.x = W / 2 + Math.sin(li * 0.8) * 100; li++; pos.push(it); }
    });
    const next = Data.nextLesson(trackId);
    const curIdx = pos.findIndex(p => p.L.id === next.id);
    const pathD = pts => pts.map((p, i) => {
      if (!i) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      const q = pts[i - 1], my = (q.y + p.y) / 2;
      return `C${q.x.toFixed(1)} ${my.toFixed(1)} ${p.x.toFixed(1)} ${my.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ');
    const donePts = pos.slice(0, Math.max(1, curIdx + 1)), restPts = pos.slice(Math.max(0, curIdx));
    // Nuages décoratifs (positions déterministes)
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let clouds = '';
    for (let i = 0; i < Math.round(H / 260); i++) {
      const cx = rnd() * W, cy = rnd() * H, sc = 0.6 + rnd() * 0.8;
      clouds += `<g opacity=".55" transform="translate(${cx.toFixed(0)} ${cy.toFixed(0)}) scale(${sc.toFixed(2)})"><ellipse cx="0" cy="0" rx="46" ry="16" fill="#fff"/><ellipse cx="-22" cy="-8" rx="22" ry="16" fill="#fff"/><ellipse cx="14" cy="-14" rx="26" ry="20" fill="#fff"/></g>`;
    }
    let units = '';
    items.filter(it => it.unit).forEach(it => {
      const u = it.unit, done = u.lessons.filter(L => s.lessons[L.id] && s.lessons[L.id].done).length;
      const fl = 'FL' + String((it.ui + 1) * 20).padStart(3, '0');
      units += `<g transform="translate(20 ${it.y - 24})"><rect width="${W - 40}" height="44" rx="14" fill="rgba(255,255,255,.88)"/>
        <text x="14" y="18" font-size="11" font-weight="800" fill="#b58a5a">PALIER ${it.ui + 1} · ${fl}</text>
        <text x="14" y="35" font-size="14" font-weight="800" fill="#1b3352">${U.esc(u.cat.icon + ' ' + u.cat.name).slice(0, 44)}</text>
        <text x="${W - 54}" y="27" font-size="12" font-weight="800" fill="#2f6fb8" text-anchor="end">${done}/${u.lessons.length}</text></g>`;
    });
    let nodes = '';
    pos.forEach((p, i) => {
      const L = p.L, rec = s.lessons[L.id], done = rec && rec.done, unlocked = Data.isUnlocked(L), current = i === curIdx;
      const fill = done ? '#ffffff' : current ? '#efe5d3' : unlocked ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.28)';
      const icon = L.kind === 'review' ? '🏁' : (unlocked ? Data.cats[L.cat].icon : '🔒');
      const stars = done ? '★'.repeat(rec.stars || 1) : '';
      nodes += `<g class="node${current ? ' current' : ''}" data-id="${L.id}" tabindex="0" role="button" aria-label="${U.esc(L.title)}${done ? ' (terminée)' : unlocked ? '' : ' (verrouillée)'}" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
        ${current ? '<circle r="36" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 6" opacity=".9"><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="12s" repeatCount="indefinite"/></circle>' : ''}
        <circle class="ring" r="${L.kind === 'review' ? 30 : 26}" fill="${fill}" stroke="${done ? '#2f6fb8' : '#ffffff'}" stroke-width="3"/>
        <text y="2" font-size="22" text-anchor="middle" dominant-baseline="middle">${icon}</text>
        ${stars ? `<text y="44" font-size="13" text-anchor="middle" fill="#ffd27a" stroke="#1b3352" stroke-width=".6">${stars}</text>` : ''}
        <text x="${p.x > W / 2 ? -40 : 40}" y="5" font-size="11" font-weight="700" fill="#ffffff" text-anchor="${p.x > W / 2 ? 'end' : 'start'}" opacity=".95">${L.kind === 'review' ? 'Bilan' : 'Leçon ' + (L.index + 1)}</text></g>`;
    });
    // Avion sur la leçon courante, orienté vers la suivante
    let plane = '';
    if (curIdx >= 0) {
      const p = pos[curIdx], q = pos[Math.min(pos.length - 1, curIdx + 1)];
      const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI + 45;
      plane = `<g transform="translate(${(p.x + (p.x > W / 2 ? -54 : 54)).toFixed(1)} ${(p.y - 26).toFixed(1)}) rotate(${(curIdx === pos.length - 1 ? 0 : ang).toFixed(0)})"><text font-size="34" text-anchor="middle" dominant-baseline="middle">✈️</text></g>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Carte de progression">
      ${clouds}
      <path d="${pathD(restPts)}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" opacity=".6"/>
      <path d="${pathD(donePts)}" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".25"/>
      <path d="${pathD(donePts)}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".95"/>
      ${units}${nodes}${plane}</svg>`;
  },

  lessonSheet(L) {
    const rec = Store.state.lessons[L.id], unlocked = Data.isUnlocked(L);
    const words = L.words.slice(0, 12).map(id => Data.words[id]);
    U.modal(`<div class="ex-kind">${L.kind === 'review' ? 'Bilan de palier' : 'Leçon ' + (L.index + 1)} · ${Data.levelLabel(Data.cats[L.cat].level)}</div>
      <h2>${U.esc(Data.cats[L.cat].icon)} ${U.esc(L.title)}</h2>
      <p class="small muted">${L.kind === 'review' ? 'Révision des mots les plus fragiles du palier, production écrite guidée et évaluation finale.' : 'Vocabulaire, grammaire, traduction, exercices à trous, compréhension écrite et orale, production écrite et orale, flashcards, images à légender, conversation avec un formateur et évaluation finale.'}</p>
      <div class="card" style="box-shadow:none;background:var(--surface-2)">${words.map(w => `<span class="en-word" data-say="${U.esc(U.main(w.en))}">${U.esc(U.main(w.en))}</span>`).join(' · ')}${L.words.length > 12 ? ' …' : ''}</div>
      ${rec && rec.done ? `<p>Meilleur score : <b>${rec.best} %</b> ${'★'.repeat(rec.stars || 1)} · effectuée ${rec.count} fois</p>` : ''}
      ${unlocked ? `<button class="btn block" data-go>${rec && rec.done ? '↻ Refaire la leçon' : '▶ Commencer (~15 min)'}</button>`
        : `<p class="banner">🔒 Terminez la leçon précédente, ou passez le test de positionnement pour débloquer les paliers adaptés à votre niveau.</p>`}`,
      (m, close) => { const b = m.querySelector('[data-go]'); if (b) b.onclick = () => { close(); App.openLesson(L); }; });
  },

  openLesson(L) {
    if (!Data.isUnlocked(L)) return App.lessonSheet(L);
    Lesson.run({ title: L.title, steps: Lesson.build(L), kind: 'lesson', lesson: L, onExit: () => App.go(App.view, true) });
  },

  /* ======================= TESTS DE POSITIONNEMENT ======================= */
  placementMenu() {
    const p = Store.state.placement;
    const lvl = t => p[t] ? `Niveau ${p[t].level}/4 · ${p[t].score} %` : 'Non passé';
    U.modal(`<h2>🧭 Tests de positionnement</h2><p class="muted small">Environ 3 minutes chacun. Le résultat débloque les paliers adaptés et vous propose les étapes de travail les plus utiles.</p>
      <button class="tile" style="width:100%;margin-bottom:10px" data-t="conv"><b>💬 Anglais conversationnel / classique</b><span class="small muted">${lvl('conv')}</span></button>
      <button class="tile" style="width:100%" data-t="aero"><b>✈️ Anglais technique aéronautique</b><span class="small muted">${lvl('aero')}</span></button>`,
      (m, close) => U.$$('[data-t]', m).forEach(b => b.onclick = () => { close(); App.placement(b.dataset.t); }));
  },
  placement(track) {
    const qs = PLACEMENT[track];
    const results = [];
    const steps = qs.map(([q, options, a, level]) => ({ type: 'mcq', kind: 'Test de positionnement · ' + Data.tracks[track].name, q, options, answer: options[a], level }));
    Lesson.run({
      title: 'Test de positionnement — ' + Data.tracks[track].name, steps, kind: 'placement', noRetry: true,
      onResult: (st, res) => results.push({ level: st.level, ok: res.ok }),
      summary: () => {
        let level = 1;
        for (let l = 1; l <= 4; l++) {
          const r = results.filter(x => x.level === l); const acc = r.length ? r.filter(x => x.ok).length / r.length : 0;
          if (acc >= 0.6) level = l; else break;
        }
        const score = Math.round(results.filter(r => r.ok).length / results.length * 100);
        const lessons = Data.tracks[track].lessons;
        const startIdx = Math.floor(lessons.length * [0, 0, 0.2, 0.4, 0.6][level]);
        Store.state.placement[track] = { level, score, date: Date.now() };
        Store.state.start[track] = Math.max(Store.state.start[track] || 0, startIdx);
        Store.save();
        const startL = lessons[startIdx];
        const advice = {
          1: 'Commencez par les bases : premiers paliers, vocabulaire essentiel et prononciation. Faites les révisions chaque jour.',
          2: 'Bonnes bases : les premiers paliers sont débloqués, concentrez-vous sur la compréhension orale et les phrases complètes.',
          3: 'Bon niveau : travaillez la production orale avec la conversation IA et les paliers techniques avancés.',
          4: 'Très bon niveau : visez la documentation technique, les rapports écrits et la fluidité à l\'oral.'
        }[level];
        return `<div class="card"><h2>Niveau estimé : ${level}/4 (${['', 'A2', 'B1', 'B1+', 'B2'][level]})</h2><p>${advice}</p>
          <p class="small">Point de départ conseillé : <b>${U.esc(startL.title)}</b> (les leçons précédentes restent accessibles en révision).</p></div>`;
      },
      onExit: () => { App.track = track; localStorage.setItem('aeroenglish.track', track); App.go('home', true); }
    });
  },

  /* ======================= RÉVISION ======================= */
  review() {
    const due = SRS.dueList(), mine = Object.entries(Store.state.words).filter(([, r]) => r.mine).map(([id]) => id);
    const weak = SRS.weakest(12), learned = SRS.learned();
    const m = App.main(`<div class="page"><h1>🔁 Révision</h1>
      <p class="muted">Répétition espacée : chaque mot revient au bon moment. Ceux que vous maîtrisez moins bien reviennent plus souvent (après 10 min, 1 jour, 3 jours, puis des intervalles de plus en plus longs).</p>
      <div class="card"><div class="row" style="justify-content:space-between"><div><h2 style="margin:0">À revoir maintenant</h2><div class="muted small">${due.length} mot(s)</div></div><span style="font-size:2rem">⏰</span></div>
        <button class="btn block" style="margin-top:10px" data-r="due" ${due.length ? '' : 'disabled'}>Réviser ${Math.min(due.length, 15)} mot(s)</button></div>
      <div class="grid2">
        <button class="tile" data-r="mine" ${mine.length < 2 ? 'disabled' : ''}><span class="big">📌</span><b>Mon vocabulaire</b><span class="small muted">${mine.length} mot(s)</span></button>
        <button class="tile" data-r="weak" ${weak.length < 2 ? 'disabled' : ''}><span class="big">🎯</span><b>Mots difficiles</b><span class="small muted">${weak.length} mot(s)</span></button>
      </div>
      <div class="card" style="margin-top:14px"><b>Bilan de mémoire</b><div class="grid3" style="margin-top:10px">
        <div class="stat"><div class="v">${learned.length}</div><div class="l">mots rencontrés</div></div>
        <div class="stat"><div class="v">${SRS.mastered()}</div><div class="l">maîtrisés (21 j+)</div></div>
        <div class="stat"><div class="v">${due.length}</div><div class="l">à revoir</div></div></div></div>
      ${!learned.length ? '<p class="banner">Commencez une leçon : les mots vus alimenteront automatiquement vos révisions.</p>' : ''}
    </div>`);
    m.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      const k = b.dataset.r;
      const ids = k === 'due' ? due.slice(0, 15) : k === 'mine' ? U.sample(mine, 15) : weak;
      Lesson.run({ title: 'Révision', steps: Lesson.buildReview(ids), kind: 'review', onExit: () => App.go('review', true) });
    });
  },

  /* ======================= VOCABULAIRE ======================= */
  vocab() {
    const cats = Object.values(Data.cats);
    const m = App.main(`<div class="page"><h1>📖 Vocabulaire</h1>
      <input class="textin" type="search" placeholder="Rechercher (anglais ou français)…" data-q>
      <div class="row" style="margin:10px 0"><select class="textin" style="flex:1" data-f>
        <option value="mine">📌 Mon vocabulaire</option><option value="seen">Mots rencontrés</option><option value="due">À revoir</option>
        <optgroup label="Lexique complet">${cats.map(c => `<option value="cat:${c.id}">${c.icon} ${U.esc(c.name)} (${c.words.length})</option>`).join('')}</optgroup></select></div>
      <div class="card" data-list></div></div>`);
    const q = m.querySelector('[data-q]'), f = m.querySelector('[data-f]'), list = m.querySelector('[data-list]');
    if (!Object.values(Store.state.words).some(w => w.mine)) f.value = 'cat:general';
    const draw = () => {
      const qq = U.norm(q.value), fv = f.value, now = Date.now();
      let ws;
      if (qq) ws = Object.values(Data.words).filter(w => U.norm(w.en).includes(qq) || U.norm(w.fr).includes(qq));
      else if (fv.startsWith('cat:')) ws = Data.cats[fv.slice(4)].words;
      else ws = Object.values(Data.words).filter(w => { const r = Store.state.words[w.id]; if (!r) return false; return fv === 'mine' ? r.mine : fv === 'seen' ? r.seen > 0 : r.seen && r.due <= now; });
      ws = ws.slice(0, 300);
      list.innerHTML = ws.length ? ws.map(w => `<div class="wordrow"><button class="playbtn mini" data-play="${U.esc(U.main(w.en))}">🔊</button>
        <div class="w" data-open="${w.id}" style="cursor:pointer"><b>${U.esc(w.en)}</b><span class="small muted">${U.esc(w.fr)}</span></div>
        <div class="strength" title="Maîtrise"><div style="width:${Math.round(SRS.strength(w.id) * 100)}%"></div></div>
        <button class="addbtn ${SRS.isMine(w.id) ? 'on' : ''}" data-add="${w.id}" aria-label="Ajouter à mon vocabulaire">${SRS.isMine(w.id) ? '✓' : '＋'}</button></div>`).join('')
        : '<p class="muted">Aucun mot ici pour l\'instant. Utilisez le bouton « Add to my vocabulary » pendant les leçons.</p>';
      U.$$('[data-add]', list).forEach(b => b.addEventListener('click', () => setTimeout(() => { b.textContent = SRS.isMine(b.dataset.add) ? '✓' : '＋'; }, 0)));
      U.$$('[data-open]', list).forEach(d => d.onclick = () => App.wordCard(Data.words[d.dataset.open]));
    };
    q.oninput = draw; f.onchange = draw; draw();
  },
  wordCard(w) {
    const mine = SRS.isMine(w.id), r = Store.state.words[w.id];
    U.modal(`<div class="vcard" style="box-shadow:none;padding:0">
      <div class="illus">${EN.illus(w)}</div>
      <div class="row" style="justify-content:space-between"><div><div class="en" data-say="${U.esc(U.main(w.en))}">${U.esc(w.en)}</div><div class="fr">${U.esc(w.fr)}</div></div>
      <div class="row">${EN.play(U.main(w.en))}${EN.playSlow(U.main(w.en))}</div></div>
      <div class="def"><b>Definition:</b> ${EN.html(w.def)}</div>
      <div class="exm"><button class="playbtn mini" data-play="${U.esc(w.ex)}" style="float:right">🔊</button>${EN.html(w.ex)}<div class="small muted">${U.esc(w.exFr)}</div></div>
      <div class="row" style="justify-content:space-between;margin-top:12px">${EN.levelTag(w)}<span class="small muted">${U.esc(Data.cats[w.cat].name)}</span></div>
      ${r && r.seen ? `<p class="small muted">Vu ${r.seen} fois · ${r.ok} bonnes réponses · ${r.ko} erreurs · prochaine révision : ${r.due <= Date.now() ? 'maintenant' : new Date(r.due).toLocaleDateString('fr-FR')}</p>` : ''}
      <button class="addbtn ${mine ? 'on' : ''}" style="width:100%;margin-top:8px" data-add="${w.id}">${mine ? '✓ In my vocabulary' : '＋ Add to my vocabulary'}</button></div>`);
  },

  /* ======================= CONVERSATION IA ======================= */
  talk() {
    const s = Store.state.settings;
    const m = App.main(`<div class="page"><h1>🎙️ Conversation</h1>
      <div class="row" style="flex-wrap:nowrap;margin-bottom:12px"><div class="avatar big">${CHARACTERS.oliver.avatar}</div>
        <div><b>Mr Oliver</b>, votre formateur.<div class="small muted">Vous parlez en anglais au micro ; il vous répond à voix haute, affiche la transcription et corrige en 4 parties : Grammar, Vocabulary, Pronunciation, Fluency.</div></div></div>
      ${s.apiKey ? '' : `<div class="banner">🔑 <div class="small"><b>Mode hors ligne.</b> Pour une vraie conversation corrigée par l'IA, ajoutez votre clé API Claude dans <a href="#settings">Réglages</a>. Sans clé, un tuteur local simplifié vous relance et signale les erreurs courantes.</div></div>`}
      ${Voice.hasSR() ? '' : '<div class="banner">🎤 Reconnaissance vocale indisponible dans ce navigateur : vous pourrez répondre au clavier. (Chrome ou Edge recommandés.)</div>'}
      <h2>Choisissez un sujet</h2>
      <div class="grid2">${AI_TOPICS.map(t => `<button class="tile" data-topic="${t.id}"><b>${U.esc(t.title)}</b><span class="small muted">${t.track === 'aero' ? '✈️' : '💬'} ${Data.levelLabel(Math.min(3, t.level))}</span></button>`).join('')}</div></div>`);
    U.$$('[data-topic]', m).forEach(b => b.onclick = () => App.conversation(AI_TOPICS.find(t => t.id === b.dataset.topic)));
  },

  conversation(topic) {
    const s = Store.state.settings, ch = CHARACTERS.oliver;
    const p = Store.state.placement, lvl = Math.max((p.conv || {}).level || 1, (p.aero || {}).level || 1);
    const history = [];
    const scores = [];
    let turn = 0, active = 0, lastAct = Date.now(), handle = null, busy = false;
    const act = () => { const n = Date.now(); active += Math.min(n - lastAct, 90000); lastAct = n; };
    const root = document.createElement('div'); root.className = 'lesson';
    root.innerHTML = `<div class="lesson-head"><button class="iconbtn" data-close style="color:var(--muted)" aria-label="Terminer">✕</button>
      <div style="flex:1"><b>${U.esc(topic.title)}</b><div class="small muted">${U.esc(topic.prompt)}</div></div></div>
      <div class="lesson-body"><div class="chat"></div><div class="corr"></div></div>
      <div class="lesson-foot"><div class="inner">
        <label class="switch" style="padding:0;border:0"><span class="small"><b>Mode sans interruption</b> — l'IA attend que vous appuyiez sur « J'ai fini »</span><input type="checkbox" data-ni ${s.noInterrupt ? 'checked' : ''}></label>
        <div class="transcript hidden"></div>
        <div class="row" style="flex-wrap:nowrap">
          ${Voice.hasSR() ? '<button class="mic" style="width:64px;height:64px;font-size:1.6rem;flex:none" aria-label="Parler">🎤</button>' : ''}
          <input class="textin" data-text placeholder="…ou écrivez votre réponse" style="flex:1">
          <button class="btn" data-send style="flex:none">➤</button></div>
        <button class="btn secondary block" data-end>Terminer et voir le bilan</button></div></div>`;
    document.body.appendChild(root); document.body.style.overflow = 'hidden';
    const chat = root.querySelector('.chat'), corr = root.querySelector('.corr'), tr = root.querySelector('.transcript');
    const mic = root.querySelector('.mic'), text = root.querySelector('[data-text]'), ni = root.querySelector('[data-ni]');
    root.addEventListener('pointerdown', act, true); root.addEventListener('keydown', act, true);
    ni.onchange = () => { s.noInterrupt = ni.checked; Store.save(); };
    const tutorSay = t => {
      chat.insertAdjacentHTML('beforeend', `<div class="speaker"><div class="avatar">${ch.avatar}</div><div class="bubble them"><button class="playbtn mini" data-play="${U.esc(t)}" style="float:right;margin-left:6px">🔊</button>${EN.html(t)}</div></div>`);
      chat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      Voice.say(t, { pitch: ch.pitch, hint: ch.voiceHint });
    };
    const opening = { intro: "Hello! I'm Mr Oliver. Let's get to know each other. Can you introduce yourself?", free: "Hello! What would you like to talk about today?" }[topic.id]
      || `Hello! Today's topic is: ${topic.prompt} Take your time, I'm listening.`;
    tutorSay(opening);
    history.push({ role: 'assistant', content: JSON.stringify({ reply: opening }) });

    const send = async (said, conf) => {
      said = said.trim(); if (!said || busy) return;
      busy = true; act();
      chat.insertAdjacentHTML('beforeend', `<div class="bubble me">${U.esc(said)}${conf ? `<div class="tr">Reconnaissance : ${Math.round(conf * 100)} %</div>` : ''}</div>`);
      chat.insertAdjacentHTML('beforeend', `<div class="bubble them" data-wait>…</div>`);
      chat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
      let r;
      try {
        if (!s.apiKey) throw new Error('offline');
        history.push({ role: 'user', content: `Learner said (speech-recognition transcript${conf ? ', average confidence ' + Math.round(conf * 100) + '%' : ', typed'}): """${said}"""` });
        r = await AI.call(history, AI.system(topic.prompt, ['', 'A2', 'B1', 'B1+', 'B2'][lvl]));
        history.push({ role: 'assistant', content: JSON.stringify(r) });
      } catch (e) {
        if (e.message !== 'offline') U.toast('IA indisponible (' + e.message + ') — tuteur local utilisé.', 3500);
        if (history.length && history[history.length - 1].role === 'user') history.pop();
        r = AI.offlineTurn(topic.id, turn, said, conf);
      }
      turn++;
      const w = chat.querySelector('[data-wait]'); if (w) w.remove();
      tutorSay(r.reply || '…');
      if (r.score != null) scores.push(+r.score);
      corr.innerHTML = AI.feedbackHTML(r, !conf);
      busy = false;
    };

    if (mic) mic.onclick = () => {
      if (handle) { handle.stop(); return; }
      if (busy) return;
      Voice.stop();
      mic.classList.add('rec'); mic.textContent = '⏹'; tr.classList.remove('hidden'); tr.textContent = ni.checked ? 'Je vous écoute… appuyez sur ⏹ quand vous avez fini.' : 'Je vous écoute…';
      handle = Voice.listen({
        continuous: ni.checked,
        oninterim: t => { tr.textContent = t; },
        onerror: err => { mic.classList.remove('rec'); mic.textContent = '🎤'; handle = null; tr.textContent = err === 'not-allowed' ? 'Accès au micro refusé.' : 'Erreur micro : ' + err; },
        ondone: (t, conf) => { mic.classList.remove('rec'); mic.textContent = '🎤'; handle = null; tr.classList.add('hidden'); if (t) send(t, conf || 0.01); else U.toast("Je n'ai rien entendu, réessayez."); }
      });
    };
    root.querySelector('[data-send]').onclick = () => { send(text.value, 0); text.value = ''; };
    text.addEventListener('keydown', e => { if (e.key === 'Enter') { send(text.value, 0); text.value = ''; } });
    const finish = () => {
      if (handle) handle.stop();
      Voice.stop();
      act();
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
      if (turn > 0) Store.logSession('conversation', topic.id, active / 60000, turn * 3, avg || 0);
      root.remove(); document.body.style.overflow = '';
      if (turn > 0) U.modal(`<div class="result-hero"><div class="plane">🎙️</div><h2>Bilan de la conversation</h2>
        <p>${turn} échange(s) · +${turn * 3} XP · ${U.fmtMin(active / 60000)}</p>${avg != null ? `<p>Score moyen : <span class="score-badge">${avg}/100</span></p>` : ''}
        <p class="small muted">Les conseils détaillés de chaque échange étaient affichés sous la conversation (Grammar, Vocabulary, Pronunciation, Fluency).</p></div>`);
      App.go('talk', true);
    };
    root.querySelector('[data-end]').onclick = finish;
    root.querySelector('[data-close]').onclick = finish;
  },

  /* ======================= STATISTIQUES ======================= */
  barChart(data, opts) {
    opts = opts || {};
    const W = 340, H = 150, padL = 30, padB = 22, padT = 16;
    const max = Math.max(1, ...data.map(d => d.v));
    const nice = max <= 5 ? 5 : max <= 10 ? 10 : Math.ceil(max / 10) * 10;
    const bw = (W - padL) / data.length;
    const grid = [0, 0.5, 1].map(f => { const y = padT + (H - padT - padB) * (1 - f); return `<line class="grid" x1="${padL}" x2="${W}" y1="${y}" y2="${y}"/><text class="axis" x="${padL - 6}" y="${y + 4}" text-anchor="end">${Math.round(nice * f)}</text>`; }).join('');
    const bars = data.map((d, i) => {
      const h = (H - padT - padB) * d.v / nice, x = padL + i * bw + 2, w = Math.max(4, bw - 4), y = H - padB - h;
      const r = Math.min(4, w / 2, h);
      const path = h > 0 ? `M${x} ${H - padB} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${H - padB}Z` : '';
      return `<g>${path ? `<path class="bar" d="${path}" data-tip="${U.esc(d.tip || d.label + ' : ' + d.v)}"/>` : ''}
        <rect x="${x - 2}" y="${padT}" width="${bw}" height="${H - padT - padB}" fill="transparent" data-tip="${U.esc(d.tip || d.label + ' : ' + d.v)}"/>
        <text class="axis" x="${x + w / 2}" y="${H - 6}" text-anchor="middle">${U.esc(d.label)}</text></g>`;
    }).join('');
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${U.esc(opts.title || '')}">${grid}${bars}</svg></div>
      <details class="datatable small"><summary class="muted">Voir les données</summary><table><tr><th>Période</th><th>${U.esc(opts.unit || 'Valeur')}</th></tr>${data.map(d => `<tr><td>${U.esc(d.full || d.label)}</td><td>${d.v}</td></tr>`).join('')}</table></details>`;
  },
  stats() {
    const s = Store.state, sess = s.sessions;
    const totalMin = sess.reduce((a, b) => a + b.min, 0);
    const doneA = Data.doneCount('aero'), doneC = Data.doneCount('conv');
    const totalL = Data.tracks.aero.lessons.length + Data.tracks.conv.lessons.length;
    // Minutes par semaine (8 dernières semaines, semaine commençant le lundi)
    const monday = d => { d = new Date(d); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };
    const thisMon = monday(new Date());
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(thisMon); start.setDate(start.getDate() - i * 7);
      const end = new Date(start); end.setDate(end.getDate() + 7);
      const inW = sess.filter(x => x.t >= start && x.t < end);
      const mins = Math.round(inW.reduce((a, b) => a + b.min, 0));
      weeks.push({ label: start.getDate() + '/' + (start.getMonth() + 1), full: 'Semaine du ' + start.toLocaleDateString('fr-FR'), v: mins, tip: `Semaine du ${start.toLocaleDateString('fr-FR')} : ${mins} min, ${inW.length} séance(s)` });
    }
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const st = new Date(now.getFullYear(), now.getMonth() - i, 1), en = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const inM = sess.filter(x => x.t >= st && x.t < en);
      const name = st.toLocaleDateString('fr-FR', { month: 'short' });
      months.push({ label: name, full: st.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }), v: inM.length, tip: `${st.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} : ${inM.length} séance(s), ${Math.round(inM.reduce((a, b) => a + b.min, 0))} min` });
    }
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = U.dayKey(d), rec = s.daily[k] || { xp: 0, min: 0 };
      days.push({ label: String(d.getDate()), full: d.toLocaleDateString('fr-FR'), v: rec.xp, tip: `${d.toLocaleDateString('fr-FR')} : ${rec.xp} XP, ${Math.round(rec.min)} min` });
    }
    const kinds = { lesson: '📘 Leçon', review: '🔁 Révision', conversation: '🎙️ Conversation', placement: '🧭 Test' };
    const avgAcc = sess.filter(x => x.kind === 'lesson').slice(-20);
    const acc = avgAcc.length ? Math.round(avgAcc.reduce((a, b) => a + (b.acc || 0), 0) / avgAcc.length) : 0;
    const tier = Math.floor((doneA + doneC) / 15);
    App.main(`<div class="page"><h1>📊 Statistiques</h1>
      <div class="card" style="background:linear-gradient(135deg,var(--sky-1),var(--sky-2));color:#fff"><div class="small" style="opacity:.85">Grade actuel</div><h2 style="margin:2px 0">✈️ ${Data.tierName(tier)}</h2>
        <div class="small">Prochain grade dans ${15 - ((doneA + doneC) % 15)} leçon(s)</div></div>
      <div class="grid3" style="margin-bottom:14px">
        <div class="stat"><div class="v">${s.xp}</div><div class="l">XP total</div></div>
        <div class="stat"><div class="v">🔥 ${Store.streakAlive()}</div><div class="l">série (jours)</div></div>
        <div class="stat"><div class="v">${U.fmtMin(totalMin)}</div><div class="l">temps total</div></div>
        <div class="stat"><div class="v">${doneA + doneC}/${totalL}</div><div class="l">leçons</div></div>
        <div class="stat"><div class="v">${SRS.learned().length}</div><div class="l">mots appris</div></div>
        <div class="stat"><div class="v">${acc} %</div><div class="l">réussite moy.</div></div></div>
      <div class="card"><h2>Temps passé par semaine (min)</h2>${App.barChart(weeks, { title: 'Minutes par semaine', unit: 'Minutes' })}</div>
      <div class="card"><h2>Séances par mois</h2>${App.barChart(months, { title: 'Séances par mois', unit: 'Séances' })}</div>
      <div class="card"><h2>XP des 14 derniers jours</h2>${App.barChart(days, { title: 'XP par jour', unit: 'XP' })}</div>
      <div class="card"><h2>Progression par palier</h2>${['aero', 'conv'].map(t => `<h3 class="small muted" style="margin-top:10px">${Data.tracks[t].name}</h3>` + Data.tracks[t].units.map(u => {
        const d = u.lessons.filter(L => s.lessons[L.id] && s.lessons[L.id].done).length;
        return `<div style="margin:6px 0"><div class="row small" style="justify-content:space-between"><span>${u.cat.icon} ${U.esc(u.cat.name)}</span><span>${d}/${u.lessons.length}</span></div><div class="progressbar" style="height:8px"><div style="width:${Math.round(d / u.lessons.length * 100)}%"></div></div></div>`;
      }).join('')).join('')}</div>
      <div class="card"><h2>Historique</h2>${sess.length ? sess.slice(-20).reverse().map(x => `<div class="wordrow"><div class="w"><b>${kinds[x.kind] || x.kind} ${Data.byId[x.ref] ? '· ' + U.esc(Data.byId[x.ref].title) : ''}</b><span class="small muted">${new Date(x.t).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })} · ${U.fmtMin(x.min)} · ${x.acc != null ? x.acc + ' %' : ''}</span></div><span class="score-badge">+${x.xp}</span></div>`).join('') : '<p class="muted">Aucune séance pour l\'instant.</p>'}</div>
    </div>`);
  },

  /* ======================= RÉGLAGES ======================= */
  settings() {
    const s = Store.state.settings;
    const voices = Voice.voices;
    const m = App.main(`<div class="page"><h1>⚙️ Réglages</h1>
      <div class="card"><h2>Profil</h2>
        <div class="field"><label>Prénom</label><input class="textin" data-k="name" value="${U.esc(s.name)}"></div>
        <div class="field"><label>Objectif quotidien (minutes)</label><select class="textin" data-k="dailyGoal">${[10, 15, 20, 30, 45, 60].map(v => `<option ${+s.dailyGoal === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
        <div class="field"><label>Thème</label><select class="textin" data-k="theme"><option value="auto" ${s.theme === 'auto' ? 'selected' : ''}>Automatique</option><option value="light" ${s.theme === 'light' ? 'selected' : ''}>Clair</option><option value="dark" ${s.theme === 'dark' ? 'selected' : ''}>Sombre</option></select></div></div>
      <div class="card"><h2>Audio</h2>
        <label class="switch"><span>Son de validation</span><input type="checkbox" data-k="sound" ${s.sound ? 'checked' : ''}></label>
        <label class="switch"><span>Lecture automatique des mots</span><input type="checkbox" data-k="autoplay" ${s.autoplay ? 'checked' : ''}></label>
        <label class="switch"><span>Audio au ralenti par défaut 🐢</span><input type="checkbox" data-k="slow" ${s.slow ? 'checked' : ''}></label>
        <div class="field" style="margin-top:10px"><label>Voix anglaise</label><select class="textin" data-k="voice"><option value="">Automatique (anglais britannique)</option>${voices.map(v => `<option value="${U.esc(v.voiceURI)}" ${s.voice === v.voiceURI ? 'selected' : ''}>${U.esc(v.name)} (${v.lang})</option>`).join('')}</select>
          <button class="btn secondary" data-test-voice>🔊 Tester</button></div></div>
      <div class="card"><h2>Rappels quotidiens</h2>
        <div class="field"><label>Heure du rappel</label><input class="textin" type="time" data-k="reminderTime" value="${U.esc(s.reminderTime)}"></div>
        <label class="switch"><span>Notification (si l'application est ouverte ou installée)</span><input type="checkbox" data-k="notify" ${s.notify ? 'checked' : ''}></label>
        <p class="small muted">Pour un rappel fiable tous les jours, même application fermée, ajoutez l'événement à l'agenda de votre téléphone ou de votre ordinateur :</p>
        <button class="btn beige block" data-ics>📅 Télécharger le rappel quotidien (.ics)</button></div>
      <div class="card"><h2>Conversation IA</h2>
        <p class="small muted">La conversation corrigée utilise l'API Claude d'Anthropic avec <b>votre propre clé</b> (créée sur console.anthropic.com). La clé reste uniquement sur cet appareil ; les phrases que vous dites sont envoyées à l'API pour être corrigées.</p>
        <div class="field"><label>Clé API</label><input class="textin" type="password" data-k="apiKey" value="${U.esc(s.apiKey)}" placeholder="sk-ant-…" autocomplete="off"></div>
        <div class="field"><label>Modèle</label><input class="textin" data-k="aiModel" value="${U.esc(s.aiModel)}"></div>
        <label class="switch"><span>Mode sans interruption par défaut</span><input type="checkbox" data-k="noInterrupt" ${s.noInterrupt ? 'checked' : ''}></label>
        <button class="btn secondary" data-test-ai>Tester la connexion</button></div>
      <div class="card"><h2>Progression</h2>
        <label class="switch"><span>Déverrouiller toutes les leçons</span><input type="checkbox" data-k="unlockAll" ${s.unlockAll ? 'checked' : ''}></label>
        <p class="small muted">Transférez votre progression entre l'ordinateur et le téléphone : exportez le fichier, copiez-le par clé / câble USB, puis importez-le sur l'autre appareil.</p>
        <div class="grid2"><button class="btn secondary" data-export>⬇ Exporter</button><button class="btn secondary" data-import>⬆ Importer</button></div>
        <input type="file" accept=".json,application/json" class="hidden" data-file>
        <button class="btn ghost block" data-reset style="margin-top:10px;color:var(--bad)">Réinitialiser toute la progression</button></div>
      <div class="card"><h2>À propos</h2><p class="small muted">AeroEnglish · ${Object.keys(Data.words).length} mots et expressions · ${Data.lessons.length} leçons · fonctionne hors ligne (sauf reconnaissance vocale et IA, qui nécessitent Internet selon le navigateur).</p></div>
    </div>`);
    U.$$('[data-k]', m).forEach(inp => inp.addEventListener('change', () => {
      const k = inp.dataset.k;
      s[k] = inp.type === 'checkbox' ? inp.checked : (k === 'dailyGoal' ? +inp.value : inp.value.trim());
      Store.save();
      if (k === 'theme') App.applyTheme();
      if (k === 'notify' && inp.checked && 'Notification' in window) Notification.requestPermission().then(p => { if (p !== 'granted') U.toast('Notifications refusées par le navigateur'); });
      if (k === 'unlockAll' || k === 'name') App.updateTop();
      U.toast('Enregistré');
    }));
    m.querySelector('[data-test-voice]').onclick = () => Voice.say('Hello! Check the hydraulic pressure before you remove the panel.');
    m.querySelector('[data-ics]').onclick = App.downloadICS;
    m.querySelector('[data-export]').onclick = () => Store.exportFile();
    const file = m.querySelector('[data-file]');
    m.querySelector('[data-import]').onclick = () => file.click();
    file.onchange = () => {
      const f = file.files[0]; if (!f) return;
      f.text().then(t => { try { Store.importText(t); U.toast('Progression importée ✅'); App.applyTheme(); App.go('home', true); } catch (e) { U.toast('Import impossible : ' + e.message); } });
    };
    m.querySelector('[data-reset]').onclick = () => { if (confirm('Effacer toute la progression ? (Pensez à exporter avant.)')) { Store.reset(); App.go('home', true); } };
    m.querySelector('[data-test-ai]').onclick = async e => {
      const b = e.target; b.disabled = true; b.textContent = 'Test…';
      try { const r = await AI.call([{ role: 'user', content: 'Learner said: """Hello, I am agree to start the lesson."""' }], AI.system('Test', 'B1'), 1500); U.modal(`<h2>✅ Connexion réussie</h2><p>${EN.html(r.reply || '')}</p>${AI.feedbackHTML(r)}`); }
      catch (err) { U.modal(`<h2>❌ Échec</h2><p>${U.esc(err.message)}</p>`); }
      b.disabled = false; b.textContent = 'Tester la connexion';
    };
  },

  downloadICS() {
    const [hh, mm] = (Store.state.settings.reminderTime || '19:00').split(':');
    const d = new Date(); const ds = d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AeroEnglish//FR', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:aeroenglish-daily-reminder', 'DTSTAMP:' + stamp, `DTSTART:${ds}T${hh}${mm}00`, 'DURATION:PT15M', 'RRULE:FREQ=DAILY',
      'SUMMARY:✈️ AeroEnglish – 15 min d\'anglais', 'DESCRIPTION:Votre leçon d\'anglais du jour vous attend !',
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:C\'est l\'heure de votre leçon d\'anglais !', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    U.download('rappel-aeroenglish.ics', ics, 'text/calendar');
  },

  reminderLoop() {
    const tick = () => {
      const s = Store.state.settings;
      if (!s.notify || !('Notification' in window) || Notification.permission !== 'granted') return;
      const now = new Date(), [hh, mm] = s.reminderTime.split(':').map(Number), key = U.dayKey();
      if (now.getHours() * 60 + now.getMinutes() < hh * 60 + mm) return;
      if (Store.today().sessions || localStorage.getItem('aeroenglish.notified') === key) return;
      localStorage.setItem('aeroenglish.notified', key);
      try { new Notification('✈️ AeroEnglish', { body: 'Votre série vous attend : 15 minutes d\'anglais aujourd\'hui ?' }); } catch (e) { /* ignore */ }
    };
    tick(); setInterval(tick, 60000);
  },

  onboarding() {
    U.modal(`<div class="result-hero" style="padding-top:4px"><div class="plane">✈️</div><h2>Bienvenue sur AeroEnglish</h2>
      <p class="muted">Faites décoller votre anglais, à l'oral comme à l'écrit : anglais technique aéronautique et anglais conversationnel.</p></div>
      <div class="field"><label>Votre prénom</label><input class="textin" data-name placeholder="Prénom"></div>
      <button class="btn block" data-p>🧭 Passer les tests de positionnement</button>
      <button class="btn secondary block" style="margin-top:10px" data-s>Commencer depuis le début</button>`,
      (m, close) => {
        const done = () => { Store.state.settings.name = m.querySelector('[data-name]').value.trim(); Store.state.onboarded = true; Store.save(); close(); };
        m.querySelector('[data-p]').onclick = () => { done(); App.placementMenu(); };
        m.querySelector('[data-s]').onclick = () => { done(); App.go('home', true); };
      });
  }
};

document.addEventListener('DOMContentLoaded', App.init);
