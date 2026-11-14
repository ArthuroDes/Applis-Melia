/* Vocabulaire aéronautique — partie 1
   Format d'une ligne : anglais | français | définition anglaise | exemple EN | exemple FR | emoji (facultatif) */
window.VOCAB_RAW = window.VOCAB_RAW || [];

VOCAB_RAW.push({
  id: 'general', track: 'aero', level: 1, icon: '✈️',
  name: 'Vocabulaire général aéronautique',
  words: `
Aircraft | Aéronef | Any machine that can fly by gaining support from the air. | The aircraft is parked in the hangar. | L'aéronef est garé dans le hangar. | ✈️
Aeroplane / Airplane | Avion | A powered aircraft with fixed wings. | The aeroplane took off at nine o'clock. | L'avion a décollé à neuf heures. | 🛩️
Helicopter | Hélicoptère | An aircraft lifted by rotating blades above it. | The helicopter landed on the roof. | L'hélicoptère s'est posé sur le toit. | 🚁
Airframe | Cellule de l'avion | The structure of an aircraft without its engines. | The airframe is made of aluminium alloy. | La cellule de l'avion est en alliage d'aluminium.
Aircraft maintenance | Maintenance aéronautique | The work done to keep an aircraft safe and serviceable. | Aircraft maintenance is done every night. | La maintenance aéronautique est faite chaque nuit. | 🔧
Aircraft maintenance engineer | Technicien / ingénieur de maintenance aéronautique | A qualified person who maintains and certifies aircraft. | The aircraft maintenance engineer signed the report. | L'ingénieur de maintenance aéronautique a signé le rapport. | 👷
Aircraft mechanic | Mécanicien aéronautique | A person who repairs and maintains aircraft. | The aircraft mechanic changed the wheel. | Le mécanicien aéronautique a changé la roue. | 🧑‍🔧
Aircraft technician | Technicien aéronautique | A skilled worker who inspects and repairs aircraft systems. | The aircraft technician checks the wiring. | Le technicien aéronautique vérifie le câblage. | 🧑‍🔧
Aviation industry | Industrie aéronautique | All the companies that build, fly and maintain aircraft. | The aviation industry needs new technicians. | L'industrie aéronautique a besoin de nouveaux techniciens. | 🏭
Aerospace | Aérospatiale | The industry of aircraft and spacecraft. | She works for an aerospace company. | Elle travaille pour une entreprise aérospatiale. | 🚀
Hangar | Hangar | A large building where aircraft are kept and repaired. | Please move the aircraft into the hangar. | Veuillez déplacer l'avion dans le hangar. | 🏗️
Workshop | Atelier | A room where parts are repaired or made. | The brake is repaired in the workshop. | Le frein est réparé à l'atelier. | 🛠️
Maintenance facility | Installation de maintenance | A place equipped for aircraft maintenance. | The new maintenance facility is near the runway. | La nouvelle installation de maintenance est près de la piste.
Flight | Vol | A journey made by an aircraft through the air. | The flight lasted two hours. | Le vol a duré deux heures. | 🛫
Ground operations | Opérations au sol | All activities around an aircraft when it is on the ground. | Ground operations start as soon as the aircraft arrives. | Les opérations au sol commencent dès que l'avion arrive.
Ground crew | Personnel au sol | The people who service the aircraft on the ground. | The ground crew refuelled the aircraft. | Le personnel au sol a ravitaillé l'avion. | 🦺
Flight crew | Équipage de conduite | The pilots who operate the aircraft. | The flight crew reported a problem. | L'équipage de conduite a signalé un problème. | 👨‍✈️
Pilot | Pilote | The person who flies the aircraft. | The pilot checked the instruments. | Le pilote a vérifié les instruments. | 👨‍✈️
Co-pilot | Copilote | The second pilot who assists the captain. | The co-pilot read the checklist. | Le copilote a lu la check-list. | 👩‍✈️
Passenger | Passager | A person who travels in an aircraft but does not work on it. | The aircraft can carry 180 passengers. | L'avion peut transporter 180 passagers. | 🧳
Cargo | Fret | Goods carried by an aircraft. | The cargo is loaded in the lower hold. | Le fret est chargé dans la soute inférieure. | 📦
Commercial aircraft | Avion commercial | An aircraft used to carry passengers or cargo for money. | A commercial aircraft flies many hours every day. | Un avion commercial vole de nombreuses heures chaque jour.
Military aircraft | Avion militaire | An aircraft used by the armed forces. | The military aircraft has a special radar. | L'avion militaire a un radar spécial.
Private aircraft | Avion privé | An aircraft owned by a person or company for its own use. | The private aircraft has six seats. | L'avion privé a six sièges.
Training aircraft | Avion d'entraînement | An aircraft used to teach students to fly. | The training aircraft has two seats. | L'avion d'entraînement a deux sièges.
Aircraft manufacturer | Constructeur aéronautique | A company that designs and builds aircraft. | The aircraft manufacturer published a new manual. | Le constructeur aéronautique a publié un nouveau manuel. | 🏭
Spare parts | Pièces de rechange | Parts kept in stock to replace damaged ones. | The spare parts are in the store. | Les pièces de rechange sont au magasin. | 📦
Component | Composant | One part of a larger system. | This component must be replaced. | Ce composant doit être remplacé. | ⚙️
Assembly | Ensemble / assemblage | A group of parts fitted together. | The wheel assembly is very heavy. | L'ensemble roue est très lourd.
Subassembly | Sous-ensemble | An assembly that is part of a bigger assembly. | Remove the subassembly from the engine. | Déposez le sous-ensemble du moteur.
Equipment | Équipement | The tools and devices used for a job. | All the equipment is in the hangar. | Tout l'équipement est dans le hangar. | 🧰
System | Système | A group of components that work together. | The hydraulic system has three pumps. | Le système hydraulique a trois pompes.
Unit | Unité / appareil | A single device that can be removed and replaced. | The faulty unit was sent to the workshop. | L'appareil défectueux a été envoyé à l'atelier.
Part number (P/N) | Référence de pièce | The code that identifies a type of part. | Check the part number before installation. | Vérifiez la référence de pièce avant l'installation. | 🏷️
Serial number (S/N) | Numéro de série | The unique number of one individual part. | Write the serial number in the logbook. | Écrivez le numéro de série dans le carnet. | 🔢
`});

VOCAB_RAW.push({
  id: 'structure', track: 'aero', level: 1, icon: '🛩️', diagram: 'aircraft',
  name: "Parties et structure d'un avion",
  words: `
Fuselage | Fuselage | The main body of the aircraft. | The fuselage carries the passengers and cargo. | Le fuselage transporte les passagers et le fret.
Nose | Nez de l'avion | The front end of the aircraft. | The radar is in the nose. | Le radar est dans le nez de l'avion. | 👃
Nose cone | Cône de nez | The pointed cover at the very front of the aircraft. | The nose cone was damaged by a bird. | Le cône de nez a été endommagé par un oiseau.
Cockpit | Poste de pilotage | The place where the pilots sit and control the aircraft. | The pilots are in the cockpit. | Les pilotes sont dans le poste de pilotage.
Flight deck | Poste de pilotage | Another word for the cockpit of a large aircraft. | The engineer entered the flight deck. | L'ingénieur est entré dans le poste de pilotage.
Cabin | Cabine | The part of the fuselage where passengers sit. | The cabin is clean and ready. | La cabine est propre et prête. | 💺
Passenger compartment | Compartiment passagers | The area reserved for passengers. | The passenger compartment has 30 rows. | Le compartiment passagers a 30 rangées.
Wing | Aile | The long flat part that lifts the aircraft. | The fuel is stored in the wing. | Le carburant est stocké dans l'aile.
Wing root | Emplanture de l'aile | The part of the wing joined to the fuselage. | Inspect the wing root for cracks. | Inspectez l'emplanture de l'aile pour détecter des fissures.
Wing tip | Extrémité de l'aile | The outer end of the wing. | A light is installed on each wing tip. | Un feu est installé à chaque extrémité de l'aile.
Leading edge | Bord d'attaque | The front edge of the wing. | Ice forms on the leading edge. | La glace se forme sur le bord d'attaque.
Trailing edge | Bord de fuite | The rear edge of the wing. | The flaps are on the trailing edge. | Les volets sont sur le bord de fuite.
Horizontal stabiliser | Stabilisateur horizontal | The small horizontal wing at the tail. | The elevators are on the horizontal stabiliser. | Les gouvernes de profondeur sont sur le stabilisateur horizontal.
Vertical stabiliser | Dérive | The vertical surface at the tail of the aircraft. | The logo is painted on the vertical stabiliser. | Le logo est peint sur la dérive.
Fin | Dérive verticale | Another word for the vertical stabiliser. | The fin keeps the aircraft straight. | La dérive verticale maintient l'avion droit.
Tail | Empennage | The rear part of the aircraft with the stabilisers. | The tail was hit by a vehicle. | L'empennage a été heurté par un véhicule.
Tailplane | Plan horizontal de l'empennage | The horizontal surface of the tail. | The tailplane is adjustable. | Le plan horizontal de l'empennage est réglable.
Rudder | Gouverne de direction | The movable surface on the fin that turns the nose left or right. | The pilot moves the rudder with the pedals. | Le pilote actionne la gouverne de direction avec les palonniers.
Elevator | Gouverne de profondeur | The movable surface that moves the nose up or down. | The elevator controls the pitch. | La gouverne de profondeur contrôle le tangage.
Aileron | Aileron | The movable surface on the wing that makes the aircraft roll. | The left aileron moves up. | L'aileron gauche se lève.
Flap | Volet | A surface on the trailing edge that increases lift at low speed. | Extend the flaps for landing. | Sortez les volets pour l'atterrissage.
Slat | Bec de bord d'attaque | A movable surface on the leading edge. | The slats are extended for take-off. | Les becs de bord d'attaque sont sortis pour le décollage.
Spoiler | Déporteur | A panel on the wing that reduces lift. | The spoilers deploy after landing. | Les déporteurs se déploient après l'atterrissage.
Airbrake | Aérofrein | A surface used to slow the aircraft in flight. | The airbrake helps the aircraft descend. | L'aérofrein aide l'avion à descendre.
Fairing | Carénage | A smooth cover that reduces drag. | A fairing covers the flap track. | Un carénage recouvre le rail de volet.
Cowling | Capot moteur | The removable cover around an engine. | Open the cowling to see the engine. | Ouvrez le capot moteur pour voir le moteur.
Access panel | Panneau d'accès | A removable panel that gives access to equipment. | Remove the access panel under the wing. | Déposez le panneau d'accès sous l'aile.
Inspection panel | Trappe de visite | A small panel opened to inspect inside. | The inspection panel is secured with screws. | La trappe de visite est fixée par des vis.
Door | Porte | An opening for people or cargo to enter. | Close the cargo door. | Fermez la porte cargo. | 🚪
Window | Fenêtre | A transparent panel in the cabin wall. | One cabin window is cracked. | Une fenêtre de cabine est fissurée. | 🪟
Windscreen | Pare-brise | The front window of the cockpit. | The windscreen is heated. | Le pare-brise est chauffé.
Radome | Radôme | The cover that protects the radar antenna. | The radome is made of composite material. | Le radôme est en matériau composite.
Antenna | Antenne | A device that sends or receives radio signals. | The antenna is on top of the fuselage. | L'antenne est sur le dessus du fuselage. | 📡
Drain hole | Orifice de drainage | A small hole that lets water out. | Check that the drain hole is not blocked. | Vérifiez que l'orifice de drainage n'est pas obstrué.
Frame | Cadre | A circular structural part of the fuselage. | The frame is attached to the skin. | Le cadre est fixé au revêtement.
Stringer | Lisse | A long thin part that stiffens the skin. | The stringers run along the fuselage. | Les lisses courent le long du fuselage.
Longeron / Spar | Longeron | The main beam inside the wing. | The front spar carries most of the load. | Le longeron avant supporte la plus grande partie de la charge.
Rib | Nervure | A part that gives the wing its shape. | Each rib is attached to the spar. | Chaque nervure est fixée au longeron.
Skin | Revêtement | The outer surface of the aircraft. | The skin has a small dent. | Le revêtement a une petite bosse.
Bulkhead | Cloison | A wall inside the fuselage that separates two areas. | The rear pressure bulkhead is very strong. | La cloison pressurisée arrière est très résistante.
Stiffener | Raidisseur | A part that makes a panel stronger. | A stiffener was added to the panel. | Un raidisseur a été ajouté au panneau.
Bracket | Support / équerre | A small part used to hold another part. | The bracket holds the pipe. | Le support maintient le tuyau.
Support | Support | A part that holds or carries weight. | The engine support is cracked. | Le support moteur est fissuré.
Joint | Joint / raccord | The place where two parts are joined. | Inspect the joint between the panels. | Inspectez le raccord entre les panneaux.
Seal | Joint d'étanchéité | A part that stops fluid or air from escaping. | Replace the door seal. | Remplacez le joint d'étanchéité de la porte.
Sealant | Produit d'étanchéité | A paste that fills gaps and stops leaks. | Apply sealant around the fastener. | Appliquez du produit d'étanchéité autour de la fixation.
Reinforcement | Renfort | An extra part that adds strength. | A reinforcement was installed on the frame. | Un renfort a été installé sur le cadre.
Structural component | Élément structural | A part that carries loads in the structure. | A spar is a structural component. | Un longeron est un élément structural.
Structural damage | Dommage structurel | Damage to the parts that carry loads. | The inspection found structural damage. | L'inspection a révélé un dommage structurel.
Fastener | Élément de fixation | Any part used to join parts together. | Count the fasteners before closing the panel. | Comptez les éléments de fixation avant de fermer le panneau.
Rivet | Rivet | A permanent metal fastener. | Thousands of rivets hold the skin. | Des milliers de rivets maintiennent le revêtement.
Bolt | Boulon | A threaded metal rod used with a nut. | Tighten the bolt to the correct torque. | Serrez le boulon au couple correct. | 🔩
Nut | Écrou | A small part with a thread that fits on a bolt. | The nut is missing. | L'écrou est manquant. | 🔩
Washer | Rondelle | A flat ring placed under a nut. | Put a washer under the nut. | Mettez une rondelle sous l'écrou.
Screw | Vis | A threaded fastener turned with a screwdriver. | Remove the four screws. | Retirez les quatre vis. | 🪛
Pin | Goupille / axe | A small rod used to hold or locate parts. | Insert the safety pin. | Insérez la goupille de sécurité. | 📌
Hinge | Charnière | A joint that lets a door or panel turn. | Lubricate the door hinge. | Lubrifiez la charnière de la porte.
Bearing | Roulement / palier | A part that allows smooth rotation. | The bearing is noisy. | Le roulement est bruyant.
Bushing | Bague / coussinet | A tube that lines a hole to reduce wear. | Replace the worn bushing. | Remplacez la bague usée.
`});

VOCAB_RAW.push({
  id: 'engines', track: 'aero', level: 2, icon: '🌀', diagram: 'engine',
  name: 'Moteurs aéronautiques',
  words: `
Aircraft engine | Moteur d'avion | The machine that produces power or thrust for an aircraft. | The aircraft engine was removed for overhaul. | Le moteur d'avion a été déposé pour révision.
Jet engine | Turboréacteur | An engine that pushes the aircraft with a jet of hot gas. | A jet engine is very loud. | Un turboréacteur est très bruyant.
Turbofan engine | Turboréacteur à double flux | A jet engine with a large fan at the front. | Most airliners use a turbofan engine. | La plupart des avions de ligne utilisent un turboréacteur à double flux.
Turbojet | Turboréacteur simple flux | A jet engine where all the air passes through the core. | Old fighters used a turbojet. | Les anciens chasseurs utilisaient un turboréacteur simple flux.
Turboprop | Turbopropulseur | A gas turbine that drives a propeller. | Regional aircraft often have a turboprop. | Les avions régionaux ont souvent un turbopropulseur.
Turboshaft | Turbomoteur | A gas turbine that drives a shaft, used in helicopters. | The helicopter has two turboshafts. | L'hélicoptère a deux turbomoteurs.
Piston engine | Moteur à pistons | An engine where pistons move up and down in cylinders. | Small aircraft use a piston engine. | Les petits avions utilisent un moteur à pistons.
Reciprocating engine | Moteur alternatif | Another name for a piston engine. | A reciprocating engine has a crankshaft. | Un moteur alternatif possède un vilebrequin.
Electric motor | Moteur électrique | A motor that turns electrical energy into movement. | The electric motor drives the pump. | Le moteur électrique entraîne la pompe.
Hybrid propulsion | Propulsion hybride | Propulsion using both fuel and electric power. | Hybrid propulsion reduces fuel consumption. | La propulsion hybride réduit la consommation de carburant.
Propulsion system | Système de propulsion | All the parts that move the aircraft forward. | The propulsion system includes the engines. | Le système de propulsion comprend les moteurs.
Engine assembly | Ensemble moteur | The complete engine with its parts. | The engine assembly weighs two tonnes. | L'ensemble moteur pèse deux tonnes.
Powerplant | Groupe motopropulseur | The engine and its accessories as installed. | The powerplant is checked every day. | Le groupe motopropulseur est vérifié chaque jour.
Fan | Soufflante | The large rotating blades at the front of a turbofan. | The fan produces most of the thrust. | La soufflante produit la plus grande partie de la poussée.
Compressor | Compresseur | The part that squeezes the air before combustion. | The compressor has many stages. | Le compresseur a de nombreux étages.
Compressor blade | Aube de compresseur | One blade of the compressor. | A compressor blade was damaged by a stone. | Une aube de compresseur a été endommagée par un caillou.
Turbine | Turbine | The part turned by hot gas that drives the compressor. | The turbine turns very fast. | La turbine tourne très vite.
Turbine blade | Aube de turbine | One blade of the turbine. | Turbine blades work at very high temperatures. | Les aubes de turbine fonctionnent à très haute température.
Combustion chamber | Chambre de combustion | The place where fuel and air burn. | Fuel burns in the combustion chamber. | Le carburant brûle dans la chambre de combustion. | 🔥
Combustor | Chambre de combustion | Another word for the combustion chamber. | Inspect the combustor with a borescope. | Inspectez la chambre de combustion avec un endoscope.
Fuel injector | Injecteur de carburant | A part that sprays fuel into the engine. | One fuel injector is blocked. | Un injecteur de carburant est bouché.
Fuel nozzle | Buse d'injection | The tip that sprays fuel into the combustor. | Clean the fuel nozzle. | Nettoyez la buse d'injection.
Ignition system | Système d'allumage | The system that starts combustion. | The ignition system has two igniters. | Le système d'allumage a deux allumeurs. | ⚡
Spark plug | Bougie | A part that makes a spark in a piston engine. | Replace the spark plugs every 100 hours. | Remplacez les bougies toutes les 100 heures.
Igniter | Allumeur | A part that makes a spark in a turbine engine. | The igniter makes a clicking sound. | L'allumeur fait un bruit de claquement.
Exhaust | Échappement | The rear part where gases leave the engine. | The exhaust is very hot. | L'échappement est très chaud.
Exhaust nozzle | Tuyère | The opening at the rear that accelerates the gas. | The exhaust nozzle shows burn marks. | La tuyère présente des traces de brûlure.
Exhaust gas | Gaz d'échappement | The hot gas that leaves the engine. | The exhaust gas temperature is too high. | La température des gaz d'échappement est trop élevée.
Shaft | Arbre | A rotating rod that transmits power. | The shaft connects the turbine to the fan. | L'arbre relie la turbine à la soufflante.
Bearing housing | Carter de palier | The casing that holds a bearing. | Oil leaks from the bearing housing. | De l'huile fuit du carter de palier.
Engine casing | Carter moteur | The outer metal case of the engine. | There is a crack in the engine casing. | Il y a une fissure dans le carter moteur.
Engine mount | Support moteur | The structure that attaches the engine to the aircraft. | Inspect the engine mount bolts. | Inspectez les boulons du support moteur.
Engine nacelle | Nacelle moteur | The housing around the engine. | The engine nacelle is under the wing. | La nacelle moteur est sous l'aile.
Inlet | Entrée d'air | The front opening where air enters the engine. | Check the inlet for foreign objects. | Vérifiez l'entrée d'air pour détecter les corps étrangers.
Air intake | Prise d'air | An opening that lets air into a system. | The air intake is covered with ice. | La prise d'air est couverte de glace.
Bypass duct | Conduit de flux secondaire | The channel where the cold air flows around the core. | Most of the air goes through the bypass duct. | La majeure partie de l'air passe par le conduit de flux secondaire.
Oil sump | Carter d'huile | The tank at the bottom where oil collects. | Drain the oil sump. | Vidangez le carter d'huile. | 🛢️
Oil filter | Filtre à huile | A part that cleans the engine oil. | Change the oil filter. | Changez le filtre à huile.
Fuel pump | Pompe à carburant | A pump that sends fuel to the engine. | The fuel pump is running. | La pompe à carburant fonctionne. | ⛽
Gearbox | Boîte de transmission | A box of gears that transmits power. | The gearbox drives the generator. | La boîte de transmission entraîne le générateur.
Accessory gearbox | Boîte d'accessoires | The gearbox that drives the engine accessories. | The pump is mounted on the accessory gearbox. | La pompe est montée sur la boîte d'accessoires.
Thrust | Poussée | The force that pushes the aircraft forward. | The engine produces 120 kN of thrust. | Le moteur produit 120 kN de poussée.
Power | Puissance | The rate at which work is done. | The engine lost power. | Le moteur a perdu de la puissance. | ⚡
Torque | Couple | A turning force. | The torque indicator shows 80%. | L'indicateur de couple affiche 80 %.
Rotational speed | Vitesse de rotation | How fast something turns. | The rotational speed is measured in RPM. | La vitesse de rotation est mesurée en tours par minute.
Engine speed | Régime moteur | The rotational speed of the engine. | Reduce the engine speed to idle. | Réduisez le régime moteur au ralenti.
RPM (Revolutions Per Minute) | Tours par minute | The number of turns made in one minute. | The fan turns at 5,000 RPM. | La soufflante tourne à 5 000 tours par minute.
Pressure | Pression | The force of a fluid on a surface. | The oil pressure is normal. | La pression d'huile est normale.
Temperature | Température | How hot or cold something is. | The temperature is 650 degrees. | La température est de 650 degrés. | 🌡️
Airflow | Débit d'air | The movement of air through the engine. | A blocked inlet reduces the airflow. | Une entrée d'air obstruée réduit le débit d'air. | 💨
Fuel consumption | Consommation de carburant | The amount of fuel used. | The fuel consumption increased this month. | La consommation de carburant a augmenté ce mois-ci.
Combustion | Combustion | The process of burning fuel. | Combustion produces hot gas. | La combustion produit des gaz chauds.
Ignition | Allumage | The start of combustion. | Ignition takes place after the starter turns the engine. | L'allumage a lieu après que le démarreur a fait tourner le moteur.
Compression | Compression | Making air take up less space. | Compression increases the air pressure. | La compression augmente la pression de l'air.
Expansion | Détente | The increase in volume of a hot gas. | Expansion of the gas turns the turbine. | La détente du gaz fait tourner la turbine.
Engine efficiency | Rendement moteur | How well the engine turns fuel into useful work. | New engines have better engine efficiency. | Les nouveaux moteurs ont un meilleur rendement.
Thermal efficiency | Rendement thermique | How well heat is turned into work. | Higher temperatures improve thermal efficiency. | Des températures plus élevées améliorent le rendement thermique.
Vibration | Vibration | A fast shaking movement. | The pilot reported engine vibration. | Le pilote a signalé des vibrations moteur. | 📳
Overheating | Surchauffe | Becoming too hot. | Overheating can damage the turbine. | La surchauffe peut endommager la turbine. | 🔥
Engine performance | Performances moteur | How well the engine works. | Engine performance is monitored in flight. | Les performances moteur sont surveillées en vol.
Starting sequence | Séquence de démarrage | The steps followed to start an engine. | Follow the starting sequence in the manual. | Suivez la séquence de démarrage du manuel.
`});
