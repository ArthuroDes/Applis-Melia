/* Anglais conversationnel — expressions et vocabulaire du quotidien
   Format : anglais | français | note d'usage (EN) | exemple EN | exemple FR | emoji */
window.VOCAB_RAW = window.VOCAB_RAW || [];

VOCAB_RAW.push({
  id: 'conv-hello', track: 'conv', level: 1, icon: '👋',
  name: 'Se présenter et saluer',
  words: `
Hello | Bonjour | A common greeting at any time of day. | Hello, my name is Paul. | Bonjour, je m'appelle Paul. | 👋
Good morning | Bonjour (le matin) | A greeting used before midday. | Good morning, everyone! | Bonjour à tous ! | 🌅
Good evening | Bonsoir | A greeting used in the evening. | Good evening, how are you? | Bonsoir, comment allez-vous ? | 🌆
How are you? | Comment allez-vous ? | A polite question about someone's health. | Hi Tom, how are you today? | Salut Tom, comment vas-tu aujourd'hui ?
I'm fine, thank you | Je vais bien, merci | A polite answer to "How are you?". | I'm fine, thank you. And you? | Je vais bien, merci. Et vous ?
Nice to meet you | Enchanté(e) | Said when you meet someone for the first time. | Nice to meet you, Sarah. | Enchanté, Sarah. | 🤝
My name is | Je m'appelle | Used to give your name. | My name is Julie and I'm French. | Je m'appelle Julie et je suis française.
I come from | Je viens de | Used to say where you are from. | I come from Toulouse, in the south of France. | Je viens de Toulouse, dans le sud de la France.
I work as | Je travaille comme | Used to say your job. | I work as an aircraft technician. | Je travaille comme technicien aéronautique.
I'm a student | Je suis étudiant(e) | Used to say that you are studying. | I'm a student at an aviation school. | Je suis étudiant dans une école d'aviation. | 🎓
I live in | J'habite à | Used to say where your home is. | I live in a small town near Paris. | J'habite dans une petite ville près de Paris. | 🏠
I'm learning English | J'apprends l'anglais | Used to talk about your studies. | I'm learning English for my job. | J'apprends l'anglais pour mon travail.
See you later | À plus tard | A friendly way to say goodbye. | See you later at the canteen. | À plus tard à la cantine.
See you tomorrow | À demain | Goodbye until the next day. | Thanks for your help. See you tomorrow! | Merci pour ton aide. À demain !
Have a nice day | Bonne journée | A polite wish when you leave. | Have a nice day, Mr Smith. | Bonne journée, monsieur Smith. | ☀️
Goodbye | Au revoir | Said when you leave someone. | Goodbye, and thank you. | Au revoir, et merci. | 👋
`});

VOCAB_RAW.push({
  id: 'conv-polite', track: 'conv', level: 1, icon: '🙏',
  name: 'Politesse et demandes',
  words: `
Please | S'il vous plaît | Used to make a request polite. | Can you open the door, please? | Pouvez-vous ouvrir la porte, s'il vous plaît ? | 🙏
Thank you very much | Merci beaucoup | A strong way to say thanks. | Thank you very much for your help. | Merci beaucoup pour votre aide.
You're welcome | De rien | A polite answer to "thank you". | "Thanks!" "You're welcome." | « Merci ! » « De rien. »
Excuse me | Excusez-moi | Used to get attention politely. | Excuse me, where is the office? | Excusez-moi, où est le bureau ?
I'm sorry | Je suis désolé(e) | Used to apologise. | I'm sorry, I'm late. | Je suis désolé, je suis en retard.
Could you help me? | Pourriez-vous m'aider ? | A polite request for help. | Could you help me with this report? | Pourriez-vous m'aider avec ce rapport ?
Can I ask a question? | Puis-je poser une question ? | Used before asking something. | Can I ask a question about the test? | Puis-je poser une question sur l'examen ?
Would you like a coffee? | Voulez-vous un café ? | A polite offer. | Would you like a coffee before the meeting? | Voulez-vous un café avant la réunion ? | ☕
Yes, please | Oui, s'il vous plaît | A polite way to accept. | "Tea?" "Yes, please." | « Du thé ? » « Oui, s'il vous plaît. »
No, thank you | Non, merci | A polite way to refuse. | No, thank you, I'm fine. | Non, merci, ça va.
Of course | Bien sûr | Used to agree politely. | Of course, I can do it. | Bien sûr, je peux le faire.
No problem | Pas de problème | Used to say something is easy or fine. | No problem, I'll check it. | Pas de problème, je vais vérifier.
Just a moment | Un instant | Used to ask someone to wait. | Just a moment, I'm on the phone. | Un instant, je suis au téléphone. | ⏳
Don't worry | Ne t'inquiète pas | Used to reassure someone. | Don't worry, everyone makes mistakes. | Ne t'inquiète pas, tout le monde fait des erreurs.
`});

VOCAB_RAW.push({
  id: 'conv-training', track: 'conv', level: 1, icon: '🎓',
  name: 'Expressions utilisées en formation (1)',
  words: `
Could you repeat that, please? | Pourriez-vous répéter, s'il vous plaît ? | Asking someone to say something again. | Sorry, could you repeat that, please? | Pardon, pourriez-vous répéter, s'il vous plaît ? | 🔁
Could you speak more slowly? | Pourriez-vous parler plus lentement ? | Asking someone to speak slower. | Could you speak more slowly? I'm still learning. | Pourriez-vous parler plus lentement ? J'apprends encore. | 🐢
Could you explain that again? | Pourriez-vous réexpliquer ? | Asking for a new explanation. | Could you explain that again with an example? | Pourriez-vous réexpliquer avec un exemple ?
What does this term mean? | Que signifie ce terme ? | Asking for the meaning of a word. | What does this term mean: "airworthiness"? | Que signifie ce terme : « airworthiness » ? | ❓
How do you pronounce this word? | Comment prononce-t-on ce mot ? | Asking about pronunciation. | How do you pronounce this word? | Comment prononce-t-on ce mot ? | 🗣️
Could you give me an example? | Pourriez-vous me donner un exemple ? | Asking for an example. | I don't understand. Could you give me an example? | Je ne comprends pas. Pourriez-vous me donner un exemple ?
I don't quite understand. | Je ne comprends pas très bien. | Saying you have a problem understanding. | I don't quite understand the last step. | Je ne comprends pas très bien la dernière étape.
I understand the principle, but not the details. | Je comprends le principe, mais pas les détails. | Saying you only partly understand. | I understand the principle, but not the details of the valve. | Je comprends le principe, mais pas les détails de la vanne.
Could you show me on the diagram? | Pourriez-vous me montrer sur le schéma ? | Asking someone to point to something on a drawing. | Could you show me on the diagram where the pump is? | Pourriez-vous me montrer sur le schéma où est la pompe ?
Is there another way to explain it? | Existe-t-il une autre manière de l'expliquer ? | Asking for a different explanation. | Is there another way to explain it? | Existe-t-il une autre manière de l'expliquer ?
I have a question. | J'ai une question. | Used to start a question. | Excuse me, I have a question. | Excusez-moi, j'ai une question. | ✋
What are we studying today? | Qu'étudions-nous aujourd'hui ? | Asking about the lesson topic. | What are we studying today, the fuel system? | Qu'étudions-nous aujourd'hui, le système carburant ?
Let me check my notes. | Laisse-moi vérifier mes notes. | Saying you need to look at your notes. | Wait, let me check my notes. | Attends, laisse-moi vérifier mes notes. | 📝
Could you help me understand this? | Pourrais-tu m'aider à comprendre cela ? | Asking for help to understand. | Could you help me understand this drawing? | Pourrais-tu m'aider à comprendre ce dessin ?
Shall we compare our answers? | Comparons nos réponses ? | Suggesting to compare answers. | We have finished. Shall we compare our answers? | Nous avons fini. Comparons nos réponses ?
I have finished this task. | J'ai terminé cette tâche. | Saying a task is complete. | I have finished this task. What's next? | J'ai terminé cette tâche. Quelle est la suite ? | ✅
What should I do next? | Que dois-je faire ensuite ? | Asking for the next step. | I've removed the panel. What should I do next? | J'ai déposé le panneau. Que dois-je faire ensuite ?
I have made a mistake. | J'ai fait une erreur. | Admitting an error. | Sorry, I have made a mistake in the calculation. | Désolé, j'ai fait une erreur dans le calcul.
`});

VOCAB_RAW.push({
  id: 'conv-training2', track: 'conv', level: 2, icon: '🔎',
  name: 'Expressions utilisées en formation (2) : comprendre un système',
  words: `
What is this component called? | Comment s'appelle ce composant ? | Asking for the name of a part. | What is this component called in English? | Comment s'appelle ce composant en anglais ?
What is its purpose? | Quelle est sa fonction ? | Asking what something is used for. | This is a damper. What is its purpose? | C'est un amortisseur. Quelle est sa fonction ?
What does this system do? | À quoi sert ce système ? | Asking about the function of a system. | What does this system do exactly? | À quoi sert exactement ce système ?
What is it connected to? | À quoi est-il relié ? | Asking about connections. | What is it connected to, the pump? | À quoi est-il relié, à la pompe ?
What material is it made of? | En quel matériau est-il fabriqué ? | Asking about materials. | What material is it made of, steel or titanium? | En quel matériau est-il fabriqué, acier ou titane ?
What is the difference between these two parts? | Quelle est la différence entre ces deux pièces ? | Asking to compare two parts. | What is the difference between these two parts? | Quelle est la différence entre ces deux pièces ?
How does this mechanism work? | Comment fonctionne ce mécanisme ? | Asking how something works. | How does this mechanism work when the door opens? | Comment fonctionne ce mécanisme quand la porte s'ouvre ?
What happens if this component fails? | Que se passe-t-il si ce composant tombe en panne ? | Asking about the effect of a failure. | What happens if this component fails in flight? | Que se passe-t-il si ce composant tombe en panne en vol ?
Is this part damaged? | Cette pièce est-elle endommagée ? | Asking about the condition of a part. | Is this part damaged or just dirty? | Cette pièce est-elle endommagée ou juste sale ?
How can we identify this component? | Comment identifier ce composant ? | Asking how to recognise a part. | How can we identify this component in the IPC? | Comment identifier ce composant dans l'IPC ?
Can I have a look? | Est-ce que je peux regarder ? | Asking permission to look. | Can I have a look at the borescope images? | Est-ce que je peux regarder les images de l'endoscope ? | 👀
Could you pass me the tool? | Pourrais-tu me passer l'outil ? | Asking someone to give you a tool. | Could you pass me the tool on the bench? | Pourrais-tu me passer l'outil sur l'établi ? | 🔧
Which part are we discussing? | De quelle pièce parlons-nous ? | Asking which part is the topic. | Sorry, which part are we discussing now? | Pardon, de quelle pièce parlons-nous maintenant ?
I agree with you. | Je suis d'accord avec toi. | Saying you have the same opinion. | I agree with you, the seal is worn. | Je suis d'accord avec toi, le joint est usé. | 👍
I am not sure about that. | Je n'en suis pas sûr(e). | Expressing doubt. | I am not sure about that value. | Je ne suis pas sûr de cette valeur. | 🤔
I think the problem is related to... | Je pense que le problème est lié à... | Giving your opinion about a cause. | I think the problem is related to the sensor. | Je pense que le problème est lié au capteur.
`});

VOCAB_RAW.push({
  id: 'conv-problems', track: 'conv', level: 2, icon: '🗣️',
  name: 'Décrire un problème technique',
  words: `
There is a leak. | Il y a une fuite. | Reporting a leak. | There is a leak under the left wing. | Il y a une fuite sous l'aile gauche. | 💧
The component is damaged. | Le composant est endommagé. | Reporting damage. | The component is damaged and must be replaced. | Le composant est endommagé et doit être remplacé.
The part is worn out. | La pièce est usée. | Reporting wear. | The part is worn out after 2,000 cycles. | La pièce est usée après 2 000 cycles.
There is excessive vibration. | Il y a des vibrations excessives. | Reporting vibration. | There is excessive vibration on engine two. | Il y a des vibrations excessives sur le moteur deux.
The system is not working properly. | Le système ne fonctionne pas correctement. | Reporting a malfunction. | The system is not working properly since this morning. | Le système ne fonctionne pas correctement depuis ce matin.
The pressure is too low. | La pression est trop faible. | Reporting low pressure. | The pressure is too low in the green system. | La pression est trop faible dans le circuit vert.
The temperature is too high. | La température est trop élevée. | Reporting high temperature. | The temperature is too high, stop the engine. | La température est trop élevée, arrêtez le moteur. | 🌡️
The connection is loose. | La connexion est desserrée. | Reporting a loose connection. | The connection is loose behind the panel. | La connexion est desserrée derrière le panneau.
The component is missing. | Le composant est manquant. | Reporting a missing part. | The component is missing from the kit. | Le composant est manquant dans le kit.
The measurement is outside the specified limits. | La mesure est en dehors des limites spécifiées. | Reporting an out-of-limit value. | The measurement is outside the specified limits, so I rejected the part. | La mesure est en dehors des limites spécifiées, j'ai donc rejeté la pièce.
I noticed a crack. | J'ai remarqué une fissure. | Reporting a crack you found. | I noticed a crack near the rivet. | J'ai remarqué une fissure près du rivet.
I found an abnormality. | J'ai constaté une anomalie. | Reporting something unusual. | I found an abnormality during the walk-around. | J'ai constaté une anomalie pendant le tour avion.
It's making a strange noise. | Ça fait un bruit bizarre. | Reporting an unusual sound. | The pump is making a strange noise. | La pompe fait un bruit bizarre. | 🔊
It doesn't start. | Ça ne démarre pas. | Reporting a failure to start. | The APU doesn't start. | L'APU ne démarre pas.
It stopped working. | Ça a cessé de fonctionner. | Reporting a sudden failure. | The light stopped working yesterday. | Le voyant a cessé de fonctionner hier.
`});

VOCAB_RAW.push({
  id: 'conv-numbers', track: 'conv', level: 1, icon: '🔢',
  name: 'Nombres, dates et heures',
  words: `
What time is it? | Quelle heure est-il ? | Asking for the time. | Excuse me, what time is it? | Excusez-moi, quelle heure est-il ? | 🕒
It's half past seven | Il est sept heures et demie | Saying the time (7:30). | It's half past seven, the shift starts soon. | Il est sept heures et demie, l'équipe commence bientôt. | 🕢
It's a quarter to nine | Il est neuf heures moins le quart | Saying the time (8:45). | It's a quarter to nine, hurry up! | Il est neuf heures moins le quart, dépêche-toi !
In the morning | Le matin | Talking about the first part of the day. | I start work at six in the morning. | Je commence le travail à six heures du matin.
In the afternoon | L'après-midi | Talking about the time after midday. | The meeting is in the afternoon. | La réunion est l'après-midi.
At night | La nuit | Talking about night time. | Heavy checks are often done at night. | Les grosses visites sont souvent faites la nuit. | 🌙
Today | Aujourd'hui | This day. | Today we are studying engines. | Aujourd'hui, nous étudions les moteurs. | 📅
Tomorrow | Demain | The day after today. | The exam is tomorrow. | L'examen est demain.
Yesterday | Hier | The day before today. | I replaced the filter yesterday. | J'ai remplacé le filtre hier.
Next week | La semaine prochaine | The week after this one. | The aircraft comes back next week. | L'avion revient la semaine prochaine.
Last month | Le mois dernier | The month before this one. | I started my training last month. | J'ai commencé ma formation le mois dernier.
On Monday | Le lundi / lundi | Talking about a day of the week. | The course starts on Monday. | Le cours commence lundi.
The first of June | Le premier juin | Saying a date (ordinal number). | My birthday is on the first of June. | Mon anniversaire est le premier juin. | 🎂
Twenty twenty-six | Deux mille vingt-six | Saying the year 2026. | I will get my licence in twenty twenty-six. | J'obtiendrai ma licence en deux mille vingt-six.
How much is it? | Combien ça coûte ? | Asking for the price. | How much is it for the course? | Combien coûte le cours ? | 💶
How many hours? | Combien d'heures ? | Asking for a quantity of hours. | How many hours does the task take? | Combien d'heures prend la tâche ?
About | Environ | Used before an approximate number. | It takes about two hours. | Cela prend environ deux heures.
`});

VOCAB_RAW.push({
  id: 'conv-work', track: 'conv', level: 1, icon: '💼',
  name: 'Parler de son travail et de sa journée',
  words: `
I start work at | Je commence le travail à | Saying when your workday begins. | I start work at seven o'clock. | Je commence le travail à sept heures.
I finish at | Je termine à | Saying when your workday ends. | I finish at four in the afternoon. | Je termine à quatre heures de l'après-midi.
I usually | D'habitude, je | Talking about habits. | I usually take the bus to work. | D'habitude, je prends le bus pour aller au travail. | 🚌
My colleague | Mon / ma collègue | A person you work with. | My colleague is from Spain. | Mon collègue est espagnol.
My manager | Mon / ma responsable | The person in charge of your team. | My manager is very helpful. | Ma responsable est très serviable.
The team | L'équipe | A group of people working together. | The team works at night this week. | L'équipe travaille de nuit cette semaine. | 👥
A meeting | Une réunion | A planned discussion between people. | We have a meeting at ten. | Nous avons une réunion à dix heures. | 📆
A break | Une pause | A short rest from work. | Let's take a break. | Faisons une pause. | ☕
A day off | Un jour de congé | A day when you do not work. | Tomorrow is my day off. | Demain, c'est mon jour de congé.
On holiday | En vacances | Not working for a period of time. | My manager is on holiday this week. | Ma responsable est en vacances cette semaine. | 🏖️
I'm busy | Je suis occupé(e) | Saying you have a lot to do. | Sorry, I'm busy right now. | Désolé, je suis occupé en ce moment.
I'm in charge of | Je suis responsable de | Saying what you are responsible for. | I'm in charge of the tool store. | Je suis responsable du magasin d'outils.
I enjoy my job | J'aime mon travail | Expressing that you like your work. | I enjoy my job because I like aircraft. | J'aime mon travail parce que j'aime les avions. | 😊
It's hard work | C'est un travail difficile | Saying a job is demanding. | It's hard work, but it's interesting. | C'est un travail difficile, mais c'est intéressant.
I'm tired | Je suis fatigué(e) | Saying you need rest. | I'm tired after the night shift. | Je suis fatigué après l'équipe de nuit. | 😴
`});

VOCAB_RAW.push({
  id: 'conv-phone', track: 'conv', level: 2, icon: '📞',
  name: 'Téléphone et e-mails',
  words: `
Can I speak to | Puis-je parler à | Asking for someone on the phone. | Hello, can I speak to Mr Brown, please? | Bonjour, puis-je parler à M. Brown, s'il vous plaît ? | 📞
Who's calling? | Qui est à l'appareil ? | Asking the name of the caller. | Who's calling, please? | Qui est à l'appareil, s'il vous plaît ?
Hold on, please | Ne quittez pas | Asking the caller to wait. | Hold on, please, I'll put you through. | Ne quittez pas, je vous le passe.
He's not available | Il n'est pas disponible | Saying someone cannot answer. | I'm sorry, he's not available right now. | Je suis désolé, il n'est pas disponible pour le moment.
Can I take a message? | Puis-je prendre un message ? | Offering to note a message. | He's in a meeting. Can I take a message? | Il est en réunion. Puis-je prendre un message ?
I'll call you back | Je vous rappelle | Promising to phone later. | I'm driving, I'll call you back. | Je conduis, je vous rappelle.
The line is bad | La ligne est mauvaise | Saying you cannot hear well. | Sorry, the line is bad. Can you repeat? | Désolé, la ligne est mauvaise. Pouvez-vous répéter ?
Dear Sir or Madam | Madame, Monsieur | A formal email greeting when you don't know the name. | Dear Sir or Madam, I am writing to ask for information. | Madame, Monsieur, je vous écris pour demander des informations. | ✉️
I am writing to | Je vous écris pour | Explaining the reason for an email. | I am writing to confirm the meeting. | Je vous écris pour confirmer la réunion.
Please find attached | Veuillez trouver ci-joint | Introducing an attachment. | Please find attached the inspection report. | Veuillez trouver ci-joint le rapport d'inspection. | 📎
I look forward to hearing from you | Dans l'attente de votre réponse | A polite end to an email. | I look forward to hearing from you soon. | Dans l'attente de votre réponse rapide.
Best regards | Cordialement | A common email ending. | Best regards, Julie. | Cordialement, Julie.
Could you send me | Pourriez-vous m'envoyer | A polite request by email. | Could you send me the task card? | Pourriez-vous m'envoyer la fiche de tâche ?
`});

VOCAB_RAW.push({
  id: 'conv-smalltalk', track: 'conv', level: 1, icon: '☀️',
  name: 'Discussions informelles',
  words: `
What's the weather like? | Quel temps fait-il ? | Asking about the weather. | What's the weather like in London? | Quel temps fait-il à Londres ? | 🌤️
It's raining | Il pleut | Describing rainy weather. | It's raining, so we stay in the hangar. | Il pleut, donc nous restons dans le hangar. | 🌧️
It's sunny | Il fait beau / il y a du soleil | Describing sunny weather. | It's sunny today. | Il fait beau aujourd'hui. | ☀️
It's windy | Il y a du vent | Describing windy weather. | It's windy on the apron. | Il y a du vent sur l'aire de trafic. | 🌬️
It's freezing | Il gèle / il fait glacial | Describing very cold weather. | It's freezing this morning! | Il fait glacial ce matin ! | 🥶
What did you do at the weekend? | Qu'as-tu fait ce week-end ? | Asking about someone's weekend. | What did you do at the weekend? | Qu'as-tu fait ce week-end ?
I went to | Je suis allé(e) à | Talking about a past trip. | I went to the beach with my family. | Je suis allé à la plage avec ma famille.
What are your hobbies? | Quels sont tes loisirs ? | Asking about free-time activities. | What are your hobbies? | Quels sont tes loisirs ?
I like | J'aime | Saying what you enjoy. | I like football and cinema. | J'aime le football et le cinéma. | ❤️
I don't like | Je n'aime pas | Saying what you do not enjoy. | I don't like getting up early. | Je n'aime pas me lever tôt.
I prefer | Je préfère | Saying what you like more. | I prefer tea to coffee. | Je préfère le thé au café.
That sounds great! | Ça a l'air génial ! | Reacting positively. | A trip to Iceland? That sounds great! | Un voyage en Islande ? Ça a l'air génial ! | 🤩
Really? | Vraiment ? | Showing surprise or interest. | Really? I didn't know that. | Vraiment ? Je ne le savais pas.
Me too | Moi aussi | Agreeing with a positive sentence. | "I love planes." "Me too!" | « J'adore les avions. » « Moi aussi ! »
Me neither | Moi non plus | Agreeing with a negative sentence. | "I don't like rain." "Me neither." | « Je n'aime pas la pluie. » « Moi non plus. »
`});

VOCAB_RAW.push({
  id: 'conv-travel', track: 'conv', level: 2, icon: '🧳',
  name: "À l'aéroport et en voyage",
  words: `
Boarding pass | Carte d'embarquement | The document that lets you board a flight. | Can I see your boarding pass, please? | Puis-je voir votre carte d'embarquement, s'il vous plaît ? | 🎫
Check-in desk | Comptoir d'enregistrement | Where you register for your flight. | The check-in desk opens at six. | Le comptoir d'enregistrement ouvre à six heures.
Gate | Porte d'embarquement | Where you board the aircraft. | Our flight leaves from gate 12. | Notre vol part de la porte 12.
Departure | Départ | When a flight leaves. | The departure is delayed. | Le départ est retardé. | 🛫
Arrival | Arrivée | When a flight arrives. | The arrival time is 3 pm. | L'heure d'arrivée est 15 h. | 🛬
Delayed | Retardé | Later than planned. | Our flight is delayed by one hour. | Notre vol est retardé d'une heure. | ⏰
Cancelled | Annulé | Not happening any more. | The flight was cancelled because of fog. | Le vol a été annulé à cause du brouillard.
Luggage | Bagages | The bags you take on a trip. | My luggage is lost. | Mes bagages sont perdus. | 🧳
Hand luggage | Bagage à main | A small bag you take into the cabin. | You can take one piece of hand luggage. | Vous pouvez prendre un bagage à main.
Window seat | Place côté hublot | A seat next to the window. | Can I have a window seat? | Puis-je avoir une place côté hublot ? | 🪟
Aisle seat | Place côté couloir | A seat next to the corridor. | I prefer an aisle seat. | Je préfère une place côté couloir.
Where is the toilet? | Où sont les toilettes ? | Asking for the toilet. | Excuse me, where is the toilet? | Excusez-moi, où sont les toilettes ? | 🚻
Turn left | Tournez à gauche | A direction. | Turn left after the café. | Tournez à gauche après le café. | ⬅️
Turn right | Tournez à droite | A direction. | Turn right at the end of the corridor. | Tournez à droite au bout du couloir. | ➡️
Go straight on | Allez tout droit | A direction. | Go straight on to gate 20. | Allez tout droit jusqu'à la porte 20. | ⬆️
Next to | À côté de | Describing position. | The office is next to the hangar. | Le bureau est à côté du hangar.
Opposite | En face de | Describing position. | The canteen is opposite the workshop. | La cantine est en face de l'atelier.
`});

VOCAB_RAW.push({
  id: 'conv-opinion', track: 'conv', level: 2, icon: '💬',
  name: 'Donner son avis et discuter',
  words: `
In my opinion | À mon avis | Introducing your opinion. | In my opinion, this solution is better. | À mon avis, cette solution est meilleure.
I think that | Je pense que | Giving an opinion. | I think that we need more time. | Je pense que nous avons besoin de plus de temps. | 💭
I don't think so | Je ne pense pas | Disagreeing politely. | Is it broken? I don't think so. | C'est cassé ? Je ne pense pas.
I disagree | Je ne suis pas d'accord | Saying you have a different opinion. | Sorry, but I disagree. | Désolé, mais je ne suis pas d'accord. | 👎
You're right | Tu as raison | Agreeing with someone. | You're right, the bolt is loose. | Tu as raison, le boulon est desserré.
That's a good idea | C'est une bonne idée | Reacting positively to a suggestion. | Let's ask the engineer. That's a good idea. | Demandons à l'ingénieur. C'est une bonne idée. | 💡
Why don't we | Pourquoi ne pas | Making a suggestion. | Why don't we start with the inspection? | Pourquoi ne pas commencer par l'inspection ?
What do you think? | Qu'en penses-tu ? | Asking for an opinion. | What do you think about this repair? | Que penses-tu de cette réparation ?
It depends | Ça dépend | Saying the answer is not simple. | It depends on the damage. | Ça dépend du dommage.
For example | Par exemple | Introducing an example. | Some metals, for example titanium, are very strong. | Certains métaux, par exemple le titane, sont très résistants.
On the one hand | D'un côté | Introducing one side of an argument. | On the one hand, it is cheaper. | D'un côté, c'est moins cher.
On the other hand | D'un autre côté | Introducing the other side. | On the other hand, it takes more time. | D'un autre côté, cela prend plus de temps.
To be honest | Pour être honnête | Introducing a sincere opinion. | To be honest, I prefer the old manual. | Pour être honnête, je préfère l'ancien manuel.
I'm not sure | Je ne suis pas sûr(e) | Showing doubt. | I'm not sure it's the right part. | Je ne suis pas sûr que ce soit la bonne pièce.
Let me think | Laisse-moi réfléchir | Asking for time to think. | Hmm, let me think about it. | Hmm, laisse-moi y réfléchir. | 🤔
`});

VOCAB_RAW.push({
  id: 'conv-past-future', track: 'conv', level: 2, icon: '🕰️',
  name: 'Raconter et faire des projets',
  words: `
Last year | L'année dernière | The year before this one. | Last year I passed my first exam. | L'année dernière, j'ai réussi mon premier examen.
Two days ago | Il y a deux jours | Talking about a past moment. | I saw the aircraft two days ago. | J'ai vu l'avion il y a deux jours.
When I was young | Quand j'étais jeune | Talking about childhood. | When I was young, I wanted to be a pilot. | Quand j'étais jeune, je voulais être pilote. | 🧒
First | D'abord | Starting a sequence. | First, we removed the panel. | D'abord, nous avons déposé le panneau.
Then | Ensuite | Continuing a sequence. | Then, we checked the wiring. | Ensuite, nous avons vérifié le câblage.
Finally | Enfin | Ending a sequence. | Finally, we closed the panel. | Enfin, nous avons refermé le panneau.
I'm going to | Je vais | Talking about a plan. | I'm going to study tonight. | Je vais étudier ce soir.
I will | Je vais / je ferai | Talking about the future or a decision. | I will send you the report tomorrow. | Je vous enverrai le rapport demain.
I'd like to | J'aimerais | Expressing a wish politely. | I'd like to work in a big airline. | J'aimerais travailler dans une grande compagnie aérienne. | ✨
I hope to | J'espère | Expressing a hope. | I hope to get my licence next year. | J'espère obtenir ma licence l'année prochaine.
My goal is to | Mon objectif est de | Describing an objective. | My goal is to speak English fluently. | Mon objectif est de parler anglais couramment. | 🎯
In the future | À l'avenir | Talking about later times. | In the future, aircraft will be electric. | À l'avenir, les avions seront électriques. | 🔮
I have been | J'ai été / je suis allé(e) | Talking about experience (present perfect). | I have been to England twice. | Je suis allé deux fois en Angleterre.
I have never | Je n'ai jamais | Talking about no experience. | I have never flown in a helicopter. | Je n'ai jamais volé en hélicoptère.
`});
