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

  /* Dialogue de fin de séance généré à partir du vocabulaire de la séance :
     personnage, ouverture, types de questions et mots changent à chaque fois. */
  dynamicDialogue(W, L) {
    const conv = L.track === 'conv';
    const cast = conv ? ['oliver', 'grace', 'nadia'] : ['sam', 'nadia', 'grace'];
    let prevWho = null;
    try { prevWho = (JSON.parse(localStorage.getItem('aeroenglish.lastDialogue')) || {}).who; } catch (e) { /* ignore */ }
    const who = U.pick(cast.filter(c => c !== prevWho));
    const pool = W.length >= 3 ? W : W.concat(Data.cats[L.cat].words.filter(w => !W.includes(w)));
    const others = w => U.shuffle(pool.filter(x => x.id !== w.id && U.norm(x.en) !== U.norm(w.en)).concat(
      Data.cats[L.cat].words.filter(x => x.id !== w.id && !pool.includes(x))));
    const name = w => U.main(w.en);
    const scramble = (sent, alt) => {
      const end = (String(sent).match(/[.?!]$/) || ['.'])[0];
      const keepCap = x => /^(I|I'm|I'd|I'll|I've)$/.test(x) || /^[A-Z0-9][A-Z0-9/-]+$/.test(x) || /^[A-Z][a-z]+$/.test(x) && false;
      const t = U.tokens(sent).map((x, k) => k === 0 && !keepCap(x) && !/^[A-Z]{2,}/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x);
      if (t.length < 4) return alt;
      const i = 1 + Math.floor(Math.random() * (t.length - 2));
      [t[i], t[i - 1]] = [t[i - 1], t[i]];
      t[0] = t[0].charAt(0).toUpperCase() + t[0].slice(1);
      const out = t.join(' ') + end;
      return U.norm(out) === U.norm(sent) ? alt : out;
    };
    /* Mémoire du dernier dialogue : on évite de reprendre le même personnage, la même ouverture, etc. */
    let last = {};
    try { last = JSON.parse(localStorage.getItem('aeroenglish.lastDialogue')) || {}; } catch (e) { last = {}; }
    const pickNew = (arr, key) => { const ids = arr.map((_, i) => i).filter(i => i !== last[key]); const i = U.pick(ids.length ? ids : [0]); mem[key] = i; return arr[i]; };
    const mem = {};
    const openers = conv ? [
      ["Hello! Let's practise the expressions from today's lesson. Are you ready?", "Bonjour ! Pratiquons les expressions de la leçon du jour. Tu es prêt ?"],
      ["Hi there! I'd like to have a quick chat with you using today's expressions. OK?", "Salut ! J'aimerais discuter rapidement avec toi en utilisant les expressions du jour. D'accord ?"],
      ["Good to see you again! Shall we check what you remember from today?", "Content de te revoir ! On vérifie ce dont tu te souviens aujourd'hui ?"],
      ["Hey! Have you got five minutes? I'd like to test your English.", "Salut ! Tu as cinq minutes ? J'aimerais tester ton anglais."],
      ["Good afternoon! Let's have a little conversation before you leave.", "Bon après-midi ! Discutons un peu avant que tu partes."],
      ["Nice to see you! Let's see if today's expressions are clear for you.", "Ravi de te voir ! Voyons si les expressions du jour sont claires pour toi."]
    ] : [
      ["Hi! Before the end of the shift, let's check today's vocabulary. Ready?", "Salut ! Avant la fin de l'équipe, vérifions le vocabulaire du jour. Prêt ?"],
      ["Welcome back to the hangar! I've got a few questions about the words you've just learnt.", "Bon retour au hangar ! J'ai quelques questions sur les mots que tu viens d'apprendre."],
      ["Good morning! The aircraft is ready for you, but first, a quick vocabulary check. OK?", "Bonjour ! L'avion t'attend, mais d'abord, une petite vérification du vocabulaire. D'accord ?"],
      ["Hello! Let's talk about what you've studied today.", "Bonjour ! Parlons de ce que tu as étudié aujourd'hui."],
      ["Hey! We're waiting for a spare part, so let's use the time to practise your English.", "Salut ! On attend une pièce de rechange, profitons-en pour pratiquer ton anglais."],
      ["Good evening! Night shift again? Let's start with a short vocabulary briefing.", "Bonsoir ! Encore de nuit ? Commençons par un petit briefing de vocabulaire."],
      ["Hi! The inspection is finished. Can I ask you a few questions about today's words?", "Salut ! L'inspection est terminée. Je peux te poser quelques questions sur les mots du jour ?"],
      ["Morning! Coffee first, then a quick English check. Is that OK with you?", "Bonjour ! D'abord un café, puis une petite vérification d'anglais. Ça te va ?"]
    ];
    const readyAns = pickNew([
      [["Yes, I'm ready.", "Yes, I ready.", "Yes, I am agree."], "Oui, je suis prêt."],
      [["OK, let's go!", "OK, let's going!", "OK, we go yesterday."], "D'accord, allons-y !"],
      [["Sure, no problem.", "Sure, no problems is.", "Sure, I am no problem."], "Bien sûr, pas de problème."],
      [["Of course, go ahead.", "Of course, go ahead you.", "Of course, I go ahead yesterday."], "Bien sûr, vas-y."],
      [["Yes, I'd like that.", "Yes, I'd like it that.", "Yes, I would liking that."], "Oui, avec plaisir."],
      [["Sounds good to me!", "Sound good for me!", "It sound good to me!"], "Ça me va !"]
    ], 'ready');
    const react = () => U.pick(['Exactly!', 'Well done.', 'Perfect.', "That's right.", 'Good answer.', 'Great.', 'Spot on!', 'Correct.', 'Very good.', 'Nice one.']);
    const allTypes = ['meaning', 'name', 'example', 'translate', 'gap', 'english'];
    let types = U.shuffle(allTypes);
    if (types[0] === last.firstType) types.push(types.shift());
    mem.firstType = types[0];
    const nWords = Math.min(W.length, U.pick([3, 4]));
    let chosen = U.sample(W, nWords);
    if (last.words && W.length > nWords) chosen = U.sample(W.filter(w => !last.words.includes(w.id)), nWords).concat(U.sample(W, nWords)).filter((w, i, a) => a.indexOf(w) === i).slice(0, nWords);
    mem.words = chosen.map(w => w.id);
    const lines = [];
    const op = pickNew(openers, conv ? 'opC' : 'opA');
    lines.push({ t: op[0], fr: op[1] });
    lines.push({ s: readyAns[0], fr: readyAns[1] });
    const firsts = conv ? ['First one. ', "Let's start. ", 'Question one. '] : ['First question. ', "Let's begin. ", 'OK, first one. '];
    chosen.forEach((w, i) => {
      const [d1, d2] = others(w);
      if (!d1 || !d2) return;
      const pre = i === 0 ? U.pick(firsts) : react() + ' ';
      let ty = types[i % types.length];
      const gap = ty === 'gap' ? EN.findInEx(w) : null;
      if (ty === 'gap' && (!gap || U.tokens(w.ex).length < 4 || gap.match.length > w.ex.length / 2)) ty = 'translate';
      if (ty === 'english' && U.norm(EN.frQ(w.fr)) === U.norm(name(w))) ty = 'meaning';
      const before = lines.length;
      if (ty === 'meaning') {
        lines.push({ t: pre + U.pick([`What does "${name(w)}" mean?`, `Can you explain the word "${name(w)}"?`, `"${name(w)}": what is it?`]), fr: `Que signifie « ${name(w)} » ?`, plain: true });
        lines.push({ s: [EN.defQ(w), EN.defQ(d1), EN.defQ(d2)], fr: '= ' + EN.frQ(w.fr), plain: true });
      } else if (ty === 'name') {
        lines.push({ t: pre + (conv ? `Which expression do we use for this: ${EN.defQ(w).replace(/\.$/, '').replace(/^./, c => c.toLowerCase())}?` : `${EN.defQ(w)} ${U.pick(['What do we call that?', 'What is the word for that?', 'Do you remember the name?'])}`),
          fr: conv ? 'Quelle expression utilise-t-on pour cela ?' : 'Comment appelle-t-on cela ?', plain: true });
        const f = x => conv ? `We say: "${name(x)}"` : `It's called "${name(x)}".`;
        lines.push({ s: [f(w), f(d1), f(d2)], fr: (conv ? 'On dit : ' : "Ça s'appelle : ") + '« ' + name(w) + ' » (' + EN.frQ(w.fr) + ')', plain: true });
      } else if (ty === 'example') {
        lines.push({ t: pre + U.pick([`Can you use "${name(w)}" in a sentence?`, `Give me an example with "${name(w)}", please.`, `Make a sentence with "${name(w)}".`]), fr: `Peux-tu utiliser « ${name(w)} » dans une phrase ?`, plain: true });
        lines.push({ s: [w.ex, scramble(w.ex, d2.ex), d1.ex], fr: w.exFr });
      } else if (ty === 'gap') {
        lines.push({ t: pre + `Complete my sentence: "${gap.before}…${gap.after}"`, fr: `Complète ma phrase : « ${w.exFr} »`, plain: true });
        const g = x => (EN.findInEx(x) || { match: name(x) }).match;
        lines.push({ s: U.uniq([gap.match, g(d1), g(d2)]).length === 3 ? [gap.match, g(d1), g(d2)] : [gap.match, name(d1), name(d2)], fr: w.exFr, plain: true });
      } else if (ty === 'english') {
        lines.push({ t: pre + U.pick([`What's the English for « ${EN.frQ(w.fr)} »?`, `How do you say « ${EN.frQ(w.fr)} » in English?`]), fr: `Comment dit-on « ${EN.frQ(w.fr)} » en anglais ?`, plain: true });
        lines.push({ s: [name(w), name(d1), name(d2)], fr: EN.frQ(w.fr), plain: true });
      } else {
        lines.push({ t: pre + `How would you say this in English: « ${w.exFr} »`, fr: 'Comment dirais-tu ceci en anglais ?' });
        lines.push({ s: [w.ex, scramble(w.ex, d2.ex), d1.ex], fr: w.exFr });
      }
      // Sécurité : si deux réponses proposées sont identiques, on passe à la traduction de phrase
      const sl = lines[lines.length - 1];
      if (sl.s && U.uniq(sl.s.map(U.norm)).length < sl.s.length) {
        lines.length = before;
        lines.push({ t: pre + `How would you say this in English: « ${w.exFr} »`, fr: 'Comment dirais-tu ceci en anglais ?' });
        lines.push({ s: [w.ex, scramble(w.ex, d2.ex), d1.ex], fr: w.exFr });
      }
    });
    const close = pickNew([
      ["Excellent work today. See you next time!", "Excellent travail aujourd'hui. À la prochaine !", [["Thank you! See you next time.", "Thank you! See you last time.", "Thanks, I see you yesterday."], "Merci ! À la prochaine."]],
      ["Great session. Don't forget to review these words tomorrow.", "Super séance. N'oublie pas de réviser ces mots demain.", [["I won't forget. Thanks for your help!", "I don't will forget. Thanks your help!", "I forget not. Thank for help!"], "Je n'oublierai pas. Merci pour ton aide !"]],
      ["You're making good progress. Any questions?", "Tu progresses bien. Des questions ?", [["No, it's clear. Thank you very much!", "No, it's clearly. Thank you much very!", "No, I am clear. Thanks you!"], "Non, c'est clair. Merci beaucoup !"]],
      ["That's all for today. Have a good rest!", "C'est tout pour aujourd'hui. Repose-toi bien !", [["Thanks, you too. Bye!", "Thanks, you also. Bye!", "Thank, you too. Goodbye yesterday!"], "Merci, toi aussi. Salut !"]],
      ["Your English is getting better every day. Keep going!", "Ton anglais s'améliore chaque jour. Continue !", [["Thank you, I'll keep practising.", "Thank you, I keep practise.", "Thank you, I will to practise."], "Merci, je vais continuer à m'entraîner."]],
      ["Good job! Shall we do another lesson tomorrow?", "Bon travail ! On fait une autre leçon demain ?", [["Yes, see you tomorrow!", "Yes, see you yesterday!", "Yes, I see you tomorrow ago!"], "Oui, à demain !"]]
    ], 'close');
    lines.push({ t: react() + ' ' + close[0], fr: close[1] });
    lines.push({ s: close[2][0], fr: close[2][1] });
    mem.who = who;
    try { localStorage.setItem('aeroenglish.lastDialogue', JSON.stringify(mem)); } catch (e) { /* ignore */ }
    const ch = CHARACTERS[who];
    return { cat: L.cat, who, title: conv ? 'Mise en pratique des expressions du jour' : 'Vérification du vocabulaire avec ' + ch.name, lines };
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
    // Dialogue : généré à partir des mots de la séance ; le bilan garde le scénario métier de la catégorie
    const own = DIALOGUES.filter(d => d.cat === L.cat);
    steps.push({ type: 'dialogue', d: review && own.length ? U.pick(own) : Lesson.dynamicDialogue(W, L) });
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
