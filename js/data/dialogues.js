/* Personnages, dialogues avec formateurs fictifs, tests de positionnement, sujets de conversation IA */

window.CHARACTERS = {
  grace: { name: 'Captain Grace', role: 'Instructrice de vol', color: '#3d7cc9', skin: '#f1c9a5', hair: '#5a3b26', pitch: 1.1, voiceHint: 'female', avatar: '👩‍✈️' },
  sam:   { name: 'Sam', role: 'Mécanicien chef d\'équipe', color: '#6b7b8c', skin: '#c58c5f', hair: '#1f1f1f', pitch: 0.85, voiceHint: 'male', avatar: '🧑‍🔧' },
  nadia: { name: 'Nadia', role: 'Ingénieure de maintenance', color: '#b58a5a', skin: '#e0b48a', hair: '#2b1a10', pitch: 1.0, voiceHint: 'female', avatar: '👷‍♀️' },
  oliver:{ name: 'Mr Oliver', role: 'Formateur d\'anglais', color: '#2f5d8a', skin: '#f3d3b5', hair: '#9a9a9a', pitch: 0.95, voiceHint: 'male', avatar: '👨‍🏫' }
};

/* Dialogues : t = formateur parle ; s = l'élève choisit (1re option = bonne réponse, mélangées à l'affichage) */
window.DIALOGUES = [
  { cat: 'general', who: 'sam', title: 'First day in the hangar', lines: [
    { t: "Good morning! Welcome to the hangar. Are you the new apprentice?", fr: "Bonjour ! Bienvenue au hangar. Tu es le nouvel apprenti ?" },
    { s: ["Yes, I am. Nice to meet you.", "Yes, I has.", "No, I am a hangar."], fr: "Oui. Enchanté." },
    { t: "Great. This aircraft arrived last night. The ground crew towed it in. Do you know where the spare parts are?", fr: "Super. Cet avion est arrivé hier soir. Le personnel au sol l'a remorqué. Sais-tu où sont les pièces de rechange ?" },
    { s: ["In the store next to the workshop?", "In the cockpit, under the pilot.", "Spare parts is a flight."], fr: "Au magasin à côté de l'atelier ?" },
    { t: "Exactly. Always check the part number before you install anything.", fr: "Exactement. Vérifie toujours la référence avant d'installer quoi que ce soit." },
    { s: ["OK, I will check the part number.", "OK, I will check the passenger.", "OK, I will number the part."], fr: "D'accord, je vérifierai la référence." }
  ]},
  { cat: 'structure', who: 'nadia', title: 'Walk-around inspection', lines: [
    { t: "Let's do the walk-around. Start at the nose. What do you see?", fr: "Faisons le tour avion. Commence par le nez. Que vois-tu ?" },
    { s: ["The radome looks fine, no damage.", "The radome is a wing.", "I see the passengers."], fr: "Le radôme semble bien, aucun dommage." },
    { t: "Good. Now look at the leading edge of the left wing.", fr: "Bien. Maintenant regarde le bord d'attaque de l'aile gauche." },
    { s: ["There is a small dent near the wing tip.", "There are a small dent at the tail.", "The leading edge is in the cabin."], fr: "Il y a un petit enfoncement près de l'extrémité de l'aile." },
    { t: "Measure it and check the limits in the SRM.", fr: "Mesure-le et vérifie les limites dans le SRM." },
    { s: ["Right, I'll measure it with a ruler.", "Right, I'll hit it with a hammer.", "No, I measure tomorrow yesterday."], fr: "D'accord, je vais le mesurer avec une règle." }
  ]},
  { cat: 'engines', who: 'sam', title: 'Engine vibration', lines: [
    { t: "The pilot reported excessive vibration on engine two. What will you check first?", fr: "Le pilote a signalé une vibration excessive sur le moteur deux. Que vas-tu vérifier en premier ?" },
    { s: ["I'll inspect the fan blades for damage.", "I'll check the cabin lights.", "I'll paint the engine."], fr: "Je vais inspecter les aubes de soufflante." },
    { t: "Good idea. One fan blade has a nick. What can cause fan imbalance?", fr: "Bonne idée. Une aube a une entaille. Qu'est-ce qui peut provoquer un déséquilibre de la soufflante ?" },
    { s: ["Damage from a foreign object.", "Too much passengers.", "The colour of the cowling."], fr: "Un dommage dû à un corps étranger." },
    { t: "Correct. We'll need a borescope inspection of the compressor too.", fr: "Exact. Il faudra aussi une inspection endoscopique du compresseur." },
    { s: ["OK, I'll get the borescope from the tool store.", "OK, I'll get the pilot from the store.", "OK, the borescope is getting me."], fr: "D'accord, je vais chercher l'endoscope au magasin d'outils." }
  ]},
  { cat: 'tools', who: 'sam', title: 'Which tool?', lines: [
    { t: "I need to tighten this nut to 25 newton metres. Which tool do I need?", fr: "Je dois serrer cet écrou à 25 Nm. De quel outil ai-je besoin ?" },
    { s: ["A torque wrench.", "A hacksaw.", "A thermometer."], fr: "Une clé dynamométrique." },
    { t: "Right. And to cut the old lockwire?", fr: "Exact. Et pour couper l'ancien fil à freiner ?" },
    { s: ["Side cutters, please.", "A measuring tape, please.", "A hammer, please."], fr: "Une pince coupante, s'il te plaît." },
    { t: "Here you are. Don't forget to put everything back in the toolbox.", fr: "Voilà. N'oublie pas de tout remettre dans la boîte à outils." },
    { s: ["Of course, I'll check my shadow board.", "Of course, I'll leave the tools in the engine.", "No, tools are FOD."], fr: "Bien sûr, je vais vérifier mon tableau d'ombres." }
  ]},
  { cat: 'sys-hyd', who: 'nadia', title: 'Hydraulic leak', lines: [
    { t: "There is hydraulic fluid under the left main gear. What do you do first?", fr: "Il y a du fluide hydraulique sous le train principal gauche. Que fais-tu en premier ?" },
    { s: ["I put on gloves and goggles, then I look for the source.", "I touch the fluid to taste it.", "I start the pumps at full pressure."], fr: "Je mets des gants et des lunettes, puis je cherche la source." },
    { t: "Good. The leak comes from a hose fitting. Is the system pressurised?", fr: "Bien. La fuite vient d'un raccord de flexible. Le système est-il pressurisé ?" },
    { s: ["No, I have released the pressure.", "Yes, I always work under pressure.", "The pressure is a hose."], fr: "Non, j'ai relâché la pression." },
    { t: "Perfect. Tighten the fitting to the AMM torque and do a leak check.", fr: "Parfait. Serre le raccord au couple de l'AMM et fais un contrôle d'étanchéité." },
    { s: ["Will do. I'll record it in the technical log afterwards.", "Will do. I'll forget the log.", "I don't have to record anything."], fr: "Entendu. Je le consignerai ensuite dans le compte rendu matériel." }
  ]},
  { cat: 'sys-elec', who: 'nadia', title: 'Electrical fault', lines: [
    { t: "The cabin lights don't work in row 12. Where do you start?", fr: "Les lumières de la rangée 12 ne fonctionnent pas. Par où commences-tu ?" },
    { s: ["I check the circuit breaker first.", "I replace the whole aircraft.", "I ask the passengers to sing."], fr: "Je vérifie d'abord le disjoncteur." },
    { t: "The breaker is closed. What next?", fr: "Le disjoncteur est fermé. Ensuite ?" },
    { s: ["I measure the voltage at the connector with a multimeter.", "I measure the tyre with a multimeter.", "I hit the connector with a mallet."], fr: "Je mesure la tension au connecteur avec un multimètre." },
    { t: "No voltage at the connector. Look at the wiring diagram.", fr: "Pas de tension au connecteur. Regarde le schéma électrique." },
    { s: ["There may be an open circuit between the breaker and the connector.", "There is a short flight.", "The wiring diagram is broken."], fr: "Il y a peut-être un circuit ouvert entre le disjoncteur et le connecteur." }
  ]},
  { cat: 'safety', who: 'grace', title: 'Safety briefing', lines: [
    { t: "Before we go onto the apron, what personal protective equipment do you need?", fr: "Avant d'aller sur l'aire de trafic, de quels EPI as-tu besoin ?" },
    { s: ["A high-visibility vest, safety boots and ear protection.", "A tie and a hat.", "Nothing, it's fine."], fr: "Un gilet haute visibilité, des chaussures de sécurité et une protection auditive." },
    { t: "Good. You see a bolt on the ground near the engine. What do you do?", fr: "Bien. Tu vois un boulon au sol près du moteur. Que fais-tu ?" },
    { s: ["I pick it up, because it's FOD.", "I leave it, it's not my bolt.", "I kick it under the aircraft."], fr: "Je le ramasse, car c'est un débris (FOD)." },
    { t: "Excellent. And if you feel very tired at the end of the night shift?", fr: "Excellent. Et si tu te sens très fatigué à la fin de l'équipe de nuit ?" },
    { s: ["I tell my supervisor, because fatigue causes mistakes.", "I drink five coffees and say nothing.", "I sleep in the cockpit."], fr: "Je le dis à mon superviseur, car la fatigue provoque des erreurs." }
  ]},
  { cat: 'maintenance', who: 'nadia', title: 'Shift handover', lines: [
    { t: "Hi, I'm taking over from you. What's the status of the aircraft?", fr: "Salut, je prends la relève. Quel est l'état de l'avion ?" },
    { s: ["The wheel change is done, but the brake test is outstanding.", "The aircraft are status.", "I don't know, I didn't look."], fr: "Le changement de roue est fait, mais l'essai des freins reste à faire." },
    { t: "OK. Is the task card signed?", fr: "D'accord. La fiche de tâche est-elle signée ?" },
    { s: ["Only the removal steps are signed.", "Yes, I signed it before I started.", "The task card is in the tyre."], fr: "Seules les étapes de dépose sont signées." },
    { t: "Thanks. I'll do the functional test and the CRS.", fr: "Merci. Je ferai l'essai fonctionnel et le CRS." },
    { s: ["Great. All my tools are back in the cabinet.", "Great. My tools are still in the wheel well.", "Great. I lost the work order."], fr: "Super. Tous mes outils sont rangés dans l'armoire." }
  ]},
  { cat: 'defects', who: 'grace', title: 'Pilot report', lines: [
    { t: "During the flight, I heard an abnormal noise from the left side. It was like a whistle.", fr: "Pendant le vol, j'ai entendu un bruit anormal du côté gauche. On aurait dit un sifflement." },
    { s: ["When did it start? During the climb or the cruise?", "Was the noise blue?", "I don't care about noises."], fr: "Quand a-t-il commencé ? En montée ou en croisière ?" },
    { t: "During the climb, at about 10,000 feet.", fr: "En montée, vers 10 000 pieds." },
    { s: ["It may be a door seal. I'll inspect the seal of the left door.", "It may be the passengers. I'll inspect them.", "It may be the fuel. I'll drink it."], fr: "C'est peut-être un joint de porte. Je vais inspecter le joint de la porte gauche." },
    { t: "Thank you. Please let me know if the aircraft is serviceable.", fr: "Merci. Tiens-moi au courant si l'avion est apte au vol." },
    { s: ["Of course. I'll report back in thirty minutes.", "Of course. I'll report back last year.", "No, it is unserviceable forever."], fr: "Bien sûr. Je reviens vers vous dans trente minutes." }
  ]},
  { cat: 'docs', who: 'nadia', title: 'Finding the right manual', lines: [
    { t: "I need the part number for the fuel pump. Which manual do I use?", fr: "J'ai besoin de la référence de la pompe à carburant. Quel manuel dois-je utiliser ?" },
    { s: ["The Illustrated Parts Catalogue, the IPC.", "The Aircraft Flight Manual.", "The menu of the canteen."], fr: "Le catalogue illustré des pièces, l'IPC." },
    { t: "And for the removal procedure?", fr: "Et pour la procédure de dépose ?" },
    { s: ["The AMM, chapter 28.", "The SRM, chapter 1.", "The newspaper."], fr: "L'AMM, chapitre 28." },
    { t: "Is there an Airworthiness Directive on this pump?", fr: "Y a-t-il une consigne de navigabilité sur cette pompe ?" },
    { s: ["Let me check the AD list before we start.", "ADs are optional, so no.", "I never read ADs."], fr: "Laisse-moi vérifier la liste des consignes avant de commencer." }
  ]},
  { cat: 'conv', who: 'oliver', title: 'Getting to know you', lines: [
    { t: "Hello! I'm Mr Oliver, your English trainer. What's your name?", fr: "Bonjour ! Je suis M. Oliver, votre formateur d'anglais. Comment vous appelez-vous ?" },
    { s: ["My name is Alex. Nice to meet you.", "I name Alex.", "Alex is my age."], fr: "Je m'appelle Alex. Enchanté." },
    { t: "Nice to meet you too, Alex. Where do you come from?", fr: "Enchanté également, Alex. D'où venez-vous ?" },
    { s: ["I come from France, near Bordeaux.", "I am coming of France.", "I come to France yesterday."], fr: "Je viens de France, près de Bordeaux." },
    { t: "Lovely. Why are you learning English?", fr: "Très bien. Pourquoi apprenez-vous l'anglais ?" },
    { s: ["Because I need it for my job in aviation.", "Because yesterday is Monday.", "Because English are a job."], fr: "Parce que j'en ai besoin pour mon travail dans l'aéronautique." }
  ]},
  { cat: 'conv', who: 'oliver', title: 'In class', lines: [
    { t: "Today we're talking about the fuel system. The fuel is stored in the wing tanks.", fr: "Aujourd'hui nous parlons du système carburant. Le carburant est stocké dans les réservoirs d'aile." },
    { s: ["Sorry, could you speak more slowly, please?", "Sorry, could you speaking slowly?", "Sorry, you could slow more?"], fr: "Pardon, pourriez-vous parler plus lentement, s'il vous plaît ?" },
    { t: "Of course. The fuel... is stored... in the wings. Is that clear?", fr: "Bien sûr. Le carburant... est stocké... dans les ailes. C'est clair ?" },
    { s: ["Yes, thank you. What does 'vent' mean?", "Yes, thank you. What means 'vent'?", "Yes, thank you. What does mean 'vent'?"], fr: "Oui, merci. Que signifie « vent » ?" },
    { t: "A vent lets air in and out of the tank. Can you repeat the word?", fr: "Un évent laisse l'air entrer et sortir du réservoir. Pouvez-vous répéter le mot ?" },
    { s: ["Vent. I think I understand now.", "Vent. I am understand now.", "Vent. I understanding now."], fr: "Évent. Je pense que je comprends maintenant." }
  ]},
  { cat: 'conv', who: 'grace', title: 'Planning a trip', lines: [
    { t: "I'm flying to Dublin next week for a training course. Have you ever been to Ireland?", fr: "Je pars à Dublin la semaine prochaine pour une formation. Êtes-vous déjà allé en Irlande ?" },
    { s: ["No, I have never been there.", "No, I never go there yesterday.", "No, I have never went there."], fr: "Non, je n'y suis jamais allé." },
    { t: "You should go! What would you like to visit?", fr: "Vous devriez y aller ! Que voudriez-vous visiter ?" },
    { s: ["I'd like to visit an aircraft museum.", "I'd like visiting to a museum.", "I like to visited a museum."], fr: "J'aimerais visiter un musée de l'aviation." },
    { t: "Great idea. And what are you going to do this weekend?", fr: "Bonne idée. Et que allez-vous faire ce week-end ?" },
    { s: ["I'm going to study for my exam.", "I go to studied for my exam.", "I will studying my exam."], fr: "Je vais réviser pour mon examen." }
  ]}
];

/* Productions écrites courtes (consigne FR, mots-clés attendus) */
window.WRITING = {
  general: ["Présentez-vous en 3 phrases : votre nom, votre métier dans l'aéronautique et où vous travaillez.", ['work', 'aircraft']],
  structure: ["Décrivez en 3 phrases les principales parties d'un avion (fuselage, wings, tail...).", ['fuselage', 'wing', 'tail']],
  engines: ["Expliquez en 3 phrases comment fonctionne un turboréacteur à double flux.", ['fan', 'compressor', 'turbine']],
  mechanics: ["Expliquez pourquoi la lubrification est importante (3 phrases).", ['friction', 'wear', 'lubrication']],
  tools: ["Listez 3 outils de votre boîte à outils et dites à quoi ils servent.", ['spanner', 'screwdriver', 'use']],
  'sys-hyd': ["Décrivez une fuite hydraulique que vous avez trouvée et ce que vous avez fait.", ['leak', 'hydraulic', 'pressure']],
  'sys-elec': ["Expliquez comment vous cherchez une panne électrique (3 étapes).", ['circuit breaker', 'voltage', 'wiring']],
  'sys-fuel': ["Écrivez une consigne pour vérifier la contamination du carburant.", ['drain', 'water', 'fuel']],
  'sys-gear': ["Décrivez les étapes d'un changement de roue.", ['wheel', 'jack', 'torque']],
  'sys-controls': ["Expliquez à quoi servent les ailerons, la gouverne de profondeur et la gouverne de direction.", ['aileron', 'elevator', 'rudder']],
  'sys-avionics': ["Expliquez le rôle de l'APU en 3 phrases.", ['APU', 'power', 'ground']],
  materials: ["Comparez l'aluminium et la fibre de carbone (3 phrases, utilisez 'than').", ['than', 'aluminium', 'carbon']],
  maintenance: ["Rédigez un court compte rendu d'une tâche de maintenance que vous avez réalisée (au passé).", ['checked', 'replaced', 'inspection']],
  defects: ["Signalez un défaut trouvé pendant le tour avion (localisation, type, taille).", ['found', 'damage', 'mm']],
  safety: ["Écrivez 3 règles de sécurité pour le hangar (must / must not).", ['must', 'wear', 'not']],
  docs: ["Expliquez quel manuel vous utilisez pour trouver une référence de pièce et une procédure.", ['IPC', 'AMM', 'part number']],
  verbs: ["Écrivez une procédure courte de 4 étapes avec des verbes à l'impératif.", ['remove', 'install', 'check']],
  measures: ["Décrivez une pièce avec ses dimensions (longueur, diamètre, épaisseur).", ['length', 'diameter', 'mm']],
  linking: ["Racontez un incident avec because, however et as a result.", ['because', 'however', 'as a result']],
  conv: ["Écrivez un petit message à un collègue anglophone pour lui proposer un café et parler de votre journée.", ['would you like', 'today', 'coffee']]
};

/* Sujets pour la conversation libre avec l'IA */
window.AI_TOPICS = [
  { id: 'intro', title: 'Se présenter', prompt: 'Introduce yourself: your name, where you live, your job or studies and why you learn English.', level: 1, track: 'conv' },
  { id: 'day', title: 'Ma journée de travail', prompt: 'Describe a typical working day in aviation maintenance.', level: 1, track: 'conv' },
  { id: 'weekend', title: 'Mon week-end', prompt: 'Talk about what you did last weekend and what you will do next weekend.', level: 1, track: 'conv' },
  { id: 'walkaround', title: 'Tour avion', prompt: 'You are doing a walk-around inspection. Describe what you check and what you find.', level: 2, track: 'aero' },
  { id: 'defect', title: 'Signaler un défaut', prompt: 'Report a technical problem to your supervisor: what, where, how big, and what you suggest.', level: 2, track: 'aero' },
  { id: 'engine', title: 'Expliquer un moteur', prompt: 'Explain how a turbofan engine works to a new apprentice.', level: 2, track: 'aero' },
  { id: 'handover', title: 'Passation de consignes', prompt: 'Give a shift handover: tasks done, outstanding work and safety points.', level: 2, track: 'aero' },
  { id: 'safety', title: 'Sécurité au hangar', prompt: 'Explain the main safety rules in a hangar and why they matter.', level: 1, track: 'aero' },
  { id: 'docs', title: 'Documentation technique', prompt: 'Explain which manuals you use (AMM, IPC, SRM...) and when.', level: 3, track: 'aero' },
  { id: 'opinion', title: 'Donner son avis', prompt: 'Give your opinion: are electric aircraft the future of aviation? Why?', level: 3, track: 'conv' },
  { id: 'career', title: 'Mes projets', prompt: 'Talk about your career goals and how English will help you.', level: 2, track: 'conv' },
  { id: 'free', title: 'Sujet libre', prompt: 'Free conversation: talk about anything you like.', level: 1, track: 'conv' }
];

/* Tests de positionnement : [question, options, bonne réponse, niveau 1-4] */
window.PLACEMENT = {
  conv: [
    ['"Hello, how are you?" — ...', ["I'm fine, thanks.", 'I am 25 years.', 'I have fine.'], 0, 1],
    ['Choisissez la bonne forme : She ___ in Lyon.', ['lives', 'live', 'living'], 0, 1],
    ['"Bonne journée" se dit :', ['Have a nice day', 'Good night', 'See you yesterday'], 0, 1],
    ['___ you help me, please?', ['Could', 'Must', 'Are'], 0, 1],
    ['Yesterday I ___ to the cinema.', ['went', 'go', 'have gone'], 0, 2],
    ['"Pourriez-vous répéter ?"', ['Could you repeat that, please?', 'Can you again say?', 'Repeat you could?'], 0, 2],
    ['How ___ money do you need?', ['much', 'many', 'more'], 0, 2],
    ['I ___ never been to London.', ['have', 'am', 'did'], 0, 2],
    ['This exercise is ___ than the last one.', ['easier', 'more easy', 'easiest'], 0, 2],
    ["If it rains tomorrow, we ___ stay at home.", ['will', 'would', 'are'], 0, 3],
    ['"I don\'t like coffee." — "___"', ['Me neither.', 'Me too.', 'So do I.'], 0, 3],
    ['She said that she ___ tired.', ['was', 'is been', 'were'], 0, 3],
    ['"À mon avis" se dit :', ['In my opinion', 'On my avis', 'For my mind'], 0, 3],
    ['I look forward to ___ from you.', ['hearing', 'hear', 'heard'], 0, 4],
    ['___ I had known, I would have come.', ['If', 'Unless', 'When'], 0, 4],
    ['The report ___ by the manager tomorrow.', ['will be signed', 'will sign', 'is signing'], 0, 4]
  ],
  aero: [
    ['"Aile" en anglais :', ['Wing', 'Tail', 'Nose'], 0, 1],
    ['"Pneu" en anglais britannique :', ['Tyre', 'Wheel', 'Brake'], 0, 1],
    ['A "spanner" est :', ['Une clé', 'Un marteau', 'Une perceuse'], 0, 1],
    ['"Remove the panel" signifie :', ['Déposez le panneau', 'Peignez le panneau', 'Fermez le panneau'], 0, 1],
    ['The "fuselage" is…', ['the main body of the aircraft', 'the engine cover', 'a type of fuel'], 0, 1],
    ['Which surface controls roll?', ['Aileron', 'Rudder', 'Elevator'], 0, 2],
    ['"Bord d\'attaque" :', ['Leading edge', 'Trailing edge', 'Wing tip'], 0, 2],
    ['Where is fuel burnt in a jet engine?', ['Combustion chamber', 'Fan', 'Bypass duct'], 0, 2],
    ['A part fit to be used is…', ['serviceable', 'unserviceable', 'defective'], 0, 2],
    ['"Couple de serrage" : tighten to the correct ___', ['torque', 'thrust', 'tension'], 0, 2],
    ['Which manual gives part numbers?', ['IPC', 'AFM', 'MEL'], 0, 3],
    ['"Ressuage" en anglais :', ['Dye penetrant inspection', 'Eddy current testing', 'Borescope inspection'], 0, 3],
    ['An AD is…', ['mandatory', 'optional', 'only for pilots'], 0, 3],
    ['"Bleed air" comes from…', ['the engine compressor', 'the fuel tank', 'the cabin'], 0, 3],
    ['"La pièce doit être déposée" :', ['The part must be removed.', 'The part must remove.', 'The part is removing.'], 0, 4],
    ['"Do not open the line ___ the pressure is zero."', ['unless', 'because', 'whereas'], 0, 4],
    ['CRS stands for…', ['Certificate of Release to Service', 'Cabin Repair System', 'Control Rod Servo'], 0, 4],
    ['"Délamination" occurs in…', ['composite materials', 'electrical wires', 'hydraulic fluid'], 0, 4]
  ]
};
