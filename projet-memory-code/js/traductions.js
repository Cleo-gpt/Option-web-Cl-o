// ===================================================================
// TRADUCTIONS
// Un dictionnaire {clé: {fr, de, en}} pour chaque texte fixe de la page. Les
// éléments HTML concernés portent l'attribut data-traduire="<clé>" et sont mis
// à jour par appliquerLangue() (voir plus bas, section BARRE DE RÉGLAGES).
// Le HTML des règles garde ses balises <strong> : on utilise innerHTML pour
// que "10 coeurs" reste en gras dans les trois langues.
// ===================================================================
const TRADUCTIONS = {
  "titre-jeu": { fr: "Memory Multijoueur", de: "Memory Mehrspieler", en: "Memory Multiplayer" },
  "theme-visuel": { fr: "Thème visuel", de: "Visuelles Thema", en: "Visual theme" },
  "theme-anime": { fr: "Animé / Pop culture", de: "Anime / Popkultur", en: "Anime / Pop culture" },
  "theme-japon": { fr: "Japon", de: "Japan", en: "Japan" },
  "theme-mediamatique": { fr: "Médiamatique", de: "Medieninformatik", en: "Media technology" },
  "theme-medieval": { fr: "Médiéval", de: "Mittelalterlich", en: "Medieval" },
  "theme-communaute": { fr: "Communauté engagée", de: "Engagierte Gemeinschaft", en: "Engaged community" },
  "theme-youtube": { fr: "Youtube", de: "Youtube", en: "Youtube" },
  "mode-de-jeu": { fr: "Mode de jeu", de: "Spielmodus", en: "Game mode" },
  "mode-ordinateur": { fr: "Contre l'ordinateur", de: "Gegen den Computer", en: "Against the computer" },
  "mode-multi": { fr: "Multijoueur", de: "Mehrspieler", en: "Multiplayer" },
  "nombre-joueurs": { fr: "Nombre de joueurs", de: "Anzahl der Spieler", en: "Number of players" },
  "difficulte-ordi": { fr: "Difficulté de l'ordinateur", de: "Schwierigkeit des Computers", en: "Computer difficulty" },
  "ordi-naze": { fr: "Très naze", de: "Sehr schwach", en: "Very weak" },
  "ordi-moyen": { fr: "Très moyen", de: "Mittelmäßig", en: "Average" },
  "ordi-fort": { fr: "Très fort", de: "Sehr stark", en: "Very strong" },
  "nombre-cartes": { fr: "Nombre de cartes", de: "Anzahl der Karten", en: "Number of cards" },
  "cartes-mot": { fr: "cartes", de: "Karten", en: "cards" },
  "difficulte-melange": { fr: "Difficulté du mélange", de: "Mischschwierigkeit", en: "Shuffle difficulty" },
  "facile": { fr: "Facile", de: "Einfach", en: "Easy" },
  "moyen": { fr: "Moyen", de: "Mittel", en: "Medium" },
  "difficile": { fr: "Difficile", de: "Schwer", en: "Hard" },
  "valider": { fr: "Valider", de: "Bestätigen", en: "Confirm" },
  "titre-livre": { fr: "Livre des Règles", de: "Buch der Regeln", en: "Book of Rules" },
  "question-regles": { fr: "Voulez-vous lire les règles ?", de: "Möchtest du die Regeln lesen?", en: "Do you want to read the rules?" },
  "oui-regles": { fr: "Oui, je souhaite lire les règles", de: "Ja, ich möchte die Regeln lesen", en: "Yes, I want to read the rules" },
  "non-regles": { fr: "Non, je ne souhaite pas lire les règles", de: "Nein, ich möchte die Regeln nicht lesen", en: "No, I don't want to read the rules" },
  "bonne-chance": { fr: "Dans ce cas, bonne chance.", de: "Dann viel Glück.", en: "In that case, good luck." },
  "titre-regles": { fr: "Règles du jeu", de: "Spielregeln", en: "Game rules" },
  "regle-1": { fr: "Chaque joueur commence avec <strong>10 coeurs</strong>.", de: "Jeder Spieler beginnt mit <strong>10 Herzen</strong>.", en: "Each player starts with <strong>10 hearts</strong>." },
  "regle-2": { fr: "Une erreur (les 2 cartes ne correspondent pas) = <strong>-1 coeur</strong>.", de: "Ein Fehler (die 2 Karten passen nicht zusammen) = <strong>-1 Herz</strong>.", en: "A mistake (the 2 cards don't match) = <strong>-1 heart</strong>." },
  "regle-3": { fr: "Une paire trouvée = <strong>+1 coeur</strong>.", de: "Ein gefundenes Paar = <strong>+1 Herz</strong>.", en: "A pair found = <strong>+1 heart</strong>." },
  "regle-4": { fr: "Un joueur à <strong>0 coeur</strong> est éliminé.", de: "Ein Spieler mit <strong>0 Herzen</strong> scheidet aus.", en: "A player with <strong>0 hearts</strong> is eliminated." },
  "regle-5": { fr: "Le but : rester en vie jusqu'à la fin de la partie.", de: "Ziel: bis zum Ende der Partie am Leben bleiben.", en: "Goal: stay alive until the end of the game." },
  "regle-6": { fr: "Une lumière de couleur signale le joueur dont c'est le tour.", de: "Ein farbiges Licht zeigt den Spieler an, der am Zug ist.", en: "A coloured light shows whose turn it is." },
  "regle-7": { fr: "Chaque joueur a <strong>45 secondes</strong> pour retourner 2 cartes.", de: "Jeder Spieler hat <strong>45 Sekunden</strong>, um 2 Karten umzudrehen.", en: "Each player has <strong>45 seconds</strong> to flip 2 cards." },
  "lancer-partie": { fr: "Lancer la partie", de: "Spiel starten", en: "Start the game" },
  "relancer-partie": { fr: "Relancer la partie", de: "Spiel fortsetzen", en: "Resume the game" },
  "rejouer": { fr: "Rejouer", de: "Nochmal spielen", en: "Play again" },
  "etiquette-temps-jeu": { fr: "Temps de jeu :", de: "Spielzeit:", en: "Game time:" },
  "etiquette-temps-tour": { fr: "Joueur temps restant :", de: "Spieler verbleibende Zeit:", en: "Player time remaining:" },

  // Textes générés dynamiquement en JS (pas d'élément data-traduire fixe en HTML) :
  // ils sont traduits directement dans le code via TRADUCTIONS[cle][langueActuelle].
  "contre-ordinateur": { fr: "contre l'ordinateur", de: "gegen den Computer", en: "against the computer" },
  "joueurs-mot": { fr: "joueurs", de: "Spieler", en: "players" },
  "difficulte-mot": { fr: "difficulté", de: "Schwierigkeit", en: "difficulty" },
  "joueur-mot": { fr: "Joueur", de: "Spieler", en: "Player" },
  "ordinateur-mot": { fr: "Ordinateur", de: "Computer", en: "Computer" },
  "couleur-bleu": { fr: "Bleu", de: "Blau", en: "Blue" },
  "couleur-vert": { fr: "Vert", de: "Grün", en: "Green" },
  "couleur-rose": { fr: "Rose", de: "Rosa", en: "Pink" },
  "couleur-jaune": { fr: "Jaune", de: "Gelb", en: "Yellow" },
  "couleur-argente": { fr: "Argenté", de: "Silbern", en: "Silver" },
  "victoire-titre": { fr: "Toutes les paires sont trouvées !", de: "Alle Paare gefunden!", en: "All pairs found!" },
  "victoire-message": { fr: "Partie terminée en", de: "Partie beendet in", en: "Game finished in" },
  "defaite-titre": { fr: "Partie terminée", de: "Partie beendet", en: "Game over" },
  "defaite-message": { fr: "Tous les joueurs ont perdu leurs coeurs.", de: "Alle Spieler haben ihre Herzen verloren.", en: "All players have lost their hearts." },
  "paires-trouvees": { fr: "paire(s) trouvée(s)", de: "gefundene(s) Paar(e)", en: "pair(s) found" },
  "temps-moyen-paire": { fr: "s en moyenne par paire", de: "s im Schnitt pro Paar", en: "s on average per pair" },
  "aucune-paire": { fr: "aucune paire trouvée", de: "kein Paar gefunden", en: "no pair found" },
  "temps-reflexion-moyen": { fr: "s en moyenne entre les 2 cartes", de: "s im Schnitt zwischen den 2 Karten", en: "s on average between the 2 cards" },
  "aucun-temps-reflexion": { fr: "aucun temps de réflexion mesuré", de: "keine Überlegungszeit gemessen", en: "no thinking time measured" },
};

const LANGUES = ["fr", "de", "en"];
const ETIQUETTES_LANGUE = { fr: "Fr", de: "All", en: "Ang" };
let langueActuelle = "fr";

// Raccourci pour récupérer un texte traduit dans la langue actuelle, utilisé
// partout où le JS construit lui-même un morceau de texte (pas d'élément
// data-traduire fixe : récap du menu, statistiques de fin, noms de joueurs...).
function t(cle) {
  return TRADUCTIONS[cle][langueActuelle];
}

// Applique la langue courante à tous les éléments marqués data-traduire, et au
// bouton de langue lui-même (qui affiche l'abréviation de la langue actuelle).
function appliquerLangue() {
  document.documentElement.lang = langueActuelle;
  document.querySelectorAll("[data-traduire]").forEach((element) => {
    const cle = element.dataset.traduire;
    element.innerHTML = TRADUCTIONS[cle][langueActuelle];
  });
  boutonLangue.textContent = ETIQUETTES_LANGUE[langueActuelle];

  // Retraduit aussi les textes générés dynamiquement en JS, mais seulement
  // s'ils sont déjà affichés (une partie n'a pas forcément commencé).
  mettreAJourRecapMenu();
  if (etat.joueurs.length > 0) {
    afficherJoueurs();
    allumerLumiereJoueurActuel();
  }
  if (etat.scene === "fin") {
    afficherResultatFin();
    afficherStatistiquesFin();
  }
}

const boutonLangue = document.getElementById("bouton-langue");
boutonLangue.addEventListener("click", () => {
  const indexActuel = LANGUES.indexOf(langueActuelle);
  langueActuelle = LANGUES[(indexActuel + 1) % LANGUES.length];
  appliquerLangue();
});


// ===================================================================
// BARRE DE RÉGLAGES : LUMINOSITÉ JOUR / NUIT / ENTRE-DEUX
// Cycle entre 3 niveaux de luminosité, combinés au thème visuel choisi dans le
// menu (voir js/menu.js) : <body> porte donc 2 classes en même temps, par
// exemple "theme-japon theme-jour". Les couleurs de chaque combinaison sont
// définies en CSS (voir style.css, body.theme-<visuel>.theme-<luminosite>).
// "nuit" est la luminosité par défaut (pas de classe de luminosité).
// ===================================================================
const LUMINOSITES = ["nuit", "crepuscule", "jour"];
let luminositeActuelleIndex = 0;

// Applique sur <body> la classe du thème visuel choisi (etat.theme) et celle
// de la luminosité actuelle, sans effacer l'autre (contrairement à une simple
// affectation de body.className).
function appliquerClassesBody() {
  LUMINOSITES.forEach((luminosite) => document.body.classList.remove(`theme-${luminosite}`));
  THEMES_VISUELS.forEach((theme) => document.body.classList.remove(`theme-${theme}`));

  document.body.classList.add(`theme-${etat.theme}`);
  const luminosite = LUMINOSITES[luminositeActuelleIndex];
  if (luminosite !== "nuit") {
    document.body.classList.add(`theme-${luminosite}`);
  }
}

const boutonTheme = document.getElementById("bouton-theme");
boutonTheme.addEventListener("click", () => {
  luminositeActuelleIndex = (luminositeActuelleIndex + 1) % LUMINOSITES.length;
  appliquerClassesBody();
});

appliquerClassesBody(); // thème par défaut dès le chargement de la page


// ===================================================================
// MODE DALTONIEN
// Un simple bascule (on/off), indépendante du thème visuel et du mode de jeu :
// une fois activé, reste actif quel que soit l'écran ou la configuration
// choisie. Palette de joueurs adaptée + motifs distincts, voir style.css
// (body.daltonien).
// ===================================================================
let modeDaltonienActif = false;

const boutonDaltonien = document.getElementById("bouton-daltonien");
boutonDaltonien.addEventListener("click", () => {
  modeDaltonienActif = !modeDaltonienActif;
  document.body.classList.toggle("daltonien", modeDaltonienActif);
  boutonDaltonien.setAttribute("aria-pressed", String(modeDaltonienActif));
});
