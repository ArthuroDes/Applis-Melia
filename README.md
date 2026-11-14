# ✈️ AeroEnglish

Application pour progresser en anglais, à l'oral comme à l'écrit (langue source : français), sur deux thématiques :
**anglais technique aéronautique** et **anglais conversationnel**. Couleurs bleu / gris / beige ; la progression
s'affiche comme une route de vol dans le ciel, avec des traînées d'avion et des paliers (FL020, FL040…).

## Contenu

- **912 mots et expressions** : tout le lexique du cahier des charges (général, structure, moteurs, mécanique, outils,
  systèmes, matériaux, maintenance, défauts, sécurité, documentation, verbes, mesures, mots de liaison, expressions
  de formation), plus des expressions conversationnelles du quotidien.
- Pour chaque mot : traduction française, définition anglaise, prononciation audio (normale ou 🐢 ralentie),
  phrase d'exemple traduite, illustration (emoji ou icône de catégorie), niveau de difficulté et bouton
  **« Add to my vocabulary »**.
- **160 leçons d'environ 15 min** (123 techniques + 37 conversationnelles), dont un bilan à la fin de chaque palier.
  Chaque leçon enchaîne : présentation du vocabulaire, point de grammaire, traduction, exercices à trous,
  compréhension écrite, compréhension orale, petite production écrite, activité orale, flashcards, images à légender
  (avion, turboréacteur, train d'atterrissage), reconnaissance de composants, phrases à compléter, conversation avec un
  formateur fictif et évaluation finale. Plus les exercices demandés : paires écrites, paires audio/écrit, phrase
  entendue à reconstituer (en anglais et en français), choix de la traduction, répétition de phrases, dictée du mot
  manquant, traduction par étiquettes et au clavier, mots dits à la chaîne, retrouver les mots entendus.
- **Répétition espacée** : les mots moins bien maîtrisés reviennent plus souvent (10 min, 1 j, 3 j, puis intervalles croissants) ; les erreurs d'une leçon reviennent en fin de leçon.
- **Tests de positionnement** conversationnel et technique, qui débloquent le bon palier et proposent les étapes utiles.
- **Tableau de bord** : XP, série de jours 🔥, objectif quotidien, grades, rappel du jour, statistiques (temps par semaine,
  séances par mois, XP par jour, historique).
- **Conversation IA** (Mr Oliver) : vous parlez au micro, l'IA répond à voix haute, affiche la transcription et corrige en
  quatre parties : Grammar, Vocabulary, Pronunciation, Fluency. **Mode sans interruption** : elle attend que vous
  appuyiez sur « J'ai fini ».
- Son de validation positif, clic sur n'importe quel mot anglais pour l'entendre, bouton de confirmation en bas de
  l'écran, pas de limite de temps.

## Utilisation sur ordinateur

Ouvrez `index.html` (ou `dist/AeroEnglish.html`) dans **Chrome** ou **Edge**. Rien à installer.
Ces deux navigateurs sont recommandés, car ils gèrent la reconnaissance vocale.

## Transfert sur téléphone par clé USB / câble

1. Copiez le fichier unique **`dist/AeroEnglish.html`** sur le téléphone (par exemple dans *Téléchargements*).
2. Sur Android, ouvrez-le depuis l'application *Fichiers* avec Chrome.
3. Pour transférer votre progression : *Réglages → Exporter* sur l'ordinateur, copiez le fichier `.json`, puis
   *Réglages → Importer* sur le téléphone (et inversement).

Une alternative plus confortable, qui marche aussi sur iPhone : publier le dossier (par exemple avec GitHub Pages), puis
« Ajouter à l'écran d'accueil ». L'application s'installe alors comme une vraie appli et fonctionne hors ligne.

## Limites à connaître

- La **reconnaissance vocale** dépend du navigateur (Chrome/Edge, Safari récent) et utilise généralement Internet.
  Ouvert en fichier local sur Android, le micro peut être bloqué ; la version publiée en ligne n'a pas ce problème.
  Chaque exercice oral peut être passé (« Je ne peux pas parler maintenant »).
- La **conversation IA complète** nécessite votre clé API Claude (*Réglages → Conversation IA*), conservée
  uniquement sur l'appareil. Sans clé, un tuteur local simplifié relance la conversation et signale les erreurs courantes.
- Les **rappels** : une bannière s'affiche chaque jour dans l'appli, avec une notification si l'appli est ouverte.
  Pour un rappel garanti, téléchargez le fichier `.ics` (*Réglages → Rappels*) et ajoutez-le à votre agenda.
- Les illustrations sont des emojis et des schémas SVG, pas des photos.
- La progression est enregistrée dans le navigateur (localStorage). Exportez-la régulièrement.

## Développement

Le code est en HTML/CSS/JavaScript, sans dépendance ni étape de compilation. Les données sont dans `js/data/`, le
moteur dans `js/core/` et les écrans dans `js/app.js`.
Pour régénérer le fichier unique : `node tools/build.js` (il produit `dist/AeroEnglish.html`).
