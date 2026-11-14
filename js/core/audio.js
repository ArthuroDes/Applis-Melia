/* Audio : synthèse vocale anglaise, sons de validation, reconnaissance vocale */
const Voice = {
  voices: [],
  ctx: null,
  init() {
    if ('speechSynthesis' in window) {
      const load = () => { Voice.voices = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)); };
      load();
      speechSynthesis.onvoiceschanged = load;
    }
  },
  hasTTS() { return 'speechSynthesis' in window; },
  pickVoice(hint) {
    const pref = Store.state.settings.voice;
    let v = Voice.voices.find(v => v.voiceURI === pref);
    if (v && !hint) return v;
    const gb = Voice.voices.filter(v => /en[-_]GB/i.test(v.lang));
    const pool = gb.length ? gb : Voice.voices;
    if (hint) {
      const re = hint === 'female' ? /female|woman|libby|sonia|hazel|susan|serena|kate|martha|fiona|moira|tessa|samantha|google uk english female/i
                                   : /male|man|ryan|george|daniel|arthur|oliver|thomas|google uk english male/i;
      const m = pool.find(x => re.test(x.name) && !(hint === 'male' && /female/i.test(x.name)));
      if (m) return m;
    }
    return v || pool[0] || null;
  },
  /* Prononce un texte anglais. opts : { slow, pitch, hint, onend } */
  say(text, opts) {
    opts = opts || {};
    if (!Voice.hasTTS() || !text) { if (opts.onend) setTimeout(opts.onend, 50); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s\/\s/g, ', or, ').replace(/\(([A-Z/]+)\)/g, ''));
    u.lang = 'en-GB';
    const v = Voice.pickVoice(opts.hint);
    if (v) { u.voice = v; u.lang = v.lang; }
    const slow = opts.slow != null ? opts.slow : Store.state.settings.slow;
    u.rate = slow ? 0.6 : 0.95;
    u.pitch = opts.pitch || 1;
    if (opts.onend) { u.onend = opts.onend; u.onerror = opts.onend; }
    speechSynthesis.speak(u);
  },
  stop() { if (Voice.hasTTS()) speechSynthesis.cancel(); },

  /* Sons générés (aucun fichier externe) */
  tone(notes, type, vol) {
    if (!Store.state.settings.sound) return;
    try {
      Voice.ctx = Voice.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const ctx = Voice.ctx, t0 = ctx.currentTime + 0.01;
      notes.forEach(([f, start, dur]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type || 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, t0 + start);
        g.gain.linearRampToValueAtTime(vol || 0.18, t0 + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + start + dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(t0 + start); o.stop(t0 + start + dur + 0.05);
      });
    } catch (e) { /* audio indisponible */ }
  },
  good() { Voice.tone([[784, 0, 0.14], [1047, 0.09, 0.22], [1319, 0.18, 0.3]], 'triangle', 0.2); },
  bad() { Voice.tone([[196, 0, 0.18], [165, 0.12, 0.28]], 'square', 0.07); },
  fanfare() { Voice.tone([[523, 0, .15], [659, .12, .15], [784, .24, .15], [1047, .36, .5], [784, .55, .12], [1047, .66, .6]], 'triangle', 0.18); },
  click() { Voice.tone([[1200, 0, 0.04]], 'sine', 0.05); },

  /* Reconnaissance vocale (Chrome/Edge/Safari). Mode « sans interruption » : on écoute
     jusqu'à ce que l'utilisateur appuie sur « J'ai fini ». */
  hasSR() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
  listen(opts) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { opts.onerror && opts.onerror('unsupported'); return null; }
    Voice.stop();
    const rec = new SR();
    rec.lang = 'en-GB';
    rec.interimResults = true;
    rec.continuous = !!opts.continuous;
    rec.maxAlternatives = 3;
    let finals = [], confs = [], stopped = false, interim = '';
    rec.onresult = e => {
      interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) { finals.push(r[0].transcript.trim()); confs.push(r[0].confidence || 0); }
        else interim += r[0].transcript;
      }
      opts.oninterim && opts.oninterim((finals.join(' ') + ' ' + interim).trim());
    };
    rec.onerror = e => { if (e.error === 'no-speech' && opts.continuous && !stopped) return; opts.onerror && opts.onerror(e.error); };
    rec.onend = () => {
      // En mode continu, le navigateur coupe parfois tout seul : on relance tant que l'utilisateur n'a pas fini.
      if (opts.continuous && !stopped) { try { rec.start(); return; } catch (e) { /* ignore */ } }
      const text = (finals.join(' ') + ' ' + interim).trim();
      const conf = confs.length ? confs.reduce((a, b) => a + b, 0) / confs.length : 0;
      opts.ondone && opts.ondone(text, conf);
    };
    try { rec.start(); } catch (e) { opts.onerror && opts.onerror('start'); return null; }
    return { stop() { stopped = true; try { rec.stop(); } catch (e) { /* ignore */ } } };
  },

  /* Compare ce qui a été dit à la phrase attendue, mot à mot */
  compare(target, said) {
    const t = U.words(U.expandContractions(target)), s = U.words(U.expandContractions(said));
    const used = new Array(s.length).fill(false);
    const res = t.map(w => {
      let idx = s.findIndex((x, i) => !used[i] && (x === w || (w.length > 4 && U.lev(x, w) <= 1)));
      if (idx >= 0) { used[idx] = true; return { w, ok: true }; }
      return { w, ok: false };
    });
    const score = t.length ? res.filter(r => r.ok).length / t.length : 0;
    return { words: res, score };
  }
};
