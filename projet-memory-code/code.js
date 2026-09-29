// ===================================================================
// MEMORY MULTIJOUEUR — LOGIQUE DU JEU
// Les classes Carte, Joueur et Partie vivent chacune dans leur propre fichier
// (carte.js, joueur.js, partie.js, chargés juste avant celui-ci). Ce fichier
// contient tout le reste :
//   1. Thèmes visuels (données : liste, symboles, chemins d'images)
//   2. Constantes du jeu + configuration choisie dans le menu
//   3. Éléments HTML (récupérés une fois pour toutes)
//   4. Traductions (dictionnaire FR/DE/EN + thème jour/nuit)
//   5. Menu de configuration
//   6. Livre des règles
//   7. Fin de partie et statistiques
// ===================================================================


// ===================================================================
// THÈMES VISUELS
// Chaque thème change le fond, les couleurs, la police (voir style.css, classes
// body.theme-<id>) et les images des cartes (dos + symboles). Ce fichier ne
// contient que la partie "données" : la liste des thèmes, leur nombre de
// symboles disponibles et le chemin de leurs images. Les couleurs/polices sont
// gérées entièrement en CSS.
//
// IMPORTANT : la plupart des thèmes utilisent encore des espaces réservés
// générés automatiquement (voir images/themes/<id>/), à remplacer par les
// vraies images de chaque thème. Le thème "mediamatique" a déjà ses vraies
// images (logos d'outils + symboles de catégories fournis).
// ===================================================================
const THEMES_VISUELS = ["anime", "japon", "mediamatique", "medieval", "communaute", "youtube"];
const THEME_PAR_DEFAUT = "medieval";

// Nombre de symboles (= paires max) disponibles par thème. La plupart ont 28
// placeholders, exactement les 56 cartes maximum proposées dans le menu ; le
// thème "mediamatique" n'a que 20 vraies images, donc son nombre de cartes
// max dans le menu est limité en conséquence (voir mettreAJourLimiteCartes()).
const NB_SYMBOLES_PAR_THEME = {
  anime: 28,
  japon: 28,
  mediamatique: 20,
  medieval: 28,
  communaute: 28,
  youtube: 28,
};

// Extension de fichier par thème (tous les thèmes en placeholders utilisent
// du ".svg" ; seul "mediamatique" est en ".png").
const EXTENSION_PAR_DEFAUT_PAR_THEME = {
  anime: "svg",
  japon: "svg",
  mediamatique: "png",
  medieval: "svg",
  communaute: "svg",
  youtube: "svg",
};

// Certains symboles ont une extension différente de celle par défaut de leur
// thème (des vraies images fournies au fur et à mesure, dans le format où
// elles ont été trouvées, plutôt que les placeholders ".svg" d'origine).
// Liste plate {theme, numeroSymbole, extension}, une ligne par exception.
const EXCEPTIONS_EXTENSION_SYMBOLE = [
  { theme: "mediamatique", numeroSymbole: 11, extension: "svg" }, // logo PhpMyAdmin
  { theme: "anime", numeroSymbole: 1, extension: "png" },
  { theme: "communaute", numeroSymbole: 1, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 2, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 3, extension: "png" },
  { theme: "communaute", numeroSymbole: 4, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 5, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 6, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 7, extension: "JPG" },
  { theme: "communaute", numeroSymbole: 8, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 9, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 10, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 11, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 12, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 13, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 14, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 15, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 16, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 17, extension: "jpeg" },
  { theme: "communaute", numeroSymbole: 18, extension: "jpg" },
  { theme: "communaute", numeroSymbole: 19, extension: "jpg" },
];

// Chemin de l'image de dos (face cachée, identique pour toutes les cartes d'un thème).
function cheminDosCarte(theme) {
  return `images/themes/${theme}/dos.svg`;
}

// Cherche une extension spéciale pour ce symbole de ce thème dans la liste
// d'exceptions ; renvoie null si aucune exception ne le concerne.
function chercherExtensionException(theme, numeroSymbole) {
  for (let i = 0; i < EXCEPTIONS_EXTENSION_SYMBOLE.length; i++) {
    const exception = EXCEPTIONS_EXTENSION_SYMBOLE[i];
    if (exception.theme === theme && exception.numeroSymbole === numeroSymbole) {
      return exception.extension;
    }
  }
  return null;
}

// Chemin de l'image d'un symbole donné (1 à NB_SYMBOLES_PAR_THEME[theme]) pour un thème.
function cheminSymboleCarte(theme, numeroSymbole) {
  const numero = String(numeroSymbole).padStart(2, "0");
  const exception = chercherExtensionException(theme, numeroSymbole);
  const extension = exception || EXTENSION_PAR_DEFAUT_PAR_THEME[theme];
  return `images/themes/${theme}/symbole-${numero}.${extension}`;
}


// ===================================================================
// CONSTANTES DU JEU + CONFIGURATION CHOISIE DANS LE MENU
// "scene" et "config" existent même avant qu'une partie ne commence (elles
// pilotent le menu) ; "partieActuelle" ne prend vie qu'au clic sur "Valider"
// (voir la classe Partie plus bas et boutonValiderMenu.addEventListener()).
// ===================================================================
let scene = "menu"; // "menu" | "jeu" | "fin"

// La configuration choisie dans le menu, avant qu'une partie n'existe.
const config = {
  mode: null,           // "solo" | "ordinateur" | "multi"
  nbJoueurs: 1,          // nombre de joueurs humains (1 si solo ou contre l'ordinateur)
  difficulteOrdi: null,  // "naze" | "moyen" | "fort" (uniquement en mode "ordinateur")
  theme: THEME_PAR_DEFAUT, // voir THEMES_VISUELS plus haut
  nbCartes: 16,          // toujours un multiple de 4
  difficulte: "facile",  // "facile" | "moyen" | "difficile"
};

// Une seule partie active à la fois : créée au clic sur "Valider" (voir plus
// bas), remplacée par une nouvelle instance à chaque nouvelle partie.
let partieActuelle = null;

// Couleurs des lumières, dans l'ordre des joueurs (voir style.css)
const CLASSES_COULEUR_JOUEURS = ["joueur-1", "joueur-2", "joueur-3", "joueur-4"];
const CLES_TRADUCTION_COULEURS = ["couleur-bleu", "couleur-vert", "couleur-rose", "couleur-jaune"];

const COEURS_DEPART = 10;
const TEMPS_TOUR = 45; // secondes laissées à chaque joueur pour retourner 2 cartes


// ===================================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// On récupère une fois pour toutes les éléments qu'on va devoir modifier,
// plutôt que de refaire document.getElementById() à chaque fois.
// ===================================================================
const ecranMenu = document.getElementById("ecran-menu");
const ecranJeu = document.getElementById("ecran-jeu");
const ecranFin = document.getElementById("ecran-fin");

const blocNbJoueurs = document.getElementById("bloc-nb-joueurs");
const blocDifficulteOrdi = document.getElementById("bloc-difficulte-ordi");
const recapMenu = document.getElementById("recap-menu");
const boutonValiderMenu = document.getElementById("bouton-valider-menu");

const chronoAffichage = document.getElementById("chrono");
const tempsTourAffichage = document.getElementById("temps-tour");
const listeJoueurs = document.getElementById("liste-joueurs");
const grilleCartes = document.getElementById("grille-cartes");

const titreFin = document.getElementById("titre-fin");
const messageFin = document.getElementById("message-fin");
const statistiquesFin = document.getElementById("statistiques-fin");

// Éléments du livre des règles
const livre = document.getElementById("livre");
const couvertureLivre = document.getElementById("couverture-livre");
const pageQuestion = document.getElementById("page-question");
const pageBonneChance = document.getElementById("page-bonne-chance");
const pageRegles = document.getElementById("page-regles");
const boutonLancerPartie = document.getElementById("bouton-lancer-partie");
const languetteLivre = document.getElementById("languette-livre");


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
  "mode-solo": { fr: "Solo", de: "Solo", en: "Solo" },
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
  if (partieActuelle !== null) {
    partieActuelle.afficherJoueurs();
    partieActuelle.allumerLumiereJoueurActuel();
  }
  if (scene === "fin") {
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
// menu : <body> porte donc 2 classes en même temps, par exemple
// "theme-japon theme-jour". Les couleurs de chaque combinaison sont définies
// en CSS (voir style.css, body.theme-<visuel>.theme-<luminosite>).
// "nuit" est la luminosité par défaut (pas de classe de luminosité).
// ===================================================================
const LUMINOSITES = ["nuit", "crepuscule", "jour"];
let luminositeActuelleIndex = 0;

// Applique sur <body> la classe du thème visuel choisi (config.theme) et
// celle de la luminosité actuelle, sans effacer l'autre (contrairement à une
// simple affectation de body.className).
function appliquerClassesBody() {
  LUMINOSITES.forEach((luminosite) => document.body.classList.remove(`theme-${luminosite}`));
  THEMES_VISUELS.forEach((theme) => document.body.classList.remove(`theme-${theme}`));

  document.body.classList.add(`theme-${config.theme}`);
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
// ÉCRAN 1 : MENU DE CONFIGURATION
// Chaque groupe de boutons (thème, mode, joueurs, cartes, difficulté)
// fonctionne pareil : un clic sélectionne le bouton, désélectionne les autres
// du même groupe, et enregistre le choix dans "config".
// ===================================================================

// Le thème "Animé / Pop culture" représente plusieurs univers à la fois : sa
// couleur d'accent (boutons, bordures) est tirée au hasard parmi 6 classes
// CSS (accent-anime-1 à accent-anime-6, voir style.css) à chaque sélection du
// thème, plutôt que de se fixer sur une seule teinte (qui finirait par
// rappeler un autre thème, comme le rose de Japon).
const NB_ACCENTS_ANIME = 6;

function choisirAccentAnimeAuHasard() {
  for (let i = 1; i <= NB_ACCENTS_ANIME; i++) {
    document.body.classList.remove(`accent-anime-${i}`);
  }
  const numeroChoisi = Math.floor(Math.random() * NB_ACCENTS_ANIME) + 1;
  document.body.classList.add(`accent-anime-${numeroChoisi}`);
}

// Choix du thème visuel : change immédiatement l'apparence de toute la page
// (fond, couleurs, police, dos de carte) pour un aperçu en direct, même avant
// de valider le reste de la configuration. "Médiéval" est présélectionné par
// défaut (voir index.html et THEME_PAR_DEFAUT plus haut).
const boutonsTheme = document.querySelectorAll("[data-theme]");
boutonsTheme.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsTheme.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    config.theme = bouton.dataset.theme;
    appliquerClassesBody();
    if (config.theme === "anime") {
      choisirAccentAnimeAuHasard();
    }
    mettreAJourLimiteCartes();
    mettreAJourRecapMenu();
  });
});

// Certains thèmes ont moins de 28 symboles disponibles (voir
// NB_SYMBOLES_PAR_THEME plus haut) : leurs boutons "Nombre de cartes"
// au-delà de 2× ce nombre de symboles sont désactivés. Si le nombre de cartes
// déjà choisi n'est plus disponible pour le nouveau thème, on désélectionne
// ce bouton (le joueur doit en choisir un autre valide).
function mettreAJourLimiteCartes() {
  const nbCartesMax = NB_SYMBOLES_PAR_THEME[config.theme] * 2;

  document.querySelectorAll("[data-cartes]").forEach((bouton) => {
    const nbCartesBouton = Number(bouton.dataset.cartes);
    const disponible = nbCartesBouton <= nbCartesMax;
    bouton.disabled = !disponible;

    if (!disponible && bouton.classList.contains("selectionne")) {
      bouton.classList.remove("selectionne");
      config.nbCartes = null;
    }
  });
}

// Choix du mode : solo, contre l'ordinateur, ou multijoueur.
// Le bloc "nombre de joueurs" ne s'affiche que si "multi" est choisi, le bloc
// "difficulté de l'ordinateur" seulement si "ordinateur" est choisi (le mode
// solo n'a besoin d'aucun des deux : un seul joueur humain, pas de robot).
const boutonsMode = document.querySelectorAll("[data-mode]");
boutonsMode.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsMode.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    config.mode = bouton.dataset.mode;
    blocNbJoueurs.hidden = config.mode !== "multi";
    blocDifficulteOrdi.hidden = config.mode !== "ordinateur";

    if (config.mode !== "multi") {
      config.nbJoueurs = 1; // solo ou contre l'ordinateur : un seul joueur humain
    }
    if (config.mode !== "ordinateur") {
      config.difficulteOrdi = null;
    }
    mettreAJourRecapMenu();
  });
});

const boutonsJoueurs = document.querySelectorAll("[data-joueurs]");
boutonsJoueurs.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsJoueurs.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    config.nbJoueurs = Number(bouton.dataset.joueurs);
    mettreAJourRecapMenu();
  });
});

const boutonsDifficulteOrdi = document.querySelectorAll("[data-difficulte-ordi]");
boutonsDifficulteOrdi.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsDifficulteOrdi.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    config.difficulteOrdi = bouton.dataset.difficulteOrdi;
    mettreAJourRecapMenu();
  });
});

// Boutons 12 à 56 (pas de 4/8) : le nombre maximum de cartes proposé.
const boutonsCartes = document.querySelectorAll("[data-cartes]");
boutonsCartes.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsCartes.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    config.nbCartes = Number(bouton.dataset.cartes);
    mettreAJourRecapMenu();
  });
});

const boutonsDifficulte = document.querySelectorAll("[data-difficulte]");
boutonsDifficulte.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsDifficulte.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    config.difficulte = bouton.dataset.difficulte;
    mettreAJourRecapMenu();
  });
});

// Vérifie que chaque paramètre obligatoire a bien été choisi par le joueur
// (mode, nombre de joueurs si multi, difficulté de l'ordi si mode ordinateur,
// nombre de cartes, difficulté du mélange). Sert à la fois pour activer/désactiver
// le bouton et comme sécurité au moment du clic.
function configurationComplete() {
  const modeChoisi = config.mode !== null;
  const nbJoueursOk = config.mode !== "multi" || document.querySelector("[data-joueurs].selectionne") !== null;
  const difficulteOrdiOk = config.mode !== "ordinateur" || document.querySelector("[data-difficulte-ordi].selectionne") !== null;
  const cartesChoisies = document.querySelector("[data-cartes].selectionne") !== null;
  const difficulteChoisie = document.querySelector("[data-difficulte].selectionne") !== null;

  return modeChoisi && nbJoueursOk && difficulteOrdiOk && cartesChoisies && difficulteChoisie;
}

// Affiche un petit résumé des choix et active le bouton "Valider" seulement
// quand tout ce qui est obligatoire a été choisi.
function mettreAJourRecapMenu() {
  const pret = configurationComplete();
  boutonValiderMenu.disabled = !pret;

  if (pret) {
    let texteMode;
    if (config.mode === "multi") {
      texteMode = `${config.nbJoueurs} ${t("joueurs-mot")}`;
    } else if (config.mode === "ordinateur") {
      texteMode = `${t("contre-ordinateur")} (${t("ordi-" + config.difficulteOrdi).toLowerCase()})`;
    } else {
      texteMode = t("mode-solo");
    }
    recapMenu.textContent = `${t("theme-" + config.theme)} · ${texteMode} · ${config.nbCartes} ${t("cartes-mot")} · ${t("difficulte-mot")} ${t(config.difficulte).toLowerCase()}`;
  } else {
    recapMenu.textContent = "";
  }
}

// Une fois la configuration validée, on crée la partie (cartes, joueurs) et
// on ouvre directement le livre fermé sur sa page de garde, avant que le plateau
// ne soit révélé.
// La vérification est refaite ici (en plus du bouton désactivé) : une sécurité
// pour ne jamais démarrer une partie si un paramètre n'a pas été choisi.
boutonValiderMenu.addEventListener("click", () => {
  if (!configurationComplete()) return;

  partieActuelle = new Partie(config.mode, config.nbJoueurs, config.difficulteOrdi, config.theme, config.nbCartes, config.difficulte);
  changerEcran("jeu");
  ouvrirLivrePremierAcces();
});

// Synchronise l'état du bouton dès le chargement de la page, plutôt que de se
// reposer uniquement sur l'attribut "disabled" écrit à la main dans le HTML.
mettreAJourLimiteCartes();
mettreAJourRecapMenu();


// ===================================================================
// GESTION DES ÉCRANS
// Affiche l'écran demandé et cache tous les autres, pour n'en montrer qu'un à la fois.
// ===================================================================
function changerEcran(nom) {
  scene = nom;
  ecranMenu.hidden = nom !== "menu";
  ecranJeu.hidden = nom !== "jeu";
  ecranFin.hidden = nom !== "fin";
}


// ===================================================================
// LIVRE DES RÈGLES
// Un livre fermé qu'il faut cliquer pour ouvrir. Il sert deux fois :
// - au premier accès à la partie (avant que les cartes ne soient jouables),
// - en pause pendant la partie, rouvert via la languette #languette-livre.
// Le comportement change selon le contexte (voir "premier accès" ci-dessous).
// ===================================================================
let livrePremierAcces = true; // true tant que le joueur n'a pas encore répondu à la question initiale

// Ouvre le livre fermé pour la toute première fois, avant que le plateau ne soit révélé.
function ouvrirLivrePremierAcces() {
  livrePremierAcces = true;
  languetteLivre.hidden = true; // pas encore de partie en cours : pas de pause possible
  afficherLivreFerme();
  livre.hidden = false;
}

// Rouvre le livre en pleine partie : on saute directement à la page des règles,
// pas besoin de reposer la question "voulez-vous lire les règles ?".
function ouvrirLivreEnPause() {
  livrePremierAcces = false;
  partieActuelle.mettreEnPause();
  afficherPage(pageRegles);
  boutonLancerPartie.textContent = t("relancer-partie");
  livre.classList.remove("livre-ferme");
  livre.classList.add("livre-ouvert");
  livre.hidden = false;
}

// Remet le livre sur sa couverture fermée (page de garde) et affiche la question.
function afficherLivreFerme() {
  livre.classList.add("livre-ferme");
  livre.classList.remove("livre-ouvert");
  afficherPage(pageQuestion);
  boutonLancerPartie.textContent = t("lancer-partie");
}

// N'affiche qu'une seule page du livre à la fois.
function afficherPage(pageAMontrer) {
  [pageQuestion, pageBonneChance, pageRegles].forEach((page) => {
    page.hidden = page !== pageAMontrer;
  });
}

// Cliquer sur la couverture fermée ouvre le livre sur sa première page.
couvertureLivre.addEventListener("click", () => {
  livre.classList.remove("livre-ferme");
  livre.classList.add("livre-ouvert");
});

// "Oui, je souhaite lire les règles" : la page se tourne sur les règles.
document.getElementById("bouton-lire-regles").addEventListener("click", () => {
  afficherPage(pageRegles);
});

// "Non, je ne souhaite pas lire les règles" : phrase affichée 10 secondes puis
// la partie démarre automatiquement (seulement au tout premier accès).
document.getElementById("bouton-refuser-regles").addEventListener("click", () => {
  afficherPage(pageBonneChance);
  setTimeout(() => {
    fermerLivreEtLancerPartie();
  }, 500);
});

// "Lancer la partie" / "Relancer la partie" : referme le livre et démarre ou reprend le jeu.
boutonLancerPartie.addEventListener("click", () => {
  fermerLivreEtLancerPartie();
});

function fermerLivreEtLancerPartie() {
  livre.hidden = true;
  languetteLivre.hidden = false;

  if (livrePremierAcces) {
    partieActuelle.demarrerTour();
    livrePremierAcces = false;
  } else {
    partieActuelle.reprendre();
  }
}

// La languette reste visible pendant toute la partie pour rouvrir le livre (= pause).
languetteLivre.addEventListener("click", () => {
  ouvrirLivreEnPause();
});


// Transforme un nombre de secondes en texte "MM:SS".
function formaterTemps(totalSecondes) {
  const minutes = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
  const secondes = (totalSecondes % 60).toString().padStart(2, "0");
  return `${minutes}:${secondes}`;
}


// ===================================================================
// FIN DE PARTIE (affichage)
// ===================================================================

// Affiche le titre et le message de fin dans la langue actuelle. Appelée à la
// fin de la partie, et de nouveau si la langue change pendant l'écran de fin.
function afficherResultatFin() {
  if (partieActuelle.dernierResultat === "victoire") {
    titreFin.textContent = t("victoire-titre");
    messageFin.textContent = `${t("victoire-message")} ${formaterTemps(partieActuelle.secondesEcoulees)}.`;
  } else {
    titreFin.textContent = t("defaite-titre");
    messageFin.textContent = t("defaite-message");
  }
}

// Affiche, pour chaque joueur, ses paires trouvées, ses vies restantes, le
// temps moyen mis pour trouver une paire, et le temps de réflexion moyen réel
// entre le 1er et le 2e clic de chaque tour.
function afficherStatistiquesFin() {
  statistiquesFin.innerHTML = "";

  partieActuelle.joueurs.forEach((joueur) => {
    const tempsMoyen = joueur.pairesTrouvees > 0
      ? Math.round(joueur.sommeTempsPaires / joueur.pairesTrouvees)
      : null;
    const texteTempsMoyen = tempsMoyen !== null ? `${tempsMoyen}${t("temps-moyen-paire")}` : t("aucune-paire");

    const tempsReflexionMoyen = joueur.nbToursJoues > 0
      ? (joueur.sommeTempsReflexion / joueur.nbToursJoues).toFixed(1)
      : null;
    const texteTempsReflexion = tempsReflexionMoyen !== null
      ? `${tempsReflexionMoyen}${t("temps-reflexion-moyen")}`
      : t("aucun-temps-reflexion");

    const ligne = document.createElement("div");
    ligne.className = `ligne-stat-fin ${joueur.classeCouleur}`;
    ligne.innerHTML = `
      <span class="lumiere"></span>
      <span class="nom-stat-fin">${joueur.nomAffiche()}</span>
      <span>${joueur.pairesTrouvees} ${t("paires-trouvees")}</span>
      <span>❤️ ${joueur.coeurs}</span>
      <span>${texteTempsMoyen}</span>
      <span>${texteTempsReflexion}</span>
    `;
    statistiquesFin.appendChild(ligne);
  });
}

// Le bouton "Rejouer" ramène directement au menu pour choisir une nouvelle configuration.
document.getElementById("bouton-rejouer").addEventListener("click", () => {
  changerEcran("menu");
});
