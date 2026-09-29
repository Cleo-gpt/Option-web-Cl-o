// ===================================================================
// MEMORY MULTIJOUEUR — LOGIQUE DU JEU
// Sommaire (dans l'ordre où le code apparaît ci-dessous) :
//   1. Thèmes visuels (données : liste, symboles, chemins d'images)
//   2. Constantes du jeu + configuration choisie dans le menu
//   3. Éléments HTML (récupérés une fois pour toutes)
//   4. Traductions (dictionnaire FR/DE/EN + thème jour/nuit)
//   5. Menu de configuration
//   6. Livre des règles
//   7. Classe Carte
//   8. Classe Joueur
//   9. Classe Partie (cartes, joueurs, tour actuel, chrono)
//  10. Affichage (joueurs, cartes)
//  11. IA du robot (mode "contre l'ordinateur")
//  12. Fin de partie et statistiques
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

// Nombre de symboles (= paires max) disponibles par thème. La plupart ont 36
// placeholders (de quoi couvrir les 72 cartes proposées dans le menu) ; le
// thème "mediamatique" n'a que 20 vraies images, donc son nombre de cartes
// max dans le menu est limité en conséquence (voir mettreAJourLimiteCartes()).
const NB_SYMBOLES_PAR_THEME = {
  anime: 36,
  japon: 36,
  mediamatique: 20,
  medieval: 36,
  communaute: 36,
  youtube: 36,
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

// Le thème "mediamatique" a un seul symbole qui fait exception à ".png" : le
// symbole 11 (logo PhpMyAdmin), fourni en ".svg". Liste plate, un numéro de
// symbole par ligne, plutôt qu'un objet imbriqué.
const EXTENSIONS_SYMBOLES_MEDIAMATIQUE = [
  { numeroSymbole: 11, extension: "svg" },
];

// Chemin de l'image de dos (face cachée, identique pour toutes les cartes d'un thème).
function cheminDosCarte(theme) {
  return `images/themes/${theme}/dos.svg`;
}

// Cherche une extension spéciale pour ce symbole dans la liste d'exceptions du
// thème "mediamatique" ; renvoie null si aucune exception ne le concerne.
function chercherExtensionException(theme, numeroSymbole) {
  if (theme !== "mediamatique") return null;

  for (let i = 0; i < EXTENSIONS_SYMBOLES_MEDIAMATIQUE.length; i++) {
    if (EXTENSIONS_SYMBOLES_MEDIAMATIQUE[i].numeroSymbole === numeroSymbole) {
      return EXTENSIONS_SYMBOLES_MEDIAMATIQUE[i].extension;
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

// Certains thèmes ont moins de 36 symboles disponibles (voir
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

// Boutons 12 à 72 (pas de 4/8) : le nombre maximum de cartes proposé.
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


// ===================================================================
// CLASSE CARTE
// Une carte de la grille : son identifiant, le symbole qu'elle porte (deux
// cartes partagent le même numeroSymbole = une paire), et si elle est
// actuellement retournée ou déjà trouvée.
// ===================================================================
class Carte {
  constructor(id, numeroSymbole) {
    this.id = id;
    this.numeroSymbole = numeroSymbole;
    this.retournee = false;
    this.trouvee = false;
  }

  // Deux cartes forment une paire si elles portent le même symbole.
  estUnePaireAvec(autreCarte) {
    return this.numeroSymbole === autreCarte.numeroSymbole;
  }

  retourner() {
    this.retournee = true;
  }

  cacher() {
    this.retournee = false;
  }

  marquerTrouvee() {
    this.trouvee = true;
  }

  // Une carte est visible (son symbole se voit) si elle est retournée ou déjà trouvée.
  estVisible() {
    return this.retournee || this.trouvee;
  }
}


// ===================================================================
// CLASSE JOUEUR
// Un joueur humain ou le robot : ses coeurs, sa couleur, et les statistiques
// accumulées pendant la partie (paires trouvées, temps de réflexion, erreurs).
// ===================================================================
class Joueur {
  constructor(numero, classeCouleur, estRobot) {
    this.numero = numero;             // le nom affiché ("Joueur 1"...) est composé avec nomAffiche()
    this.classeCouleur = classeCouleur;
    this.estRobot = estRobot;
    this.coeurs = COEURS_DEPART;
    this.pairesTrouvees = 0;          // pour les statistiques affichées à la fin de la partie
    this.sommeTempsPaires = 0;        // somme des secondes mises à trouver chaque paire (pour la moyenne)
    this.sommeTempsReflexion = 0;     // somme des secondes entre le 1er et le 2e clic de chaque tour joué
    this.nbToursJoues = 0;            // nombre de tours où les 2 cartes ont été retournées (pour la moyenne de réflexion)
    this.erreurs = 0;                 // nombre de paires ratées, utilisé par l'IA pour évaluer le niveau du joueur humain
  }

  // Le nom affiché ("Joueur 1" / "Spieler 1" / "Player 1", ou le nom de
  // l'ordinateur), toujours recalculé dans la langue actuelle.
  nomAffiche() {
    return this.estRobot ? t("ordinateur-mot") : `${t("joueur-mot")} ${this.numero}`;
  }

  estElimine() {
    return this.coeurs <= 0;
  }

  gagnerCoeur() {
    this.coeurs += 1;
  }

  // Fait perdre un coeur, sans jamais descendre sous 0.
  perdreCoeur() {
    this.coeurs = Math.max(0, this.coeurs - 1);
    this.erreurs += 1;
  }

  // Une paire de plus, et le temps mis pour la trouver (donné par l'appelant,
  // qui connaît le chrono de la partie) vient allonger la moyenne.
  gagnerPaire(secondesDepuisDebutTour) {
    this.pairesTrouvees += 1;
    this.sommeTempsPaires += secondesDepuisDebutTour;
  }

  // Ajoute une mesure de temps de réflexion (entre le 1er et le 2e clic),
  // utilisée pour calculer sa moyenne à l'écran de fin.
  enregistrerTempsReflexion(secondes) {
    this.sommeTempsReflexion += secondes;
    this.nbToursJoues += 1;
  }
}


// ===================================================================
// CLASSE PARTIE
// Regroupe tout ce qu'il faut savoir sur la partie en cours : les cartes, les
// joueurs, le tour actuel, le chrono et le minuteur de tour. Une seule
// instance vit à la fois, dans la variable "partieActuelle" (voir plus haut).
// ===================================================================
class Partie {
  constructor(mode, nbJoueurs, difficulteOrdi, theme, nbCartes, difficulte) {
    this.mode = mode;
    this.difficulteOrdi = difficulteOrdi;
    this.theme = theme;

    this.joueurs = this.creerJoueurs(nbJoueurs);
    this.cartes = this.creerEtMelangerCartes(nbCartes, difficulte);
    this.joueurActuelIndex = 0;
    this.cartesRetournees = [];
    this.paireEnAttente = false; // true pendant la petite pause où on affiche 2 cartes qui ne correspondent pas
    this.enPause = false;        // true pendant que le livre est rouvert en cours de partie

    // Chronomètre de la partie (minutes : secondes)
    this.identifiantChrono = null;
    this.secondesEcoulees = 0;
    this.chronoDemarre = false; // devient true au premier clic sur une carte, jusqu'à la fin de la partie

    // Minuteur du tour en cours
    this.identifiantMinuteurTour = null;
    this.secondesRestantesTour = TEMPS_TOUR;
    this.secondesDebutTourJoueur = 0;   // valeur du chrono au début du tour, pour mesurer le temps mis à trouver une paire
    this.instantPremierClicTour = 0;    // Date.now() au premier clic du tour, pour le temps de réflexion réel

    this.memoireRobot = {};             // symbole -> liste des ids de cartes vues avec ce symbole, encore cachées
    this.dernierResultat = null;        // "victoire" | "defaite", mémorisé pour retraduire l'écran de fin

    this.afficherJoueurs();
    this.afficherCartes();
  }

  // Construit la liste des joueurs : des humains, puis un robot si le mode "ordinateur" est choisi.
  creerJoueurs(nbJoueurs) {
    const joueurs = [];

    for (let i = 0; i < nbJoueurs; i++) {
      joueurs.push(new Joueur(i + 1, CLASSES_COULEUR_JOUEURS[i], false));
    }

    if (this.mode === "ordinateur") {
      joueurs.push(new Joueur(null, "joueur-robot", true));
    }

    return joueurs;
  }

  // Crée les paires de cartes puis les mélange. La difficulté choisie change
  // simplement le nombre de mélanges effectués : plus il y en a, plus l'ordre
  // final est imprévisible. Chaque carte retient le numéro de son symbole
  // (1 à NB_SYMBOLES_PAR_THEME) : l'image affichée dépend du thème visuel
  // choisi (voir cheminSymboleCarte() plus haut), mais la comparaison de
  // paires se fait sur ce numéro, indépendamment du thème.
  creerEtMelangerCartes(nbCartes, difficulte) {
    const nbPaires = nbCartes / 2;

    // Chaque symbole apparaît deux fois (= une paire)
    let cartes = [];
    let id = 0;
    for (let numeroSymbole = 1; numeroSymbole <= nbPaires; numeroSymbole++) {
      for (let exemplaire = 0; exemplaire < 2; exemplaire++) {
        cartes.push(new Carte(id, numeroSymbole));
        id++;
      }
    }

    const nbMelanges = { facile: 1, moyen: 4, difficile: 10 }[difficulte];
    for (let m = 0; m < nbMelanges; m++) {
      cartes = this.melangerUneFois(cartes);
    }

    return cartes;
  }

  // Mélange de Fisher-Yates : parcourt le tableau depuis la fin et échange
  // chaque carte avec une autre choisie au hasard avant elle.
  melangerUneFois(cartes) {
    const resultat = cartes.slice();
    for (let i = resultat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultat[i], resultat[j]] = [resultat[j], resultat[i]];
    }
    return resultat;
  }


  // ===== AFFICHAGE DES JOUEURS (colonne de gauche : lumière + nom + coeurs) =====

  afficherJoueurs() {
    listeJoueurs.innerHTML = "";

    this.joueurs.forEach((joueur, index) => {
      const ligne = document.createElement("div");
      ligne.className = `ligne-joueur ${joueur.classeCouleur}`;
      ligne.classList.toggle("elimine", joueur.estElimine()); // reste correct si on retraduit en cours de partie
      ligne.id = `ligne-joueur-${index}`;

      const nomCouleur = joueur.estRobot ? t("couleur-argente") : t(CLES_TRADUCTION_COULEURS[index]);
      ligne.innerHTML = `
        <span class="lumiere"></span>
        <span>${joueur.nomAffiche()} (${nomCouleur})</span>
        <span class="coeurs" id="coeurs-${index}">❤️ ${joueur.coeurs}</span>
      `;
      listeJoueurs.appendChild(ligne);
    });
  }

  // Met à jour uniquement le nombre de coeurs affiché pour un joueur donné.
  afficherCoeurs(index) {
    const joueur = this.joueurs[index];
    document.getElementById(`coeurs-${index}`).textContent = `❤️ ${joueur.coeurs}`;

    const ligne = document.getElementById(`ligne-joueur-${index}`);
    ligne.classList.toggle("elimine", joueur.estElimine());
  }

  // Allume la lumière du joueur dont c'est le tour et éteint celles des autres.
  allumerLumiereJoueurActuel() {
    this.joueurs.forEach((_, index) => {
      const lumiere = document.querySelector(`#ligne-joueur-${index} .lumiere`);
      lumiere.classList.toggle("allumee", index === this.joueurActuelIndex);
    });
  }


  // ===== AFFICHAGE DES CARTES =====

  afficherCartes() {
    grilleCartes.innerHTML = "";

    this.cartes.forEach((carte) => {
      const bouton = document.createElement("button");
      bouton.className = "carte";
      bouton.id = `carte-${carte.id}`;
      bouton.addEventListener("click", () => this.choisirCarte(carte.id));

      // Le dos (face cachée) est posé en CSS via background-image (voir .carte
      // dans style.css) : il suit automatiquement le thème choisi. Seule l'image
      // du symbole (face visible) est gérée ici, une fois la carte retournée.
      const imageSymbole = document.createElement("img");
      imageSymbole.className = "image-symbole-carte";
      imageSymbole.src = cheminSymboleCarte(this.theme, carte.numeroSymbole);
      imageSymbole.alt = "";
      imageSymbole.hidden = true;
      bouton.appendChild(imageSymbole);

      grilleCartes.appendChild(bouton);
    });
  }

  // Met à jour l'apparence d'une carte en fonction de son état (cachée / retournée / trouvée).
  rafraichirCarte(carte) {
    const bouton = document.getElementById(`carte-${carte.id}`);
    bouton.classList.toggle("retournee", carte.retournee);
    bouton.classList.toggle("trouvee", carte.trouvee);
    bouton.querySelector(".image-symbole-carte").hidden = !carte.estVisible();
  }


  // ===== TOUR DE JEU =====
  // Un tour = un joueur retourne 2 cartes (ou le temps s'écoule).

  demarrerTour() {
    this.cartesRetournees = [];
    this.allumerLumiereJoueurActuel();

    this.secondesRestantesTour = TEMPS_TOUR;
    tempsTourAffichage.textContent = `${this.secondesRestantesTour}s`;
    this.secondesDebutTourJoueur = this.secondesEcoulees;

    this.lancerMinuteurTour();

    // Si c'est le tour de l'ordinateur, il joue automatiquement après un court délai.
    const joueurActuel = this.joueurs[this.joueurActuelIndex];
    if (joueurActuel.estRobot) {
      setTimeout(() => {
        if (!this.enPause) this.jouerTourRobot();
      }, 800);
    }
  }

  // Démarre le décompte du tour à partir de la valeur actuelle de
  // "secondesRestantesTour" (utilisé au début d'un tour, mais aussi pour
  // reprendre après une pause).
  lancerMinuteurTour() {
    clearInterval(this.identifiantMinuteurTour);
    this.identifiantMinuteurTour = setInterval(() => {
      this.secondesRestantesTour -= 1;
      tempsTourAffichage.textContent = `${this.secondesRestantesTour}s`;

      if (this.secondesRestantesTour <= 0) {
        // Le temps est écoulé : le joueur n'a pas terminé son tour, il perd un coeur.
        clearInterval(this.identifiantMinuteurTour);
        this.perdreCoeurJoueurActuel();
        this.passerAuJoueurSuivant();
      }
    }, 1000);
  }

  // Le joueur (ou le robot) clique sur une carte pour la retourner.
  choisirCarte(idCarte) {
    if (this.enPause) return; // le livre est ouvert : le plateau est bloqué
    if (this.paireEnAttente) return; // on attend que la paire précédente soit masquée

    const carte = this.cartes.find((c) => c.id === idCarte);
    if (carte.estVisible()) return; // carte déjà visible : rien à faire
    if (this.cartesRetournees.length >= 2) return; // déjà 2 cartes retournées ce tour-ci

    // Le chrono de la partie démarre seulement au tout premier clic sur une carte.
    if (!this.chronoDemarre) {
      this.demarrerChrono();
    }

    // Horodatage du premier clic du tour, pour mesurer le temps de réflexion
    // réel jusqu'au second clic (voir verifierPaire()).
    if (this.cartesRetournees.length === 0) {
      this.instantPremierClicTour = Date.now();
    }

    carte.retourner();
    this.rafraichirCarte(carte);
    this.cartesRetournees.push(carte);
    this.memoriserCartePourRobot(carte);

    if (this.cartesRetournees.length === 2) {
      this.verifierPaire();
    }
  }

  // Compare les deux cartes retournées : paire trouvée (+1 coeur) ou erreur (-1 coeur).
  verifierPaire() {
    clearInterval(this.identifiantMinuteurTour);
    this.paireEnAttente = true;

    const [carteA, carteB] = this.cartesRetournees;
    const estUnePaire = carteA.estUnePaireAvec(carteB);

    // Temps de réflexion réel entre le 1er et le 2e clic de ce tour (en secondes).
    const tempsReflexion = (Date.now() - this.instantPremierClicTour) / 1000;
    this.joueurs[this.joueurActuelIndex].enregistrerTempsReflexion(tempsReflexion);

    setTimeout(() => {
      if (estUnePaire) {
        carteA.marquerTrouvee();
        carteB.marquerTrouvee();
        this.gagnerCoeurJoueurActuel();
      } else {
        carteA.cacher();
        carteB.cacher();
        this.perdreCoeurJoueurActuel();
      }
      this.rafraichirCarte(carteA);
      this.rafraichirCarte(carteB);
      this.paireEnAttente = false;

      if (this.toutesLesPairesTrouvees()) {
        this.terminer("victoire");
        return;
      }

      // En cas de paire trouvée, le même joueur rejoue ; sinon on passe au suivant.
      if (estUnePaire) {
        this.demarrerTour();
      } else {
        this.passerAuJoueurSuivant();
      }
    }, 800);
  }

  toutesLesPairesTrouvees() {
    return this.cartes.every((carte) => carte.trouvee);
  }

  gagnerCoeurJoueurActuel() {
    const joueur = this.joueurs[this.joueurActuelIndex];
    joueur.gagnerCoeur();
    this.afficherCoeurs(this.joueurActuelIndex);

    // Statistiques pour l'écran de fin : une paire de plus, et le temps mis
    // pour la trouver (depuis le début de ce tour) vient allonger la moyenne.
    joueur.gagnerPaire(this.secondesEcoulees - this.secondesDebutTourJoueur);
  }

  // Fait perdre un coeur au joueur actuel et vérifie s'il est éliminé.
  perdreCoeurJoueurActuel() {
    const joueur = this.joueurs[this.joueurActuelIndex];
    joueur.perdreCoeur();
    this.afficherCoeurs(this.joueurActuelIndex);

    if (joueur.estElimine() && this.plusAucunJoueurEnVie()) {
      this.terminer("defaite");
    }
  }

  plusAucunJoueurEnVie() {
    return this.joueurs.every((joueur) => joueur.estElimine());
  }

  // Passe la main au prochain joueur encore en vie.
  passerAuJoueurSuivant() {
    if (scene !== "jeu") return; // la partie est peut-être déjà terminée

    do {
      this.joueurActuelIndex = (this.joueurActuelIndex + 1) % this.joueurs.length;
    } while (this.joueurs[this.joueurActuelIndex].estElimine());

    this.demarrerTour();
  }


  // ===== IA DU ROBOT (mode "contre l'ordinateur") =====
  // Le robot a une mémoire des cartes déjà vues (les siennes et celles du
  // joueur humain) et l'utilise plus ou moins selon la difficulté choisie :
  // - "naze"  : mémorise mais évite volontairement de jouer une paire connue.
  // - "moyen" : joue parfois la paire connue, parfois au hasard (des feintes).
  // - "fort"  : joue la paire connue dès que possible, sauf s'il écrase déjà
  //             trop le joueur, auquel cas il rate volontairement un tour de
  //             temps en temps pour garder la partie intéressante.

  // Appelée à chaque carte retournée (par le joueur humain ou le robot
  // lui-même) : le robot "voit" toujours les cartes retournées, comme un
  // joueur humain le ferait.
  memoriserCartePourRobot(carte) {
    if (!this.memoireRobot[carte.numeroSymbole]) {
      this.memoireRobot[carte.numeroSymbole] = [];
    }
    if (!this.memoireRobot[carte.numeroSymbole].includes(carte.id)) {
      this.memoireRobot[carte.numeroSymbole].push(carte.id);
    }
  }

  // Cherche un symbole dont le robot connaît 2 cartes différentes, encore
  // cachées et non trouvées. Retourne les 2 cartes si une paire connue existe,
  // sinon null.
  chercherPaireConnue() {
    for (const symbole in this.memoireRobot) {
      const idsConnus = this.memoireRobot[symbole].filter((id) => {
        const carte = this.cartes.find((c) => c.id === id);
        return carte && !carte.estVisible();
      });
      if (idsConnus.length >= 2) {
        const carteA = this.cartes.find((c) => c.id === idsConnus[0]);
        const carteB = this.cartes.find((c) => c.id === idsConnus[1]);
        return [carteA, carteB];
      }
    }
    return null;
  }

  // Tire une carte cachée au hasard, en excluant éventuellement une carte déjà choisie.
  carteAuHasard(carteAExclure) {
    const cartesDisponibles = this.cartes.filter(
      (c) => !c.estVisible() && c !== carteAExclure
    );
    return cartesDisponibles[Math.floor(Math.random() * cartesDisponibles.length)];
  }

  joueurHumain() {
    return this.joueurs.find((j) => !j.estRobot);
  }

  joueurRobot() {
    return this.joueurs.find((j) => j.estRobot);
  }

  // Écart de coeurs robot - humain : positif si le robot mène.
  ecartCoeursRobot() {
    return this.joueurRobot().coeurs - this.joueurHumain().coeurs;
  }

  // Probabilité que le robot joue la paire connue plutôt qu'au hasard, si il en a une.
  probabiliteJouerPaireConnue() {
    if (this.difficulteOrdi === "naze") {
      return 0; // ne joue jamais la paire connue : il perd naturellement
    }
    if (this.difficulteOrdi === "moyen") {
      return 0.5; // une feinte sur deux
    }
    // "fort" : joue quasi toujours la paire connue, sauf s'il écrase déjà le
    // joueur humain (grand écart de coeurs en sa faveur) : il se retient alors
    // un tour sur trois pour laisser la partie ouverte.
    const ecrasement = this.ecartCoeursRobot() >= 4;
    return ecrasement ? 0.7 : 0.95;
  }

  // Choisit les 2 cartes que le robot va retourner ce tour-ci, selon sa
  // mémoire et la difficulté choisie.
  choisirCartesRobot() {
    const paireConnue = this.chercherPaireConnue();

    if (paireConnue && Math.random() < this.probabiliteJouerPaireConnue()) {
      return paireConnue;
    }

    // Pas de paire connue exploitée : 2 cartes au hasard parmi les cachées
    // (c'est aussi ce qui fait "découvrir" nos propres cartes pour plus tard).
    const premiereCarte = this.carteAuHasard();
    const deuxiemeCarte = this.carteAuHasard(premiereCarte);
    return [premiereCarte, deuxiemeCarte];
  }

  // Le robot joue son tour : un court délai avant chaque clic pour rester
  // lisible à l'écran, comme un joueur qui regarde le plateau avant de choisir.
  jouerTourRobot() {
    if (scene !== "jeu") return;

    const [premiereCarte, deuxiemeCarte] = this.choisirCartesRobot();
    this.choisirCarte(premiereCarte.id);

    setTimeout(() => {
      if (scene !== "jeu" || this.enPause) return;
      this.choisirCarte(deuxiemeCarte.id);
    }, 600);
  }


  // ===== CHRONOMÈTRE ET PAUSE =====

  demarrerChrono() {
    this.chronoDemarre = true;
    this.secondesEcoulees = 0;
    chronoAffichage.textContent = "00:00";

    this.identifiantChrono = setInterval(() => {
      this.secondesEcoulees += 1;
      chronoAffichage.textContent = formaterTemps(this.secondesEcoulees);
    }, 1000);
  }

  arreterChrono() {
    clearInterval(this.identifiantChrono);
  }

  // Reprend le chrono là où il en était, sans le remettre à zéro.
  reprendreChrono() {
    clearInterval(this.identifiantChrono);
    this.identifiantChrono = setInterval(() => {
      this.secondesEcoulees += 1;
      chronoAffichage.textContent = formaterTemps(this.secondesEcoulees);
    }, 1000);
  }

  // Le chrono et le minuteur de tour s'arrêtent sans se réinitialiser ;
  // choisirCarte() est aussi bloqué via this.enPause.
  mettreEnPause() {
    this.enPause = true;
    this.arreterChrono();
    clearInterval(this.identifiantMinuteurTour);
  }

  reprendre() {
    this.enPause = false;
    // Le chrono ne reprend que s'il avait déjà démarré (le joueur a pu ouvrir
    // le livre en pause avant même d'avoir retourné sa première carte).
    if (this.chronoDemarre) {
      this.reprendreChrono();
    }
    this.lancerMinuteurTour();
  }


  // ===== FIN DE PARTIE =====

  terminer(resultat) {
    this.arreterChrono();
    clearInterval(this.identifiantMinuteurTour);
    languetteLivre.hidden = true;

    this.dernierResultat = resultat;
    afficherResultatFin();
    afficherStatistiquesFin();
    changerEcran("fin");
  }
}

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
