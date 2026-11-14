/* Tuteur IA : appel direct à l'API Claude depuis le navigateur avec la clé de l'utilisateur.
   Sans clé (ou hors ligne) : tuteur local avec corrections de base. */
const AI = {
  URL: 'https://api.anthropic.com/v1/messages',

  SCHEMA: {
    type: 'object',
    additionalProperties: false,
    required: ['reply', 'grammar', 'vocabulary', 'pronunciation', 'fluency', 'corrected', 'score'],
    properties: {
      reply: { type: 'string', description: 'Your spoken answer as the tutor, in simple English, ending with one question to continue.' },
      corrected: { type: 'string', description: "The learner's last message rewritten in correct, natural English." },
      grammar: { type: 'string', description: 'Grammar feedback in French (errors, corrections, short rule).' },
      vocabulary: { type: 'string', description: 'Feedback in French on word choice, with better words.' },
      pronunciation: { type: 'string', description: 'Feedback in French on likely pronunciation problems based on the transcription and confidence data.' },
      fluency: { type: 'string', description: 'Feedback in French on fluency and natural phrasing.' },
      score: { type: 'integer', description: 'Overall score from 0 to 100.' }
    }
  },

  system(topic, level) {
    return `You are Mr Oliver, a friendly English tutor for a French-speaking learner who works or trains in aircraft maintenance (EASA Part-66 context). ` +
      `Learner level estimate: ${level}. Conversation topic: "${topic}". ` +
      `The learner speaks through speech recognition, so their message is a transcription; it may include recognition errors. ` +
      `Never interrupt: you always receive the learner's complete turn. ` +
      `Reply naturally in short, simple British English (2-4 sentences) and keep the conversation going with one question. ` +
      `Then give feedback in FRENCH in four parts: grammar, vocabulary, pronunciation (use the speech-recognition confidence and words that look mis-recognised as clues; say so honestly when you cannot judge), and fluency. ` +
      `Be encouraging and concrete; quote the learner's words and give the corrected version. If there is nothing to correct in a part, say "Rien à signaler 👍".`;
  },

  async call(messages, system, maxTokens) {
    const s = Store.state.settings;
    if (!s.apiKey) throw new Error('Aucune clé API configurée');
    const headers = {
      'content-type': 'application/json',
      'x-api-key': s.apiKey,
      'anthropic-version': '2026-10-21',
      'anthropic-dangerous-direct-browser-access': 'true'
    };
    const base = { model: s.aiModel || 'claude-opus-5-5', max_tokens: maxTokens || 4000, system, messages };
    // 1er essai : sortie structurée JSON + repli automatique en cas de refus
    const full = Object.assign({}, base, {
      output_config: { effort: 'low', format: { type: 'json_schema', schema: AI.SCHEMA } },
      fallbacks: 'default'
    });
    let res = await fetch(AI.URL, { method: 'POST', headers: Object.assign({ 'anthropic-beta': 'server-side-fallback-2026-07-01' }, headers), body: JSON.stringify(full) });
    if (res.status === 400) {
      // 2e essai minimal (au cas où une option ne serait pas acceptée par le modèle choisi)
      const min = Object.assign({}, base, { system: system + '\nAnswer ONLY with a JSON object with keys: reply, corrected, grammar, vocabulary, pronunciation, fluency, score.' });
      res = await fetch(AI.URL, { method: 'POST', headers, body: JSON.stringify(min) });
    }
    if (!res.ok) {
      let msg = 'Erreur ' + res.status;
      try { const j = await res.json(); msg += ' : ' + ((j.error && j.error.message) || ''); } catch (e) { /* ignore */ }
      if (res.status === 401) msg = 'Clé API invalide (401).';
      if (res.status === 429) msg = 'Trop de requêtes, réessayez dans un instant (429).';
      throw new Error(msg);
    }
    const data = await res.json();
    if (data.stop_reason === 'refusal') throw new Error('La demande a été refusée par le modèle.');
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Réponse illisible');
    return JSON.parse(m[0]);
  },

  /* Correction d'une production écrite */
  async correctText(text, prompt) {
    const sys = 'You are an English teacher for a French-speaking aviation maintenance learner. Correct the learner\'s short written text. Use the same JSON keys; "reply" = one sentence of encouragement in English; "pronunciation" = "—" (written task).';
    const r = await AI.call([{ role: 'user', content: `Task: ${prompt}\nLearner text: """${text}"""` }], sys, 2500);
    return AI.feedbackHTML(r, true);
  },

  feedbackHTML(r, written) {
    const parts = [['grammar', 'Grammar'], ['vocabulary', 'Vocabulary'], ['pronunciation', 'Prononciation'], ['fluency', 'Fluency']].filter(p => !(written && p[0] === 'pronunciation'));
    const id = 'c' + Math.random().toString(36).slice(2, 8);
    setTimeout(() => {
      const box = document.getElementById(id); if (!box) return;
      U.$$('.corr-tabs button', box).forEach(b => b.onclick = () => {
        U.$$('.corr-tabs button', box).forEach(x => x.classList.toggle('active', x === b));
        box.querySelector('.corr-body').innerHTML = U.esc(r[b.dataset.k] || '—').replace(/\n/g, '<br>');
      });
    });
    return `<div class="card" id="${id}"><div class="row" style="justify-content:space-between"><b>Correction</b><span class="score-badge">${r.score != null ? r.score : '–'}/100</span></div>
      ${r.corrected ? `<p class="small"><b>Version corrigée :</b> ${EN.html(r.corrected)} <button class="playbtn mini" data-play="${U.esc(r.corrected)}">🔊</button></p>` : ''}
      <div class="corr-tabs" style="grid-template-columns:repeat(${parts.length},1fr)">${parts.map((p, i) => `<button data-k="${p[0]}" class="${i === 0 ? 'active' : ''}">${p[1]}</button>`).join('')}</div>
      <div class="corr-body">${U.esc(r[parts[0][0]] || '—').replace(/\n/g, '<br>')}</div></div>`;
  },

  /* Vérifications locales simples (erreurs fréquentes des francophones) */
  RULES: [
    [/\bi am agree\b/i, "« I am agree » → « I agree »"],
    [/\bi have (\d+) years\b/i, "Pour l'âge : « I am … years old »"],
    [/\b(he|she|it) don't\b/i, "3e personne : « doesn't »"],
    [/\b(he|she|it) (have)\b/i, "3e personne : « has »"],
    [/\binformations\b/i, "« information » est indénombrable (pas de -s)"],
    [/\bequipments\b/i, "« equipment » est indénombrable (pas de -s)"],
    [/\badvices\b/i, "« advice » est indénombrable"],
    [/\bsince (\d+|two|three|four|five|ten) (years|months|days)\b/i, "Durée : « for … years » (since + date de départ)"],
    [/\bpeople is\b/i, "« people » est pluriel : « people are »"],
    [/\bi am (\w+)ing since\b/i, "Utilisez le present perfect : « I have been …ing since »"],
    [/\bmore (big|small|high|low|long|short|light|heavy|strong|fast|hot|cold)\b/i, "Adjectif court : « -er » (bigger, higher…)"],
    [/\bdepend of\b/i, "« depend on »"],
    [/\bexplain me\b/i, "« explain to me »"],
    [/\bdiscuss about\b/i, "« discuss something » (sans about)"],
    [/\bmust to\b/i, "Pas de « to » après must"],
    [/\bcan to\b/i, "Pas de « to » après can"],
    [/\bdid (\w+)ed\b/i, "Après did, verbe à la base (did check)"],
    [/\byesterday i (go|do|see|find|check|make|take)\b/i, "Passé : utilisez le prétérit (went, did, saw, found, checked…)"],
    [/^[a-z]/, "Commencez la phrase par une majuscule"],
    [/\bi\b(?![''])/, "« I » (je) s'écrit toujours en majuscule"]
  ],
  localCheck(text) {
    const out = [];
    AI.RULES.forEach(([re, msg]) => { if (re.test(text)) out.push(msg); });
    return out;
  },

  /* Tuteur hors ligne : relances par sujet */
  FOLLOWUPS: {
    intro: ['Nice to meet you! Where do you live?', 'What do you do in your job or studies?', 'Why is English important for you?', 'What do you like doing in your free time?'],
    day: ['What time do you usually start work?', 'What is the most interesting task in your day?', 'Who do you work with?', 'What do you do after work?'],
    weekend: ['What did you do last Saturday?', 'Did you enjoy it? Why?', 'What are you going to do next weekend?', 'Who will you spend it with?'],
    walkaround: ['Where do you start the walk-around?', 'What do you check on the wings?', 'What do you look for on the landing gear?', 'What do you do if you find damage?'],
    defect: ['Where exactly is the problem?', 'How big is the damage?', 'Is it within limits according to the manual?', 'What do you suggest we do?'],
    engine: ['What does the fan do?', 'What happens in the combustion chamber?', 'What drives the compressor?', 'Where does the hot gas go at the end?'],
    handover: ['Which tasks are finished?', 'What work is outstanding?', 'Are there any safety points?', 'Where are the tools and the paperwork?'],
    safety: ['What PPE do you wear in the hangar?', 'Why is FOD dangerous?', 'What do you do if you see a spill?', 'How can fatigue cause errors?'],
    docs: ['When do you use the AMM?', 'How do you find a part number?', 'What is an Airworthiness Directive?', 'What is the SRM used for?'],
    opinion: ['What are the advantages of electric aircraft?', 'And the disadvantages?', 'Would you like to work on them?', 'When do you think they will be common?'],
    career: ['What is your goal for the next five years?', 'Which licence do you want to get?', 'Would you like to work abroad?', 'How will English help you?'],
    free: ['Tell me more about that.', 'Why do you think so?', 'Can you give me an example?', 'What happened next?']
  },
  offlineTurn(topicId, turn, text, conf, recWords) {
    const fl = AI.FOLLOWUPS[topicId] || AI.FOLLOWUPS.free;
    const n = U.words(text).length;
    const issues = AI.localCheck(text);
    const reply = (n < 4 ? 'Can you say a little more? ' : U.pick(['Thank you, that\'s clear. ', 'Good. ', 'Interesting! ', 'Great answer. '])) + fl[turn % fl.length];
    const conf100 = Math.round((conf || 0) * 100);
    return {
      reply,
      corrected: '',
      grammar: issues.length ? issues.join('\n') : "Rien à signaler 👍 (correction locale simplifiée — ajoutez une clé API pour une analyse complète).",
      vocabulary: n < 6 ? 'Essayez de faire des phrases plus longues et d\'utiliser le vocabulaire de la leçon.' : 'Bon volume de mots (' + n + ').',
      pronunciation: conf ? `Confiance de la reconnaissance vocale : ${conf100} %. ${conf100 < 70 ? 'Plusieurs mots ont été difficiles à reconnaître : articulez et ralentissez.' : 'Votre prononciation a été bien comprise.'}` : 'Réponse écrite : pas d\'évaluation de la prononciation.',
      fluency: n >= 12 ? 'Bonne fluidité : vous développez vos idées.' : 'Ajoutez des mots de liaison (because, then, however) pour gagner en fluidité.',
      score: Math.max(30, Math.min(95, 50 + n * 2 - issues.length * 8 + (conf ? (conf100 - 70) / 3 : 0)))
    };
  }
};
