/* Schémas SVG à légender : avion (vue de dessus), turboréacteur (coupe), train d'atterrissage */
const Diagrams = {
  aircraft: {
    title: "Avion — vue de dessus",
    svg: `
    <defs><linearGradient id="dgf" x1="0" x2="1"><stop offset="0" stop-color="#cfd6dd"/><stop offset=".5" stop-color="#f4f6f8"/><stop offset="1" stop-color="#cfd6dd"/></linearGradient></defs>
    <path d="M178 160 L36 228 L36 246 L178 216Z" fill="#dfe5ea" stroke="#5d6b7a" stroke-width="2"/>
    <path d="M222 160 L364 228 L364 246 L222 216Z" fill="#dfe5ea" stroke="#5d6b7a" stroke-width="2"/>
    <path d="M178 213 L118 228 L120 234 L178 220Z" fill="#b58a5a"/>
    <path d="M222 213 L282 228 L280 234 L222 220Z" fill="#b58a5a"/>
    <path d="M100 232 L48 245 L50 250 L102 238Z" fill="#2f6fb8"/>
    <path d="M300 232 L352 245 L350 250 L298 238Z" fill="#2f6fb8"/>
    <rect x="112" y="178" width="18" height="40" rx="8" fill="#8a96a3" stroke="#5d6b7a"/>
    <rect x="270" y="178" width="18" height="40" rx="8" fill="#8a96a3" stroke="#5d6b7a"/>
    <path d="M181 318 L118 352 L118 362 L181 342Z" fill="#dfe5ea" stroke="#5d6b7a" stroke-width="2"/>
    <path d="M219 318 L282 352 L282 362 L219 342Z" fill="#dfe5ea" stroke="#5d6b7a" stroke-width="2"/>
    <path d="M181 340 L122 360 L122 364 L181 346Z" fill="#2f6fb8" opacity=".8"/>
    <path d="M219 340 L278 360 L278 364 L219 346Z" fill="#2f6fb8" opacity=".8"/>
    <path d="M200 18 C214 24 222 50 222 82 L222 330 C222 352 210 372 200 378 C190 372 178 352 178 330 L178 82 C178 50 186 24 200 18Z" fill="url(#dgf)" stroke="#5d6b7a" stroke-width="2"/>
    <path d="M190 46 Q200 38 210 46" fill="none" stroke="#1b3352" stroke-width="5" stroke-linecap="round"/>
    <rect x="197" y="318" width="6" height="58" rx="3" fill="#1b3352"/>`,
    labels: [
      { x: 200, y: 22, word: 'nose' }, { x: 200, y: 56, word: 'cockpit' }, { x: 200, y: 120, word: 'fuselage' },
      { x: 300, y: 205, word: 'wing' }, { x: 150, y: 168, word: 'leading-edge' }, { x: 330, y: 250, word: 'trailing-edge' },
      { x: 30, y: 237, word: 'wing-tip' }, { x: 74, y: 251, word: 'aileron' }, { x: 148, y: 236, word: 'flap' },
      { x: 121, y: 198, word: 'aircraft-engine' }, { x: 140, y: 341, word: 'horizontal-stabiliser' }, { x: 255, y: 366, word: 'elevator' },
      { x: 200, y: 352, word: 'vertical-stabiliser' }
    ]
  },
  engine: {
    title: 'Turboréacteur à double flux — coupe',
    svg: `
    <path d="M30 80 Q40 50 90 48 L330 70 L370 120 L330 170 L90 192 Q40 190 30 160Z" fill="#eef1f4" stroke="#5d6b7a" stroke-width="3"/>
    <path d="M90 95 L300 105 L345 120 L300 135 L90 145Z" fill="#c9d0d6" stroke="#5d6b7a" stroke-width="2"/>
    <g stroke="#2f6fb8" stroke-width="5" stroke-linecap="round"><line x1="70" y1="60" x2="70" y2="180"/><line x1="78" y1="58" x2="78" y2="182"/></g>
    <g fill="#4f93d6"><rect x="110" y="100" width="8" height="40"/><rect x="124" y="101" width="8" height="38"/><rect x="138" y="102" width="8" height="36"/><rect x="152" y="103" width="8" height="34"/><rect x="166" y="104" width="8" height="32"/></g>
    <rect x="190" y="104" width="44" height="32" rx="6" fill="#e0763a"/>
    <path d="M200 112 q6 -8 12 0 q6 8 12 0" stroke="#ffd27a" stroke-width="3" fill="none"/>
    <g fill="#b58a5a"><rect x="244" y="104" width="7" height="32"/><rect x="257" y="103" width="7" height="34"/><rect x="270" y="102" width="7" height="36"/></g>
    <line x1="74" y1="120" x2="290" y2="120" stroke="#1b3352" stroke-width="4"/>
    <path d="M300 108 L360 120 L300 132Z" fill="#8a96a3"/>
    <path d="M12 120 h18" stroke="#2f6fb8" stroke-width="3" marker-end="url(#arr)"/>`,
    labels: [
      { x: 32, y: 66, word: 'inlet' }, { x: 74, y: 196, word: 'fan' }, { x: 145, y: 92, word: 'compressor' },
      { x: 212, y: 150, word: 'combustion-chamber' }, { x: 262, y: 92, word: 'turbine' }, { x: 355, y: 140, word: 'exhaust-nozzle' },
      { x: 200, y: 82, word: 'bypass-duct' }, { x: 180, y: 120, word: 'shaft' }, { x: 230, y: 185, word: 'cowling' }
    ]
  },
  gear: {
    title: "Train d'atterrissage principal — vue de côté",
    svg: `
    <rect x="120" y="10" width="160" height="22" rx="4" fill="#c9d0d6" stroke="#5d6b7a"/>
    <rect x="186" y="30" width="28" height="120" rx="6" fill="#8a96a3" stroke="#5d6b7a" stroke-width="2"/>
    <rect x="192" y="140" width="16" height="90" rx="4" fill="#dfe5ea" stroke="#5d6b7a" stroke-width="2"/>
    <path d="M214 120 L250 160 L210 200" fill="none" stroke="#5d6b7a" stroke-width="5"/>
    <circle cx="200" cy="290" r="78" fill="#2a2f36"/>
    <circle cx="200" cy="290" r="48" fill="#c9d0d6" stroke="#8a96a3" stroke-width="3"/>
    <circle cx="200" cy="290" r="30" fill="#b58a5a" stroke="#7a5a35" stroke-width="3"/>
    <g stroke="#7a5a35" stroke-width="2"><line x1="182" y1="276" x2="218" y2="304"/><line x1="182" y1="304" x2="218" y2="276"/></g>
    <circle cx="200" cy="290" r="8" fill="#1b3352"/>`,
    labels: [
      { x: 200, y: 70, word: 'landing-gear-strut' }, { x: 200, y: 182, word: 'shock-strut' }, { x: 112, y: 300, word: 'tyre-uk-tire-us' },
      { x: 260, y: 252, word: 'wheel' }, { x: 222, y: 312, word: 'brake' }, { x: 200, y: 290, word: 'axle' }
    ]
  },
  /* SVG avec marqueurs numérotés ; active = index du marqueur en cours */
  render(key, states) {
    const d = Diagrams[key];
    const markers = d.labels.map((l, i) => {
      const st = states && states[i] ? ' ' + states[i] : '';
      return `<g class="marker${st}" data-i="${i}"><circle cx="${l.x}" cy="${l.y}" r="12"/><text x="${l.x}" y="${l.y}">${i + 1}</text></g>`;
    }).join('');
    const vb = key === 'engine' ? '0 30 400 190' : '0 0 400 380';
    return `<div class="diagram"><svg viewBox="${vb}" role="img" aria-label="${U.esc(d.title)}">${d.svg}${markers}</svg></div>`;
  },
  /* Libellés existants dans le lexique */
  validLabels(key) { return Diagrams[key].labels.map((l, i) => Object.assign({ i }, l, { w: Data.words[l.word] })).filter(l => l.w); }
};
