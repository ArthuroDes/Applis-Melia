/* Construction d'une leçon (~15 min) et lecteur d'exercices */
const Lesson = {
  /* Choisit une phrase-exemple exploitable pour les exercices à trou */
  gapOK(w) { return !!EN.findInEx(w); },
  orderOK(w) { const n = U.tokens(w.ex).length; return n >= 3 && n <= 13; },

  textsFor(cat, track) {
    let t = TEXTS.filter(x => x.cat === cat);
    if (!t.length) t = TEXTS.filter(x => (Data.cats[x.cat] || {}).track === track);
    return t;
  },
  dialogueFor(cat, track, n) {
    const own = DIALOGUES.filter(d => d.cat === cat);
    if (own.length) return own[n % own.length];
    const pool = DIALOGUES.filter(d => track === 'conv' ? d.cat === 'conv' : d.cat !== 'conv');
    return pool[n % pool.length];
  },

  build(L) {
    const cat = Data.cats[L.cat], track = L.track, n = L.n;
    const review = L.kind === 'review';
    let W = L.words.map(id => Data.words[id]);
    if (review) {
      // Bilan : priorité aux mots les plus fragiles de la catégorie
      W = W.slice().sort((a, b) => (SRS.get(a.id).ef - SRS.get(b.id).ef) || (Math.random() - .5)).slice(0, 10);
    }
    const ids = W.map(w => w.id);
    const cyc = (arr, k) => arr[k % arr.length];
    const A = U.shuffle(W);
    const gapW = U.shuffle(W.filter(Lesson.gapOK));
    const ordW = U.shuffle(W.filter(Lesson.orderOK));
    const g = GRAMMAR[(n - 1) % GRAMMAR.length];
    const texts = Lesson.textsFor(L.cat, track);
    const text = texts[(L.part || 1) % texts.length];
    const text2 = texts.length > 1 ? texts[((L.part || 1) + 1) % texts.length] : text;
    const steps = [];

    if (!review) steps.push({ type: 'intro', words: ids });
    steps.push({ type: 'grammar', g });
    steps.push({ type: 'grammarQuiz', g, qi: 0 });
    steps.push({ type: 'flash', words: U.sample(ids, Math.min(review ? 8 : 6, ids.length)) });
    steps.push({ type: 'matchText', words: U.sample(ids, Math.min(5, ids.length)) });
    steps.push({ type: 'choose', dir: 'fr2en', word: cyc(A, 0).id });
    steps.push({ type: 'choose', dir: 'en2fr', word: cyc(A, 1).id });
    if (gapW.length) steps.push({ type: 'gapChoice', word: cyc(gapW, 0).id });
    if (gapW.length) steps.push({ type: 'dictation', word: cyc(gapW, 1).id });
    steps.push({ type: 'matchAudio', words: U.sample(ids, Math.min(4, ids.length)) });
    if (ordW.length) {
      steps.push({ type: 'orderEN', word: cyc(ordW, 0).id });
      steps.push({ type: 'orderFR', word: cyc(ordW, 1).id });
      steps.push({ type: 'orderTrans', word: cyc(ordW, 2).id });
    }
    steps.push({ type: 'writeTrans', word: cyc(ordW.length ? ordW : A, 3).id });
    if (gapW.length) steps.push({ type: 'gapTranslate', word: cyc(gapW, 2).id });
    steps.push({ type: 'heard', word: cyc(A, 2).id });
    steps.push({ type: 'choose', dir: 'def2en', word: cyc(A, 3).id });
    // Images à légender / reconnaissance de composants
    if (cat.diagram) {
      const labels = Diagrams.validLabels(cat.diagram);
      const inLesson = labels.filter(l => ids.includes(l.w.id));
      const items = U.uniq(inLesson.concat(U.shuffle(labels)).map(l => l.i)).slice(0, 4);
      steps.push({ type: 'diagram', key: cat.diagram, items });
    }
    const pics = W.filter(w => w.emoji);
    if (pics.length) steps.push({ type: 'picture', word: U.pick(pics).id });
    if (text) {
      steps.push({ type: 'reading', text, qs: [0, 1] });
      steps.push({ type: 'listening', text: text2, qs: text2 === text ? [2, 3] : [0, 1] });
    }
    steps.push({ type: 'grammarQuiz', g, qi: 1 });
    const rw = cyc(A, 4);
    steps.push({ type: 'speakRepeat', sentence: rw.ex, fr: rw.exFr, words: [rw.id] });
    steps.push({ type: 'speakChain', words: U.sample(ids, Math.min(4, ids.length)) });
    if (review) {
      const wp = WRITING[L.cat] || WRITING[track === 'conv' ? 'conv' : 'general'];
      steps.push({ type: 'writing', prompt: wp[0], keywords: wp[1], minWords: 15 });
    } else {
      const ww = cyc(A, 5);
      steps.push({ type: 'writing', prompt: `Écrivez une phrase personnelle en anglais avec « ${U.main(ww.en)} » (${ww.fr}).`, keywords: [U.main(ww.en).replace(/^to /i, '')], minWords: 5, words: [ww.id], model: ww.ex });
    }
    steps.push({ type: 'dialogue', d: Lesson.dialogueFor(L.cat, track, n) });
    // Évaluation finale
    const evalN = review ? 8 : 5;
    U.shuffle(W).slice(0, evalN).forEach((w, i) => steps.push({ type: 'choose', dir: ['fr2en', 'en2fr', 'def2en'][i % 3], word: w.id, eval: true }));
    return steps;
  },

  /* Séance de révision espacée */
  buildReview(ids) {
    const W = ids.map(id => Data.words[id]).filter(Boolean);
    const steps = [];
    const A = U.shuffle(W);
    if (W.length >= 4) steps.push({ type: 'matchText', words: U.sample(ids, Math.min(5, ids.length)) });
    A.forEach((w, i) => {
      const r = i % 6;
      if (r === 0) steps.push({ type: 'choose', dir: 'fr2en', word: w.id });
      else if (r === 1 && Lesson.gapOK(w)) steps.push({ type: 'dictation', word: w.id });
      else if (r === 2 && Lesson.orderOK(w)) steps.push({ type: 'orderTrans', word: w.id });
      else if (r === 3 && Lesson.gapOK(w)) steps.push({ type: 'gapTranslate', word: w.id });
      else if (r === 4) steps.push({ type: 'choose', dir: 'en2fr', word: w.id });
      else steps.push({ type: 'choose', dir: 'def2en', word: w.id });
    });
    if (W.length >= 4) steps.push({ type: 'matchAudio', words: U.sample(ids, 4) });
    if (W.length) steps.push({ type: 'speakChain', words: U.sample(ids, Math.min(4, ids.length)) });
    return steps;
  },

  /* ---------------- Lecteur ---------------- */
  run(opts) {
    // opts : { title, steps, kind: 'lesson'|'review'|'practice', lesson, onExit }
    const steps = opts.steps.slice();
    const root = document.createElement('div');
    root.className = 'lesson';
    root.innerHTML = `<div class="lesson-head"><button class="iconbtn" data-close aria-label="Quitter" style="color:var(--muted)">✕</button>
      <div class="progressbar"><div style="width:0%"></div></div><span class="small muted" data-count></span></div>
      <div class="lesson-body"></div>
      <div class="lesson-foot"><div class="inner"><div class="fb"></div><button class="btn block" data-main>Vérifier</button></div></div>`;
    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';
    const body = root.querySelector('.lesson-body'), foot = root.querySelector('.lesson-foot'), fb = root.querySelector('.fb');
    const main = root.querySelector('[data-main]'), bar = root.querySelector('.progressbar > div'), count = root.querySelector('[data-count]');
    let idx = 0, cur = null, phase = 'answer', lastResult = null;
    const stats = { graded: 0, correct: 0, evalTotal: 0, evalOk: 0, mistakes: [] };
    const baseLen = steps.length;
    let active = 0, lastAct = Date.now();
    const act = () => { const now = Date.now(); active += Math.min(now - lastAct, 60000); lastAct = now; };
    root.addEventListener('pointerdown', act, true); root.addEventListener('keydown', act, true);

    const ctx = {
      ready(b) { if (phase === 'answer') main.disabled = !b; },
      submit() { if (!main.disabled && phase === 'answer') main.click(); },
      complete(res) { finishStep(res); }
    };

    const render = () => {
      if (idx >= steps.length) return end();
      const st = steps[idx];
      phase = 'answer'; lastResult = null;
      foot.className = 'lesson-foot'; fb.innerHTML = '';
      bar.style.width = Math.round(idx / steps.length * 100) + '%';
      count.textContent = (idx + 1) + '/' + steps.length;
      body.scrollTop = 0;
      body.innerHTML = '';
      const el = document.createElement('div'); body.appendChild(el);
      try { cur = Ex[st.type](el, st, ctx); }
      catch (e) { console.error(e); idx++; return render(); }
      if (cur.self) { main.classList.add('hidden'); }
      else {
        main.classList.remove('hidden');
        main.textContent = cur.graded ? 'Vérifier' : 'Continuer';
      }
    };

    const finishStep = res => {
      const st = steps[idx];
      phase = 'feedback'; lastResult = res;
      main.classList.remove('hidden'); main.disabled = false; main.textContent = 'Continuer';
      if (res.skip) { fb.innerHTML = '<div class="feedback">⏭️ Exercice passé</div>'; return; }
      stats.graded++;
      if (res.ok) stats.correct++; else stats.mistakes.push(st);
      if (st.eval) { stats.evalTotal++; if (res.ok) stats.evalOk++; }
      if (opts.onResult) opts.onResult(st, res);
      (res.words || []).forEach(id => SRS.grade(id, res.ok ? (res.typo ? 4 : 5) : 2));
      foot.classList.add(res.ok ? 'ok' : 'bad');
      if (!res.silent) res.ok ? Voice.good() : Voice.bad();
      const praise = U.pick(['Excellent !', 'Bravo !', 'Parfait !', 'Bien joué !', 'Super !']);
      fb.innerHTML = res.ok
        ? `<div class="feedback ok">✅ <div>${praise}${res.typo ? ' <span class="small">(attention à l\'orthographe)</span>' : ''}${res.solution && (res.typo || st.type === 'writing' || st.type === 'speakRepeat' || st.type === 'speakChain') ? `<span class="sol">${res.solution}</span>` : ''}</div></div>`
        : `<div class="feedback bad">❌ <div>${res.partial || 'Bonne réponse :'}<span class="sol">${res.solution || ''}</span></div></div>`;
      if (res.say) Voice.say(res.say);
      // Les erreurs reviennent en fin de leçon (une fois)
      if (!res.ok && !st.retry && !st.eval && !opts.noRetry && ['choose', 'gapChoice', 'dictation', 'orderEN', 'orderTrans', 'gapTranslate', 'grammarQuiz', 'writeTrans'].includes(st.type)) {
        steps.push(Object.assign({}, st, { retry: true }));
      }
    };

    main.onclick = () => {
      act();
      if (phase === 'answer') {
        if (cur && cur.graded && cur.check) finishStep(cur.check());
        else { idx++; render(); }
      } else { idx++; render(); }
    };

    const close = () => { Voice.stop(); root.remove(); document.body.style.overflow = ''; Store.save(); };
    root.querySelector('[data-close]').onclick = () => {
      if (idx < 2 || confirm('Quitter la leçon ? Votre progression dans cette leçon sera perdue.')) { close(); opts.onExit && opts.onExit(null); }
    };

    const end = () => {
      act();
      const minutes = active / 60000;
      const acc = stats.graded ? stats.correct / stats.graded : 1;
      let xp = Math.round(stats.correct * 2 + (opts.kind === 'lesson' ? 10 : 4));
      const perfect = stats.mistakes.length === 0;
      if (perfect) xp += 5;
      const evalScore = stats.evalTotal ? stats.evalOk / stats.evalTotal : null;
      const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
      if (opts.lesson) {
        const rec = Store.state.lessons[opts.lesson.id] || { count: 0, best: 0 };
        rec.done = true; rec.count++; rec.best = Math.max(rec.best || 0, Math.round(acc * 100)); rec.stars = Math.max(rec.stars || 0, stars); rec.date = Date.now();
        if (evalScore != null) rec.eval = Math.round(evalScore * 100);
        Store.state.lessons[opts.lesson.id] = rec;
      }
      Store.logSession(opts.kind, opts.lesson ? opts.lesson.id : opts.kind, minutes, xp, Math.round(acc * 100));
      Voice.fanfare();
      bar.style.width = '100%';
      foot.className = 'lesson-foot'; fb.innerHTML = '';
      main.classList.remove('hidden'); main.disabled = false; main.textContent = 'Continuer';
      body.innerHTML = `<div class="result-hero"><div class="plane">✈️</div><h2>${opts.kind === 'lesson' ? 'Leçon terminée !' : 'Séance terminée !'}</h2>
        <div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div><p class="muted">${U.esc(opts.title)}</p></div>
        <div class="grid3"><div class="stat"><div class="v">+${xp}</div><div class="l">XP</div></div>
        <div class="stat"><div class="v">${Math.round(acc * 100)} %</div><div class="l">Réussite</div></div>
        <div class="stat"><div class="v">${U.fmtMin(minutes)}</div><div class="l">Temps actif</div></div></div>
        ${evalScore != null ? `<div class="card" style="margin-top:14px"><b>Évaluation finale :</b> ${stats.evalOk}/${stats.evalTotal} ${evalScore >= 0.8 ? '— palier validé ✅' : '— à retravailler, les mots reviendront en révision'}</div>` : ''}
        ${opts.summary ? opts.summary() : ''}
        <p class="small muted" style="text-align:center">Série en cours : 🔥 ${Store.streakAlive()} jour(s) · Pas de limite de temps : vous pouvez enchaîner une autre leçon.</p>`;
      main.onclick = () => { close(); opts.onExit && opts.onExit({ xp, acc }); };
    };

    render();
  }
};
