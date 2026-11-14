/* Types d'exercices. Chaque renderer reçoit (el, step, ctx) et renvoie { graded, check() }.
   ctx.ready(bool) active le bouton du bas ; ctx.complete(result) termine un exercice auto-évalué.
   result = { ok, typo, solution (html), words (ids à noter) } */

const EN = {
  /* Phrase anglaise dont chaque mot est cliquable (prononciation) */
  /* Abréviations : développées entre parenthèses (anglais – français) à leur 1re apparition */
  ABBR: {
    AMM: 'Aircraft Maintenance Manual – manuel de maintenance', IPC: 'Illustrated Parts Catalogue – catalogue illustré des pièces',
    SRM: 'Structural Repair Manual – manuel de réparation structurale', CMM: 'Component Maintenance Manual – manuel de maintenance des composants',
    WDM: 'Wiring Diagram Manual – manuel des schémas électriques', FIM: 'Fault Isolation Manual – manuel de recherche de pannes',
    TSM: 'Troubleshooting Manual – manuel de dépannage', AFM: 'Aircraft Flight Manual – manuel de vol',
    MEL: 'Minimum Equipment List – liste minimale d\'équipements', MMEL: 'Master Minimum Equipment List – liste minimale de référence',
    AD: 'Airworthiness Directive – consigne de navigabilité', ADs: 'Airworthiness Directives – consignes de navigabilité',
    SB: 'Service Bulletin – bulletin de service', EWIS: 'Electrical Wiring Interconnection System – système de câblage électrique',
    ATA: 'Air Transport Association – chapitres techniques', EASA: 'European Union Aviation Safety Agency – Agence européenne de la sécurité aérienne',
    CAA: 'Civil Aviation Authority – autorité de l\'aviation civile', FAA: 'Federal Aviation Administration – autorité américaine',
    NDT: 'Non-Destructive Testing – contrôle non destructif', APU: 'Auxiliary Power Unit – groupe auxiliaire de puissance',
    CRS: 'Certificate of Release to Service – certificat de remise en service', PPE: 'Personal Protective Equipment – équipement de protection individuelle',
    FOD: 'Foreign Object Debris – corps étrangers / débris', 'P/N': 'Part Number – référence de pièce', 'S/N': 'Serial Number – numéro de série',
    NLG: 'Nose Landing Gear – train avant', MLG: 'Main Landing Gear – train principal', RPM: 'Revolutions Per Minute – tours par minute',
    PSI: 'Pounds per Square Inch – livres par pouce carré', psi: 'pounds per square inch – livres par pouce carré', GPS: 'Global Positioning System – système de positionnement',
    EPI: 'Équipement de protection individuelle', CND: 'Contrôle non destructif', 'Part-66': 'réglementation des licences de maintenance',
    'Part-145': 'agrément des organismes de maintenance'
  },
  _abbrKey(clean) { return EN.ABBR[clean] ? clean : null; },
  /* skip : expansions à ne pas révéler (ex. question « que signifie CRS ? ») */
  html(sentence, skip) {
    if (skip === true) return EN.html(sentence, Object.keys(EN.ABBR));
    const seen = new Set((skip || []).concat(EN.abbrSkip([sentence])));
    return String(sentence).split(/(\s+)/).map(tok => {
      if (/^\s+$/.test(tok)) return tok;
      const clean = tok.replace(/^[^\w'/-]+|[^\w'/-]+$/g, '');
      if (!clean) return U.esc(tok);
      let out = `<span class="en-word" data-say="${U.esc(clean)}">${U.esc(tok)}</span>`;
      const k = EN._abbrKey(clean);
      if (k && !seen.has(k)) {
        seen.add(k);
        const trail = tok.slice(tok.lastIndexOf(clean) + clean.length), head = tok.slice(0, tok.length - trail.length);
        out = `<span class="en-word" data-say="${U.esc(clean)}">${U.esc(head)}</span> <span class="abbr">(${U.esc(EN.ABBR[k])})</span>${U.esc(trail)}`;
      }
      return out;
    }).join('');
  },
  /* Version texte simple (options de QCM, questions) */
  abbr(text, skip) {
    const seen = new Set((skip || []).concat(EN.abbrSkip([text])));
    return U.esc(text).replace(/(^|[^\w/-])([A-Za-z]+(?:[/-][A-Za-z0-9]+)?)(?=$|[^\w/-])/g, (m, pre, w) => {
      const k = EN._abbrKey(w);
      if (!k || seen.has(k)) return m;
      seen.add(k); return `${pre}${w} <span class="abbr">(${U.esc(EN.ABBR[k])})</span>`;
    });
  },
  /* Pour les questions qui TESTENT un mot : on retire du français et des définitions
     la signification anglaise des abréviations (sinon la réponse est donnée) */
  isAbbrWord(w) { return w.cat === 'docs' || /\([A-Z/]{2,}\)/.test(w.en); },
  frQ(fr) { return String(fr).replace(/\s*\((?=[A-Z])[^)]*\)\s*$/, ''); },
  defQ(w) { return EN.isAbbrWord(w) && /^[^:]{3,60}:\s/.test(w.def) ? w.def.replace(/^[^:]+:\s*/, '').replace(/^./, c => c.toUpperCase()) : w.def; },
  /* Abréviations dont l'expansion figure dans les réponses proposées : ne pas les révéler */
  abbrSkip(options) {
    const txt = options.join(' ').toLowerCase();
    return Object.keys(EN.ABBR).filter(k => EN.ABBR[k].split(' – ').some(part => txt.includes(part.toLowerCase())));
  },
  play(text, label, opts) {
    return `<button class="playbtn ${opts || ''}" data-play="${U.esc(text)}" aria-label="${label || 'Écouter'}">🔊</button>`;
  },
  playSlow(text) { return `<button class="playbtn slow" data-play="${U.esc(text)}" data-slow="1" aria-label="Écouter au ralenti">🐢</button>`; },
  audioBar(text, big) {
    return `<div class="row" style="justify-content:center;margin:14px 0">${EN.play(text, 'Écouter', big ? 'big' : '')}${EN.playSlow(text)}</div>`;
  },
  levelTag(w) { return `<span class="level l${w.level}">${Data.levelLabel(w.level)}</span>`; },
  illus(w) { return w.emoji || Data.cats[w.cat].icon; },
  /* Trouve le mot dans sa phrase d'exemple pour créer un trou */
  findInEx(w, sentence) {
    sentence = sentence || w.ex;
    let cands = U.variants(w.en).map(v => v.replace(/^to /i, '').replace(/\s*\(.*?\)/g, '').replace(/[?.!,…]+$/, '').trim());
    (w.en.match(/\(([^)]+)\)/g) || []).forEach(p => cands.push(p.slice(1, -1)));
    cands = cands.concat(cands.filter(c => /s$/i.test(c) && c.length > 4).map(c => c.slice(0, -1)));
    cands = U.uniq(cands.filter(v => v.length > 1 && !/^(UK|US)$/.test(v))).sort((a, b) => b.length - a.length);
    for (const c of cands) {
      const re = new RegExp('(^|[^\\w])(' + c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(s|es|ed|d|ing)?(?![\\w])', 'i');
      const m = sentence.match(re);
      if (m) { const st = m.index + m[1].length, word = m[2] + (m[3] || ''); return { before: sentence.slice(0, st), match: word, after: sentence.slice(st + word.length) }; }
    }
    return null;
  }
};

const Ex = {
  /* ---------- Présentation du vocabulaire ---------- */
  intro(el, step, ctx) {
    let i = 0;
    const draw = () => {
      const w = Data.words[step.words[i]];
      SRS.seen(w.id);
      const mine = SRS.isMine(w.id);
      el.innerHTML = `<div class="ex-kind">Nouveau vocabulaire · ${i + 1}/${step.words.length}</div>
      <div class="vcard" style="margin-top:10px">
        <div class="illus" aria-hidden="true">${EN.illus(w)}</div>
        <div class="row" style="justify-content:space-between">
          <div><div class="en" data-say="${U.esc(U.main(w.en))}">${U.esc(w.en)}</div><div class="fr">${U.esc(w.fr)}</div></div>
          <div class="row">${EN.play(U.main(w.en))}${EN.playSlow(U.main(w.en))}</div>
        </div>
        <div class="def"><b>Definition:</b> ${EN.html(w.def)}</div>
        <div class="exm"><div class="row" style="flex-wrap:nowrap"><button class="playbtn mini" data-play="${U.esc(w.ex)}">🔊</button><div>${EN.html(w.ex)}<div class="small muted">${U.esc(w.exFr)}</div></div></div></div>
        <div class="row" style="justify-content:space-between;margin-top:12px">${EN.levelTag(w)}
          <button class="addbtn ${mine ? 'on' : ''}" data-add="${w.id}">${mine ? '✓ In my vocabulary' : '＋ Add to my vocabulary'}</button></div>
      </div>
      <div class="row" style="justify-content:space-between;margin-top:12px;flex-wrap:nowrap">
        <button class="btn secondary" data-prev ${i === 0 ? 'disabled' : ''}>◀</button>
        <span class="muted small" style="text-align:center">Touchez un mot anglais pour l'entendre</span>
        <button class="btn secondary" data-next ${i === step.words.length - 1 ? 'disabled' : ''}>▶</button></div>`;
      if (Store.state.settings.autoplay) setTimeout(() => Voice.say(U.main(w.en)), 250);
      el.querySelector('[data-prev]').onclick = () => { i--; draw(); };
      el.querySelector('[data-next]').onclick = () => { i++; draw(); if (i === step.words.length - 1) ctx.ready(true); };
      if (i === step.words.length - 1) ctx.ready(true);
    };
    ctx.ready(step.words.length <= 1);
    draw();
    return { graded: false };
  },

  /* ---------- Grammaire ---------- */
  grammar(el, step, ctx) {
    const g = step.g;
    el.innerHTML = `<div class="ex-kind">Point de grammaire</div><div class="ex-title">${U.esc(g.title)}</div>
      <div class="card" style="background:var(--beige-3)"><p style="margin:0">${g.fr}</p></div>
      ${g.ex.map(([en, fr]) => `<div class="card row" style="flex-wrap:nowrap"><button class="playbtn mini" data-play="${U.esc(en)}">🔊</button><div>${EN.html(en)}<div class="small muted">${U.esc(fr)}</div></div></div>`).join('')}`;
    ctx.ready(true);
    return { graded: false };
  },
  grammarQuiz(el, step, ctx) {
    const [q, opts, ans] = step.g.quiz[step.qi];
    return Ex._mc(el, ctx, { kind: 'Grammaire · ' + step.g.title, title: 'Complétez la phrase', prompt: EN.html(q), options: opts, answer: opts[ans], words: [] });
  },

  /* ---------- QCM générique ---------- */
  _mc(el, ctx, o) {
    const opts = U.shuffle(o.options);
    let sel = null;
    el.innerHTML = `<div class="ex-kind">${o.kind}</div><div class="ex-title">${o.title}</div>
      ${o.top || ''}<div class="prompt">${o.prompt || ''}</div>
      <div class="choices ${o.grid ? 'grid2' : ''}">${opts.map((x, i) => `<button class="choice" data-i="${i}" ${o.sayOptions ? `data-say="${U.esc(U.main(x))}"` : ''}>${o.render ? o.render(x) : U.esc(x)}</button>`).join('')}</div>`;
    U.$$('.choice', el).forEach(b => b.addEventListener('click', () => {
      U.$$('.choice', el).forEach(c => c.classList.remove('sel'));
      b.classList.add('sel'); sel = opts[+b.dataset.i]; ctx.ready(true);
    }));
    ctx.ready(false);
    return {
      graded: true,
      check() {
        const ok = sel === o.answer;
        U.$$('.choice', el).forEach(c => { const v = opts[+c.dataset.i]; if (v === o.answer) c.classList.add('right'); else if (v === sel) c.classList.add('wrong'); });
        return { ok, solution: U.esc(o.answer), words: o.words, say: o.sayAnswer };
      }
    };
  },

  /* ---------- QCM libre (tests de positionnement) ---------- */
  mcq(el, step, ctx) {
    return Ex._mc(el, ctx, { kind: step.kind || 'Question', title: step.title || 'Choisissez la bonne réponse', prompt: EN.abbr(step.q, EN.abbrSkip(step.options)), options: step.options, answer: step.answer, words: [] });
  },

  /* ---------- Choisir la traduction ---------- */
  choose(el, step, ctx) {
    const w = Data.words[step.word];
    const kind = step.eval ? 'Évaluation finale' : 'Traduction';
    if (step.dir === 'en2fr') {
      return Ex._mc(el, ctx, { kind, title: 'Quelle est la traduction ?', top: `<div class="row">${EN.play(U.main(w.en))}<div class="prompt" style="margin:0"><b>${EN.html(w.en, true)}</b></div></div>`,
        options: U.uniq([EN.frQ(w.fr)].concat(Data.distractors(w, 3, 'fr').map(EN.frQ))), answer: EN.frQ(w.fr), words: [w.id] });
    }
    if (step.dir === 'def2en' && !(EN.isAbbrWord(w) && EN.defQ(w) === w.def)) {
      return Ex._mc(el, ctx, { kind, title: 'Quel mot correspond à cette définition ?', prompt: EN.html(EN.defQ(w), true),
        options: [w.en].concat(Data.distractors(w, 3)), answer: w.en, words: [w.id], sayOptions: true, sayAnswer: U.main(w.en) });
    }
    return Ex._mc(el, ctx, { kind, title: 'Choisissez la bonne traduction anglaise', prompt: `« <b>${U.esc(EN.frQ(w.fr))}</b> »`,
      options: [w.en].concat(Data.distractors(w, 3)), answer: w.en, words: [w.id], sayOptions: true, sayAnswer: U.main(w.en) });
  },

  /* ---------- Reconnaissance d'image / composant ---------- */
  picture(el, step, ctx) {
    const w = Data.words[step.word];
    return Ex._mc(el, ctx, { kind: 'Reconnaissance', title: 'Quel est ce composant / cet objet ?',
      top: `<div class="vcard"><div class="illus" style="height:120px;font-size:5rem">${EN.illus(w)}</div><div class="center muted small" style="text-align:center">${U.esc(EN.defQ(w))}</div></div>`,
      options: [w.en].concat(Data.distractors(w, 3)), answer: w.en, words: [w.id], sayOptions: true, sayAnswer: U.main(w.en) });
  },

  /* ---------- Phrase à trou (choix) ---------- */
  gapChoice(el, step, ctx) {
    const w = Data.words[step.word], f = EN.findInEx(w);
    const opts = [f.match].concat(Data.distractors(w, 3).map(x => U.main(x)));
    return Ex._mc(el, ctx, { kind: 'Exercice à trous', title: 'Complétez la phrase',
      prompt: `${EN.html(f.before)} <b style="color:var(--accent)">_____</b> ${EN.html(f.after)}${EN.isAbbrWord(w) ? '' : `<div class="small muted" style="margin-top:6px">${U.esc(w.exFr)}</div>`}`,
      options: U.uniq(opts), answer: f.match, words: [w.id], sayOptions: true, sayAnswer: w.ex });
  },

  /* ---------- Paires écrites ---------- */
  matchText(el, step, ctx) { return Ex._pairs(el, step, ctx, false); },
  matchAudio(el, step, ctx) { return Ex._pairs(el, step, ctx, true); },
  _pairs(el, step, ctx, audio) {
    const ws = step.words.map(id => Data.words[id]);
    const left = U.shuffle(ws), right = U.shuffle(ws);
    let selL = null, selR = null, done = 0, errors = 0;
    const errWords = new Set();
    el.innerHTML = `<div class="ex-kind">Travail du vocabulaire</div><div class="ex-title">${audio ? "Associez l'audio anglais au mot français" : 'Trouvez les paires'}</div>
      <div class="pairs"><div class="col">${left.map(w => audio
        ? `<button class="pair" data-l="${w.id}" aria-label="audio">🔊</button>`
        : `<button class="pair" data-l="${w.id}" data-say="${U.esc(U.main(w.en))}">${U.esc(U.main(w.en))}</button>`).join('')}</div>
      <div class="col">${right.map(w => `<button class="pair" data-r="${w.id}">${U.esc(EN.frQ(w.fr))}</button>`).join('')}</div></div>`;
    const tryMatch = () => {
      if (!selL || !selR) return;
      const bl = el.querySelector(`[data-l="${selL}"]`), br = el.querySelector(`[data-r="${selR}"]`);
      if (selL === selR) {
        bl.classList.add('done'); br.classList.add('done'); bl.classList.remove('sel'); br.classList.remove('sel');
        Voice.click(); done++;
        if (!errWords.has(selL)) SRS.grade(selL, 5);
        if (done === ws.length) {
          Voice.good();
          ctx.complete({ ok: errors === 0, solution: errors ? errors + ' erreur(s)' : '', words: [], silent: true });
        }
      } else {
        [bl, br].forEach(b => { b.classList.add('err'); setTimeout(() => b.classList.remove('err', 'sel'), 400); });
        errors++; errWords.add(selL); errWords.add(selR); SRS.grade(selL, 2); SRS.grade(selR, 2); Voice.bad();
      }
      selL = selR = null;
    };
    U.$$('[data-l]', el).forEach(b => b.addEventListener('click', () => {
      U.$$('[data-l]', el).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); selL = b.dataset.l;
      if (audio) Voice.say(U.main(Data.words[selL].en));
      tryMatch();
    }));
    U.$$('[data-r]', el).forEach(b => b.addEventListener('click', () => {
      U.$$('[data-r]', el).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); selR = b.dataset.r; tryMatch();
    }));
    ctx.ready(false);
    return { graded: true, self: true };
  },

  /* ---------- Flashcards ---------- */
  flash(el, step, ctx) {
    let i = 0, known = 0;
    const draw = () => {
      if (i >= step.words.length) {
        el.innerHTML = `<div class="ex-kind">Flashcards</div><div class="result-hero"><div style="font-size:3rem">🗂️</div><h2>${known}/${step.words.length} mots connus</h2><p class="muted">Les mots à revoir reviendront plus souvent.</p></div>`;
        ctx.ready(true); return;
      }
      const w = Data.words[step.words[i]], fr2en = i % 2 === 1;
      el.innerHTML = `<div class="ex-kind">Flashcards anglais / français · ${i + 1}/${step.words.length}</div>
        <p class="muted small">Touchez la carte pour la retourner.</p>
        <div class="flip"><div class="inner">
          <div class="face front">${fr2en ? U.esc(w.fr) : U.esc(w.en)}<div style="font-size:2.4rem;margin-top:8px">${EN.illus(w)}</div></div>
          <div class="face back">${fr2en ? U.esc(w.en) : U.esc(w.fr)}<div class="small muted" style="font-weight:400;margin-top:8px">${U.esc(w.ex)}</div></div>
        </div></div>
        <div class="grid2" style="margin-top:14px"><button class="btn bad" data-k="0">✗ À revoir</button><button class="btn ok" data-k="1">✓ Je savais</button></div>`;
      const card = el.querySelector('.flip');
      card.onclick = () => { card.classList.toggle('flipped'); if (card.classList.contains('flipped') === fr2en) Voice.say(U.main(w.en)); };
      if (!fr2en) setTimeout(() => Voice.say(U.main(w.en)), 200);
      U.$$('[data-k]', el).forEach(b => b.onclick = () => { const k = +b.dataset.k; known += k; SRS.grade(w.id, k ? 4 : 2); i++; draw(); });
    };
    ctx.ready(false);
    draw();
    return { graded: false };
  },

  /* ---------- Dictée : écrire le mot manquant entendu ---------- */
  dictation(el, step, ctx) {
    const w = Data.words[step.word], f = EN.findInEx(w);
    el.innerHTML = `<div class="ex-kind">Production écrite / compréhension orale</div><div class="ex-title">Écoutez et écrivez le mot manquant</div>
      ${EN.audioBar(w.ex, true)}
      <div class="prompt">${U.esc(f.before)} <input class="textin" style="display:inline-block;width:auto;min-width:140px;padding:6px 10px" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="mot manquant"> ${U.esc(f.after)}</div>`;
    const inp = el.querySelector('input');
    inp.addEventListener('input', () => ctx.ready(inp.value.trim().length > 0));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) ctx.submit(); });
    setTimeout(() => Voice.say(w.ex), 300);
    ctx.ready(false);
    return { graded: true, check() { const r = U.check(inp.value, f.match); return { ok: !!r, typo: r === 'typo', solution: U.esc(f.match), words: [w.id] }; } };
  },

  /* ---------- Remise en ordre (3 variantes) ---------- */
  _order(el, ctx, o) {
    const target = U.tokens(o.target);
    const tiles = U.shuffle(target.concat(o.extra || []));
    const picked = [];
    el.innerHTML = `<div class="ex-kind">${o.kind}</div><div class="ex-title">${o.title}</div>${o.top || ''}
      <div class="answer-zone" aria-label="Votre réponse"></div><div class="tiles">${tiles.map((t, i) => `<button class="wtile" data-i="${i}" ${o.sayTiles ? `data-say="${U.esc(t)}"` : ''}>${U.esc(t)}</button>`).join('')}</div>`;
    const zone = el.querySelector('.answer-zone');
    const redraw = () => {
      zone.innerHTML = picked.map((i, k) => `<button class="wtile on" data-k="${k}">${U.esc(tiles[i])}</button>`).join('');
      U.$$('[data-k]', zone).forEach(b => b.onclick = () => { const i = picked.splice(+b.dataset.k, 1)[0]; el.querySelector(`.tiles [data-i="${i}"]`).classList.remove('used'); redraw(); });
      ctx.ready(picked.length > 0);
    };
    U.$$('.tiles .wtile', el).forEach(b => b.addEventListener('click', () => { if (b.classList.contains('used')) return; b.classList.add('used'); picked.push(+b.dataset.i); redraw(); }));
    ctx.ready(false);
    return {
      graded: true,
      check() {
        const ans = picked.map(i => tiles[i]).join(' ');
        const ok = U.norm(ans) === U.norm(target.join(' '));
        return { ok, solution: U.esc(o.target), words: o.words, say: o.sayAnswer };
      }
    };
  },
  orderEN(el, step, ctx) {
    const w = Data.words[step.word];
    const extra = U.sample(U.uniq(Data.cats[w.cat].words.filter(x => x.id !== w.id).flatMap(x => U.tokens(x.ex))).filter(t => !U.tokens(w.ex).map(U.norm).includes(U.norm(t))), 3);
    setTimeout(() => Voice.say(w.ex), 300);
    return Ex._order(el, ctx, { kind: "Compréhension de l'oral", title: "Reconstituez la phrase entendue (en anglais)", top: EN.audioBar(w.ex, true), target: w.ex, extra, words: [w.id] });
  },
  orderFR(el, step, ctx) {
    const w = Data.words[step.word];
    const extra = U.sample(U.uniq(Data.cats[w.cat].words.filter(x => x.id !== w.id).flatMap(x => U.tokens(x.exFr))).filter(t => !U.tokens(w.exFr).map(U.norm).includes(U.norm(t))), 3);
    setTimeout(() => Voice.say(w.ex), 300);
    return Ex._order(el, ctx, { kind: "Compréhension de l'oral / traduction", title: 'Écoutez et traduisez en français', top: EN.audioBar(w.ex, true), target: w.exFr, extra, words: [w.id] });
  },
  orderTrans(el, step, ctx) {
    const w = Data.words[step.word];
    const extra = U.sample(U.uniq(Data.cats[w.cat].words.filter(x => x.id !== w.id).flatMap(x => U.tokens(x.ex))).filter(t => !U.tokens(w.ex).map(U.norm).includes(U.norm(t))), 3);
    return Ex._order(el, ctx, { kind: 'Traduction', title: 'Traduisez cette phrase en anglais', top: `<div class="prompt">« ${U.esc(w.exFr)} »</div>`, target: w.ex, extra, words: [w.id], sayTiles: true, sayAnswer: w.ex });
  },

  /* ---------- Traduction écrite au clavier ---------- */
  writeTrans(el, step, ctx) {
    const w = Data.words[step.word];
    el.innerHTML = `<div class="ex-kind">Traduction</div><div class="ex-title">Écrivez cette phrase en anglais</div>
      <div class="prompt">« ${U.esc(w.exFr)} »</div><p class="small muted">Indice : <b>${U.esc(w.fr)}</b> = ${U.esc(w.en)}</p>
      <textarea class="textin" autocapitalize="sentences" spellcheck="false" aria-label="Votre traduction"></textarea>`;
    const ta = el.querySelector('textarea');
    ta.addEventListener('input', () => ctx.ready(ta.value.trim().length > 2));
    ctx.ready(false);
    return {
      graded: true,
      check() {
        const s = U.sim(U.expandContractions(ta.value), U.expandContractions(w.ex));
        const ok = s >= 0.9, typo = s < 0.97;
        return { ok, typo: ok && typo, solution: U.esc(w.ex), words: [w.id], say: w.ex, partial: !ok && s > 0.7 ? 'Presque ! (' + Math.round(s * 100) + ' %)' : '' };
      }
    };
  },

  /* ---------- Trou à remplir en traduisant ---------- */
  gapTranslate(el, step, ctx) {
    const w = Data.words[step.word], f = EN.findInEx(w);
    el.innerHTML = `<div class="ex-kind">Production écrite</div><div class="ex-title">Complétez en traduisant le mot entre parenthèses</div>
      <div class="prompt">${EN.html(f.before)} <input class="textin" style="display:inline-block;width:auto;min-width:150px;padding:6px 10px" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="traduction"> ${EN.html(f.after)}</div>
      <p>(<b>${U.esc(EN.frQ(w.fr))}</b>)</p>`;
    const inp = el.querySelector('input');
    inp.addEventListener('input', () => ctx.ready(inp.value.trim().length > 0));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter' && inp.value.trim()) ctx.submit(); });
    ctx.ready(false);
    return { graded: true, check() { const r = U.check(inp.value, [f.match, w.en]); return { ok: !!r, typo: r === 'typo', solution: U.esc(f.match), words: [w.id], say: w.ex }; } };
  },

  /* ---------- Retrouver au moins 2 mots entendus ---------- */
  heard(el, step, ctx) {
    const w = Data.words[step.word];
    const said = U.uniq(U.tokens(w.ex).map(t => t.replace(/[^\w'-]/g, '')).filter(t => t.length > 2));
    const inSentence = U.sample(said, Math.min(4, said.length));
    const others = U.sample(U.uniq(Object.values(Data.words).filter(x => x.cat === w.cat && x.id !== w.id).flatMap(x => U.tokens(x.ex).map(t => t.replace(/[^\w'-]/g, ''))))
      .filter(t => t.length > 2 && !said.map(U.norm).includes(U.norm(t))), 8 - inSentence.length);
    const opts = U.shuffle(inSentence.concat(others));
    const sel = new Set();
    el.innerHTML = `<div class="ex-kind">Compréhension de l'oral</div><div class="ex-title">Sélectionnez au moins 2 mots entendus</div>
      ${EN.audioBar(w.ex, true)}<div class="choices grid2">${opts.map((o, i) => `<button class="choice" data-i="${i}" style="text-align:center">${U.esc(o)}</button>`).join('')}</div>`;
    U.$$('.choice', el).forEach(b => b.onclick = () => { const i = +b.dataset.i; sel.has(i) ? sel.delete(i) : sel.add(i); b.classList.toggle('sel'); ctx.ready(sel.size >= 2); });
    setTimeout(() => Voice.say(w.ex), 300);
    ctx.ready(false);
    return {
      graded: true,
      check() {
        const good = new Set(inSentence.map(U.norm));
        let wrong = 0, right = 0;
        U.$$('.choice', el).forEach(b => { const v = opts[+b.dataset.i], isG = good.has(U.norm(v)); if (isG) b.classList.add('right'); if (sel.has(+b.dataset.i)) { if (isG) right++; else { wrong++; b.classList.add('wrong'); } } });
        return { ok: wrong === 0 && right >= 2, solution: EN.html(w.ex), words: [w.id] };
      }
    };
  },

  /* ---------- Schéma à légender ---------- */
  diagram(el, step, ctx) {
    const labels = Diagrams.validLabels(step.key);
    const items = step.items.map(i => labels.find(l => l.i === i)).filter(Boolean);
    let k = 0, errors = 0;
    const states = {};
    const draw = () => {
      if (k >= items.length) {
        el.innerHTML = `<div class="ex-kind">Images à légender</div><div class="ex-title">${Diagrams[step.key].title}</div>${Diagrams.render(step.key, states)}`;
        Voice.good();
        ctx.complete({ ok: errors === 0, solution: errors ? errors + ' erreur(s)' : '', words: [], silent: true });
        return;
      }
      const it = items[k];
      states[it.i] = 'active';
      const opts = U.shuffle([it.w.en].concat(U.sample(labels.filter(l => l.i !== it.i).map(l => l.w.en), 3)));
      el.innerHTML = `<div class="ex-kind">Images à légender · ${k + 1}/${items.length}</div><div class="ex-title">Comment s'appelle l'élément n° ${it.i + 1} ?</div>
        ${Diagrams.render(step.key, states)}<div class="choices grid2">${opts.map(o => `<button class="choice" data-v="${U.esc(o)}">${U.esc(o)}</button>`).join('')}</div>`;
      U.$$('.choice', el).forEach(b => b.onclick = () => {
        if (b.dataset.v === it.w.en) {
          b.classList.add('right'); Voice.say(U.main(it.w.en)); SRS.grade(it.w.id, 5); states[it.i] = 'done'; k++;
          setTimeout(draw, 700);
        } else { b.classList.add('wrong'); Voice.bad(); errors++; SRS.grade(it.w.id, 2); }
      });
    };
    ctx.ready(false);
    draw();
    return { graded: true, self: true };
  },

  /* ---------- Compréhension écrite / orale ---------- */
  reading(el, step, ctx) { return Ex._comprehension(el, step, ctx, false); },
  listening(el, step, ctx) { return Ex._comprehension(el, step, ctx, true); },
  _comprehension(el, step, ctx, audio) {
    const t = step.text, qs = step.qs.map(i => t.q[i]);
    const sel = {};
    el.innerHTML = `<div class="ex-kind">${audio ? 'Compréhension orale' : 'Compréhension écrite'}</div><div class="ex-title">${U.esc(t.title)}</div>
      ${audio ? `${EN.audioBar(t.text, true)}<details class="small muted"><summary>Afficher la transcription (après écoute)</summary><p>${EN.html(t.text)}</p></details>`
              : `<div class="card"><button class="playbtn mini" data-play="${U.esc(t.text)}" style="float:right">🔊</button>${EN.html(t.text)}</div>`}
      ${qs.map((q, qi) => { const opts = U.shuffle(q[1]); q._opts = opts; return `<div class="card"><b>${EN.html(q[0])}</b><div class="choices">${opts.map((o, i) => `<button class="choice" data-q="${qi}" data-i="${i}">${U.esc(o)}</button>`).join('')}</div></div>`; }).join('')}`;
    U.$$('.choice', el).forEach(b => b.onclick = () => {
      const qi = +b.dataset.q; U.$$(`.choice[data-q="${qi}"]`, el).forEach(c => c.classList.remove('sel')); b.classList.add('sel'); sel[qi] = qs[qi]._opts[+b.dataset.i];
      ctx.ready(Object.keys(sel).length === qs.length);
    });
    if (audio) setTimeout(() => Voice.say(t.text), 400);
    ctx.ready(false);
    return {
      graded: true,
      check() {
        let ok = true;
        qs.forEach((q, qi) => {
          const right = q[1][q[2]];
          U.$$(`.choice[data-q="${qi}"]`, el).forEach(c => { const v = q._opts[+c.dataset.i]; if (v === right) c.classList.add('right'); else if (v === sel[qi]) c.classList.add('wrong'); });
          if (sel[qi] !== right) ok = false;
        });
        return { ok, solution: ok ? '' : 'Voir les bonnes réponses en vert.', words: [] };
      }
    };
  },

  /* ---------- Production orale : répéter une phrase ---------- */
  speakRepeat(el, step, ctx) {
    return Ex._speak(el, ctx, { kind: 'Production orale', title: 'Écoutez puis répétez la phrase', target: step.sentence, fr: step.fr, words: step.words || [] });
  },
  speakChain(el, step, ctx) {
    const ws = step.words.map(id => Data.words[id]);
    const target = ws.map(w => U.main(w.en)).join(', ');
    return Ex._speak(el, ctx, { kind: 'Production orale', title: 'Dites ces mots anglais à la suite', target, chain: ws, words: step.words });
  },
  _speak(el, ctx, o) {
    const sr = Voice.hasSR();
    el.innerHTML = `<div class="ex-kind">${o.kind}</div><div class="ex-title">${o.title}</div>
      ${o.chain ? `<div class="card" style="font-size:1.25rem;font-weight:800;text-align:center">${o.chain.map(w => `<span class="en-word" data-say="${U.esc(U.main(w.en))}">${U.esc(U.main(w.en))}</span>`).join(' · ')}</div>`
                : `<div class="card" style="font-size:1.2rem"><div class="row" style="flex-wrap:nowrap">${EN.play(o.target)}${EN.playSlow(o.target)}<div>${EN.html(o.target)}${o.fr ? `<div class="small muted">${U.esc(o.fr)}</div>` : ''}</div></div></div>`}
      <div style="text-align:center;margin:18px 0">${sr ? '<button class="mic" aria-label="Parler">🎤</button><p class="small muted">Appuyez, parlez, puis appuyez à nouveau quand vous avez fini.</p>'
        : '<p class="banner">🎤 La reconnaissance vocale n\'est pas disponible dans ce navigateur (utilisez Chrome ou Edge). Entraînez-vous à voix haute puis passez.</p>'}</div>
      <div class="transcript hidden"></div><div class="wordscore" style="margin-top:10px"></div>
      <button class="btn ghost block" data-skip>Je ne peux pas parler maintenant</button>`;
    const tr = el.querySelector('.transcript'), ws = el.querySelector('.wordscore');
    let handle = null, attempts = 0;
    el.querySelector('[data-skip]').onclick = () => ctx.complete({ skip: true, ok: true, solution: '', words: [] });
    const mic = el.querySelector('.mic');
    if (mic) mic.onclick = () => {
      if (handle) { handle.stop(); return; }
      mic.classList.add('rec'); tr.classList.remove('hidden'); tr.textContent = '…';
      handle = Voice.listen({
        continuous: true,
        oninterim: t => { tr.textContent = t; },
        onerror: err => { mic.classList.remove('rec'); handle = null; tr.textContent = err === 'not-allowed' ? "Micro refusé : autorisez l'accès au micro." : 'Erreur micro (' + err + ')'; },
        ondone: (text, conf) => {
          mic.classList.remove('rec'); handle = null; attempts++;
          tr.textContent = text || '(rien entendu)';
          const cmp = Voice.compare(o.target, text);
          ws.innerHTML = '<b>Résultat :</b> ' + cmp.words.map(x => `<span class="${x.ok ? 'w-ok' : 'w-bad'}" data-say="${U.esc(x.w)}">${U.esc(x.w)}</span>`).join(' ') +
            ` <span class="score-badge">${Math.round(cmp.score * 100)} %</span>` +
            (cmp.words.some(x => !x.ok) ? '<div class="small muted">Les mots soulignés n\'ont pas été reconnus : touchez-les pour les réentendre.</div>' : '');
          if (cmp.score >= 0.7) { ctx.complete({ ok: true, solution: 'Prononciation reconnue à ' + Math.round(cmp.score * 100) + ' %', words: o.words }); }
          else if (attempts >= 3) { ctx.complete({ ok: false, solution: 'Continuez à vous entraîner : ' + EN.html(o.target), words: o.words }); }
          else { Voice.bad(); ws.innerHTML += '<div class="small"><b>Réessayez</b> (essai ' + attempts + '/3).</div>'; }
        }
      });
    };
    ctx.ready(false);
    return { graded: true, self: true };
  },

  /* ---------- Petite production écrite ---------- */
  writing(el, step, ctx) {
    el.innerHTML = `<div class="ex-kind">Petite production écrite</div><div class="ex-title">${U.esc(step.prompt)}</div>
      ${step.keywords && step.keywords.length ? `<p class="small muted">Mots à utiliser : ${step.keywords.map(k => `<b data-say="${U.esc(k)}">${U.esc(k)}</b>`).join(', ')}</p>` : ''}
      <textarea class="textin" spellcheck="true" lang="en" aria-label="Votre texte"></textarea>
      <p class="small muted">Écrivez en anglais. ${Store.state.settings.apiKey ? 'Une correction détaillée par l\'IA sera proposée.' : 'Astuce : ajoutez une clé API dans les réglages pour une correction détaillée par l\'IA.'}</p>
      <div class="ai-out"></div>`;
    const ta = el.querySelector('textarea');
    ta.addEventListener('input', () => ctx.ready(U.words(ta.value).length >= 3));
    ctx.ready(false);
    return {
      graded: true,
      check() {
        const txt = ta.value, n = U.words(txt).length, low = U.norm(txt);
        const used = (step.keywords || []).filter(k => low.includes(U.norm(k)));
        const ok = n >= (step.minWords || 5) && (!step.keywords || !step.keywords.length || used.length >= 1);
        const local = AI.localCheck(txt);
        let sol = `${n} mots · ${used.length}/${(step.keywords || []).length} mots-clés utilisés.`;
        if (local.length) sol += '<br>' + local.map(x => '• ' + x).join('<br>');
        if (step.model) sol += `<br><span class="small">Exemple : ${EN.html(step.model)}</span>`;
        if (Store.state.settings.apiKey && txt.trim()) AI.correctText(txt, step.prompt).then(html => { el.querySelector('.ai-out').innerHTML = html; }).catch(e => { el.querySelector('.ai-out').innerHTML = `<p class="small muted">IA indisponible : ${U.esc(e.message)}</p>`; });
        return { ok, solution: sol, words: step.words || [] };
      }
    };
  },

  /* ---------- Conversation avec un formateur fictif ---------- */
  dialogue(el, step, ctx) {
    const d = step.d, ch = CHARACTERS[d.who];
    let li = 0, errors = 0;
    el.innerHTML = `<div class="ex-kind">Conversation avec un formateur</div>
      <div class="row" style="margin:8px 0"><div class="avatar big" style="border-color:${ch.color}">${ch.avatar}</div><div><b>${ch.name}</b><div class="small muted">${ch.role} · ${U.esc(d.title)}</div></div></div>
      <div class="chat"></div><div class="answers" style="margin-top:12px"></div>`;
    const chat = el.querySelector('.chat'), ans = el.querySelector('.answers');
    const sayT = (text, cb) => Voice.say(text, { pitch: ch.pitch, hint: ch.voiceHint, onend: cb });
    const next = () => {
      if (li >= d.lines.length) { ans.innerHTML = ''; ctx.complete({ ok: errors === 0, solution: errors ? errors + ' réponse(s) inadaptée(s)' : 'Conversation réussie !', words: [], silent: false }); return; }
      const line = d.lines[li];
      if (line.t) {
        chat.insertAdjacentHTML('beforeend', `<div class="speaker"><div class="avatar" style="border-color:${ch.color}">${ch.avatar}</div><div class="bubble them"><button class="playbtn mini" data-play="${U.esc(line.t)}" style="float:right;margin-left:6px">🔊</button>${EN.html(line.t)}<details class="tr"><summary>Traduction</summary>${U.esc(line.fr)}</details></div></div>`);
        chat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        li++; sayT(line.t); setTimeout(next, 600);
      } else {
        const right = line.s[0], opts = U.shuffle(line.s);
        ans.innerHTML = `<p class="small muted">Votre réponse (touchez ou dites-la) :</p><div class="choices">${opts.map((o, i) => `<button class="choice" data-i="${i}">${U.esc(o)}</button>`).join('')}</div>
          ${Voice.hasSR() ? '<div style="text-align:center;margin-top:10px"><button class="mic" style="width:64px;height:64px;font-size:1.6rem" aria-label="Répondre à voix haute">🎤</button></div>' : ''}`;
        const accept = () => {
          Voice.good(); ans.innerHTML = '';
          chat.insertAdjacentHTML('beforeend', `<div class="bubble me">${EN.html(right)}<div class="tr">${U.esc(line.fr)}</div></div>`);
          chat.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
          li++; setTimeout(next, 500);
        };
        U.$$('.choice', ans).forEach(b => b.onclick = () => {
          const v = opts[+b.dataset.i];
          if (v === right) accept();
          else { b.classList.add('wrong'); errors++; Voice.bad(); }
        });
        const mic = ans.querySelector('.mic');
        if (mic) { let h = null; mic.onclick = () => {
          if (h) { h.stop(); return; }
          mic.classList.add('rec');
          h = Voice.listen({ continuous: true, ondone: text => { mic.classList.remove('rec'); h = null; const c = Voice.compare(right, text); if (c.score >= 0.6) accept(); else { U.toast('Compris : « ' + (text || '…') + ' » — réessayez ou touchez une réponse.'); } }, onerror: () => { mic.classList.remove('rec'); h = null; } });
        }; }
      }
    };
    ctx.ready(false);
    next();
    return { graded: true, self: true };
  }
};
