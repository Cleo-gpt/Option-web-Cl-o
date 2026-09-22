// ===================================================================
// ÉTAT DU JEU
// Une seule structure centralise tout ce qu'il faut savoir sur la partie en cours :
// la configuration choisie dans le menu, les cartes, les joueurs et le tour actuel.
// ===================================================================
const etat = {
  scene: "menu",       // "menu" | "jeu" | "fin"
  mode: null,           // "ordinateur" | "multi"
  nbJoueurs: 1,          // nombre de joueurs humains (1 si contre l'ordinateur)
  nbCartes: 16,          // toujours un multiple de 4
  difficulte: "facile",  // "facile" | "moyen" | "difficile"
  cartes: [],            // toutes les cartes de la grille
  joueurs: [],           // liste des joueurs (humains + robot éventuel)
  joueurActuelIndex: 0,
  cartesRetournees: [],  // les 0, 1 ou 2 cartes actuellement retournées par le joueur en cours
  paireEnAttente: false, // true pendant la petite pause où on affiche 2 cartes qui ne correspondent pas
  enPause: false,         // true pendant que le livre est rouvert en cours de partie
};

// Couleurs des lumières, dans l'ordre des joueurs (voir style.css)
const CLASSES_COULEUR_JOUEURS = ["joueur-1", "joueur-2", "joueur-3", "joueur-4"];
const CLES_TRADUCTION_COULEURS = ["couleur-bleu", "couleur-vert", "couleur-rose", "couleur-jaune"];

const COEURS_DEPART = 10;
const TEMPS_TOUR = 45; // secondes laissées à chaque joueur pour retourner 2 cartes

// Symboles utilisés sur les cartes : 46 symboles, de quoi couvrir jusqu'à
// 92 cartes (46 paires), le maximum proposé dans le menu.
const SYMBOLES = [
  "🍎", "🍋", "🍇", "🍉", "🍓", "🍒", "🍍", "🥝", "🥥", "🍑", "🍌", "🥕",
  "🍊", "🍐", "🍈", "🫐", "🥭", "🌽", "🥑", "🍆",
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
  "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦄", "🐝",
  "⚽", "🏀", "🏈", "⚾", "🎾", "🏐",
];


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
  "mode-de-jeu": { fr: "Mode de jeu", de: "Spielmodus", en: "Game mode" },
  "mode-ordinateur": { fr: "Contre l'ordinateur", de: "Gegen den Computer", en: "Against the computer" },
  "mode-multi": { fr: "Multijoueur", de: "Mehrspieler", en: "Multiplayer" },
  "nombre-joueurs": { fr: "Nombre de joueurs", de: "Anzahl der Spieler", en: "Number of players" },
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
// BARRE DE RÉGLAGES : THÈME JOUR / NUIT / ENTRE-DEUX
// Cycle entre 3 thèmes en changeant la classe de <body> ; les couleurs de
// chaque thème sont définies en CSS (voir style.css, body et body.theme-...).
// "nuit" est le thème par défaut (aucune classe).
// ===================================================================
const THEMES = ["nuit", "crepuscule", "jour"];
let themeActuelIndex = 0;

const boutonTheme = document.getElementById("bouton-theme");
boutonTheme.addEventListener("click", () => {
  themeActuelIndex = (themeActuelIndex + 1) % THEMES.length;
  const theme = THEMES[themeActuelIndex];
  document.body.className = theme === "nuit" ? "" : `theme-${theme}`;
});


// ===================================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// On récupère une fois pour toutes les éléments qu'on va devoir modifier,
// plutôt que de refaire document.getElementById() à chaque fois.
// ===================================================================
const ecranMenu = document.getElementById("ecran-menu");
const ecranJeu = document.getElementById("ecran-jeu");
const ecranFin = document.getElementById("ecran-fin");

const blocNbJoueurs = document.getElementById("bloc-nb-joueurs");
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
// ÉCRAN 1 : MENU DE CONFIGURATION
// Chaque groupe de boutons (mode, joueurs, cartes, difficulté) fonctionne pareil :
// un clic sélectionne le bouton, désélectionne les autres du même groupe, et
// enregistre le choix dans "etat".
// ===================================================================

// Gère un groupe de boutons de choix (ex: les boutons de difficulté).
// "selecteur" cible les boutons du groupe, "surChoix" reçoit la valeur choisie.
function gererGroupeBoutons(selecteur, surChoix) {
  const boutons = document.querySelectorAll(selecteur);
  boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
      boutons.forEach((b) => b.classList.remove("selectionne"));
      bouton.classList.add("selectionne");
      surChoix(bouton.dataset);
    });
  });
}

// Choix du mode : contre l'ordinateur ou multijoueur.
// Le bloc "nombre de joueurs" ne s'affiche que si "multi" est choisi.
gererGroupeBoutons("[data-mode]", (dataset) => {
  etat.mode = dataset.mode;
  if (etat.mode === "multi") {
    blocNbJoueurs.hidden = false;
  } else {
    blocNbJoueurs.hidden = true;
    etat.nbJoueurs = 1; // contre l'ordinateur : un seul joueur humain
  }
  mettreAJourRecapMenu();
});

gererGroupeBoutons("[data-joueurs]", (dataset) => {
  etat.nbJoueurs = Number(dataset.joueurs);
  mettreAJourRecapMenu();
});

// Les 4 boutons 12/16/20/24 et le curseur choisissent tous deux le même
// paramètre : choisir l'un désélectionne l'autre.
gererGroupeBoutons("[data-cartes]", (dataset) => {
  etat.nbCartes = Number(dataset.cartes);
  curseurCartes.classList.remove("selectionne");
  mettreAJourRecapMenu();
});

// Curseur 24 → 92 (pas de 4) : au-delà des 4 boutons.
const curseurCartes = document.getElementById("curseur-cartes");
const bulleCurseurCartes = document.getElementById("bulle-curseur-cartes");

// Déplace la bulle au-dessus de la poignée. La position en pourcentage de la
// piste (valeur - min) / (max - min) donne directement la position en % de la
// largeur du curseur, comme un thermomètre gradué de 0 à 100.
function deplacerBulleCurseurCartes() {
  const pourcentage = (curseurCartes.value - curseurCartes.min) / (curseurCartes.max - curseurCartes.min);
  bulleCurseurCartes.style.left = `${pourcentage * 100}%`;
  bulleCurseurCartes.textContent = curseurCartes.value;
}

curseurCartes.addEventListener("input", () => {
  etat.nbCartes = Number(curseurCartes.value);
  deplacerBulleCurseurCartes();
  curseurCartes.classList.add("selectionne");
  document.querySelectorAll("[data-cartes]").forEach((b) => b.classList.remove("selectionne"));
  mettreAJourRecapMenu();
});

deplacerBulleCurseurCartes(); // position initiale de la bulle, au chargement de la page

gererGroupeBoutons("[data-difficulte]", (dataset) => {
  etat.difficulte = dataset.difficulte;
  mettreAJourRecapMenu();
});

// Vérifie que chaque paramètre obligatoire a bien été choisi par le joueur
// (mode, nombre de joueurs si multi, nombre de cartes, difficulté). Sert à la
// fois pour activer/désactiver le bouton et comme sécurité au moment du clic.
function configurationComplete() {
  const modeChoisi = etat.mode !== null;
  const nbJoueursOk = etat.mode !== "multi" || document.querySelector("[data-joueurs].selectionne") !== null;
  const cartesChoisies = document.querySelector("[data-cartes].selectionne") !== null
    || curseurCartes.classList.contains("selectionne");
  const difficulteChoisie = document.querySelector("[data-difficulte].selectionne") !== null;

  return modeChoisi && nbJoueursOk && cartesChoisies && difficulteChoisie;
}

// Affiche un petit résumé des choix et active le bouton "Valider" seulement
// quand tout ce qui est obligatoire a été choisi.
function mettreAJourRecapMenu() {
  const pret = configurationComplete();
  boutonValiderMenu.disabled = !pret;

  if (pret) {
    const texteMode = etat.mode === "multi" ? `${etat.nbJoueurs} ${t("joueurs-mot")}` : t("contre-ordinateur");
    recapMenu.textContent = `${texteMode} · ${etat.nbCartes} ${t("cartes-mot")} · ${t("difficulte-mot")} ${t(etat.difficulte).toLowerCase()}`;
  } else {
    recapMenu.textContent = "";
  }
}

// Une fois la configuration validée, on prépare la partie (cartes, joueurs) et
// on ouvre directement le livre fermé sur sa page de garde, avant que le plateau
// ne soit révélé.
// La vérification est refaite ici (en plus du bouton désactivé) : une sécurité
// pour ne jamais démarrer une partie si un paramètre n'a pas été choisi.
boutonValiderMenu.addEventListener("click", () => {
  if (!configurationComplete()) return;

  preparerPartie();
  changerEcran("jeu");
  ouvrirLivrePremierAcces();
});

// Synchronise l'état du bouton dès le chargement de la page, plutôt que de se
// reposer uniquement sur l'attribut "disabled" écrit à la main dans le HTML.
mettreAJourRecapMenu();


// ===================================================================
// GESTION DES ÉCRANS
// Affiche l'écran demandé et cache tous les autres, pour n'en montrer qu'un à la fois.
// ===================================================================
function changerEcran(nom) {
  etat.scene = nom;
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
  mettreEnPause();
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
    demarrerPartie();
    livrePremierAcces = false;
  } else {
    reprendrePartie();
  }
}

// La languette reste visible pendant toute la partie pour rouvrir le livre (= pause).
languetteLivre.addEventListener("click", () => {
  ouvrirLivreEnPause();
});


// ===================================================================
// PRÉPARATION DE LA PARTIE
// Crée les joueurs, mélange les cartes et affiche le plateau de jeu, mais sans
// démarrer le chrono ni le tour : le plateau reste caché derrière le livre
// jusqu'à ce que le joueur ait répondu à la question des règles.
// ===================================================================
function preparerPartie() {
  creerJoueurs();
  etat.cartes = creerEtMelangerCartes(etat.nbCartes, etat.difficulte);
  etat.joueurActuelIndex = 0;
  etat.cartesRetournees = [];
  chronoDemarre = false;
  chronoAffichage.textContent = "00:00";

  afficherJoueurs();
  afficherCartes();
}

// Démarre réellement la partie (le tour), une fois le livre refermé.
// Le chrono, lui, ne démarre qu'au premier clic sur une carte (voir choisirCarte()).
function demarrerPartie() {
  demarrerTour();
}

// Construit la liste des joueurs : des humains, puis un robot si le mode "ordinateur" est choisi.
function creerJoueurs() {
  etat.joueurs = [];

  for (let i = 0; i < etat.nbJoueurs; i++) {
    etat.joueurs.push({
      numero: i + 1,          // le nom affiché ("Joueur 1", "Player 1"...) est composé avec t() à l'affichage
      classeCouleur: CLASSES_COULEUR_JOUEURS[i],
      coeurs: COEURS_DEPART,
      estRobot: false,
      pairesTrouvees: 0,      // pour les statistiques affichées à la fin de la partie
      sommeTempsPaires: 0,    // somme des secondes mises à trouver chaque paire (pour la moyenne)
    });
  }

  if (etat.mode === "ordinateur") {
    etat.joueurs.push({
      numero: null,
      classeCouleur: "joueur-robot",
      coeurs: COEURS_DEPART,
      estRobot: true,
      pairesTrouvees: 0,
      sommeTempsPaires: 0,
    });
  }
}

// Le nom affiché d'un joueur ("Joueur 1" / "Spieler 1" / "Player 1", ou le nom
// de l'ordinateur), toujours recalculé dans la langue actuelle.
function nomJoueur(joueur) {
  return joueur.estRobot ? t("ordinateur-mot") : `${t("joueur-mot")} ${joueur.numero}`;
}

// Crée les paires de cartes puis les mélange. La difficulté choisie change
// simplement le nombre de mélanges effectués : plus il y en a, plus l'ordre
// final est imprévisible.
function creerEtMelangerCartes(nbCartes, difficulte) {
  const nbPaires = nbCartes / 2;
  const symbolesUtilises = SYMBOLES.slice(0, nbPaires);

  // Chaque symbole apparaît deux fois (= une paire)
  let cartes = symbolesUtilises.concat(symbolesUtilises).map((symbole, index) => ({
    id: index,
    symbole: symbole,
    retournee: false,
    trouvee: false,
  }));

  const nbMelanges = { facile: 1, moyen: 4, difficile: 10 }[difficulte];
  for (let m = 0; m < nbMelanges; m++) {
    cartes = melangerUneFois(cartes);
  }

  return cartes;
}

// Mélange de Fisher-Yates : parcourt le tableau depuis la fin et échange
// chaque carte avec une autre choisie au hasard avant elle.
function melangerUneFois(cartes) {
  const resultat = cartes.slice();
  for (let i = resultat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultat[i], resultat[j]] = [resultat[j], resultat[i]];
  }
  return resultat;
}


// ===================================================================
// AFFICHAGE DES JOUEURS (colonne de gauche : lumière + nom + coeurs)
// ===================================================================
function afficherJoueurs() {
  listeJoueurs.innerHTML = "";

  etat.joueurs.forEach((joueur, index) => {
    const ligne = document.createElement("div");
    ligne.className = `ligne-joueur ${joueur.classeCouleur}`;
    ligne.classList.toggle("elimine", joueur.coeurs <= 0); // reste correct si on retraduit en cours de partie
    ligne.id = `ligne-joueur-${index}`;

    const nomCouleur = joueur.estRobot ? t("couleur-argente") : t(CLES_TRADUCTION_COULEURS[index]);
    ligne.innerHTML = `
      <span class="lumiere"></span>
      <span>${nomJoueur(joueur)} (${nomCouleur})</span>
      <span class="coeurs" id="coeurs-${index}">❤️ ${joueur.coeurs}</span>
    `;
    listeJoueurs.appendChild(ligne);
  });
}

// Met à jour uniquement le nombre de coeurs affiché pour un joueur donné.
function afficherCoeurs(index) {
  const joueur = etat.joueurs[index];
  document.getElementById(`coeurs-${index}`).textContent = `❤️ ${joueur.coeurs}`;

  const ligne = document.getElementById(`ligne-joueur-${index}`);
  ligne.classList.toggle("elimine", joueur.coeurs <= 0);
}

// Allume la lumière du joueur dont c'est le tour et éteint celles des autres.
function allumerLumiereJoueurActuel() {
  etat.joueurs.forEach((_, index) => {
    const lumiere = document.querySelector(`#ligne-joueur-${index} .lumiere`);
    lumiere.classList.toggle("allumee", index === etat.joueurActuelIndex);
  });
}


// ===================================================================
// AFFICHAGE DES CARTES
// ===================================================================
function afficherCartes() {
  grilleCartes.innerHTML = "";

  etat.cartes.forEach((carte) => {
    const bouton = document.createElement("button");
    bouton.className = "carte";
    bouton.id = `carte-${carte.id}`;
    bouton.addEventListener("click", () => choisirCarte(carte.id));
    grilleCartes.appendChild(bouton);
  });
}

// Met à jour l'apparence d'une carte en fonction de son état (cachée / retournée / trouvée).
function rafraichirCarte(carte) {
  const bouton = document.getElementById(`carte-${carte.id}`);
  bouton.classList.toggle("retournee", carte.retournee);
  bouton.classList.toggle("trouvee", carte.trouvee);
  bouton.textContent = carte.retournee || carte.trouvee ? carte.symbole : "";
}


// ===================================================================
// TOUR DE JEU
// Un tour = un joueur retourne 2 cartes (ou le temps s'écoule).
// ===================================================================
let identifiantMinuteurTour = null;
let secondesRestantesTour = TEMPS_TOUR;
let secondesDebutTourJoueur = 0; // valeur du chrono au début du tour en cours, pour mesurer le temps mis à trouver une paire

function demarrerTour() {
  etat.cartesRetournees = [];
  allumerLumiereJoueurActuel();

  secondesRestantesTour = TEMPS_TOUR;
  tempsTourAffichage.textContent = `${secondesRestantesTour}s`;
  secondesDebutTourJoueur = secondesEcoulees;

  lancerMinuteurTour();

  // Si c'est le tour de l'ordinateur, il joue automatiquement après un court délai.
  const joueurActuel = etat.joueurs[etat.joueurActuelIndex];
  if (joueurActuel.estRobot) {
    setTimeout(() => {
      if (!etat.enPause) jouerTourRobot();
    }, 800);
  }
}

// Démarre le décompte du tour à partir de la valeur actuelle de "secondesRestantesTour"
// (utilisé au début d'un tour, mais aussi pour reprendre après une pause).
function lancerMinuteurTour() {
  clearInterval(identifiantMinuteurTour);
  identifiantMinuteurTour = setInterval(() => {
    secondesRestantesTour -= 1;
    tempsTourAffichage.textContent = `${secondesRestantesTour}s`;

    if (secondesRestantesTour <= 0) {
      // Le temps est écoulé : le joueur n'a pas terminé son tour, il perd un coeur.
      clearInterval(identifiantMinuteurTour);
      perdreCoeurJoueurActuel();
      passerAuJoueurSuivant();
    }
  }, 1000);
}

// Le joueur (ou le robot) clique sur une carte pour la retourner.
function choisirCarte(idCarte) {
  if (etat.enPause) return; // le livre est ouvert : le plateau est bloqué
  if (etat.paireEnAttente) return; // on attend que la paire précédente soit masquée

  const carte = etat.cartes.find((c) => c.id === idCarte);
  if (carte.retournee || carte.trouvee) return; // carte déjà visible : rien à faire
  if (etat.cartesRetournees.length >= 2) return; // déjà 2 cartes retournées ce tour-ci

  // Le chrono de la partie démarre seulement au tout premier clic sur une carte.
  if (!chronoDemarre) {
    demarrerChrono();
  }

  carte.retournee = true;
  rafraichirCarte(carte);
  etat.cartesRetournees.push(carte);

  if (etat.cartesRetournees.length === 2) {
    verifierPaire();
  }
}

// Compare les deux cartes retournées : paire trouvée (+1 coeur) ou erreur (-1 coeur).
function verifierPaire() {
  clearInterval(identifiantMinuteurTour);
  etat.paireEnAttente = true;

  const [carteA, carteB] = etat.cartesRetournees;
  const estUnePaire = carteA.symbole === carteB.symbole;

  setTimeout(() => {
    if (estUnePaire) {
      carteA.trouvee = true;
      carteB.trouvee = true;
      gagnerCoeurJoueurActuel();
    } else {
      carteA.retournee = false;
      carteB.retournee = false;
      perdreCoeurJoueurActuel();
    }
    rafraichirCarte(carteA);
    rafraichirCarte(carteB);
    etat.paireEnAttente = false;

    if (toutesLesPairesTrouvees()) {
      terminerPartie("victoire");
      return;
    }

    // En cas de paire trouvée, le même joueur rejoue ; sinon on passe au suivant.
    if (estUnePaire) {
      demarrerTour();
    } else {
      passerAuJoueurSuivant();
    }
  }, 800);
}

function toutesLesPairesTrouvees() {
  return etat.cartes.every((carte) => carte.trouvee);
}

function gagnerCoeurJoueurActuel() {
  const joueur = etat.joueurs[etat.joueurActuelIndex];
  joueur.coeurs += 1;
  afficherCoeurs(etat.joueurActuelIndex);

  // Statistiques pour l'écran de fin : une paire de plus, et le temps mis
  // pour la trouver (depuis le début de ce tour) vient allonger la moyenne.
  joueur.pairesTrouvees += 1;
  joueur.sommeTempsPaires += secondesEcoulees - secondesDebutTourJoueur;
}

// Fait perdre un coeur au joueur actuel et vérifie s'il est éliminé.
function perdreCoeurJoueurActuel() {
  const joueur = etat.joueurs[etat.joueurActuelIndex];
  joueur.coeurs = Math.max(0, joueur.coeurs - 1);
  afficherCoeurs(etat.joueurActuelIndex);

  if (joueur.coeurs === 0 && plusAucunJoueurEnVie()) {
    terminerPartie("defaite");
  }
}

function plusAucunJoueurEnVie() {
  return etat.joueurs.every((joueur) => joueur.coeurs <= 0);
}

// Passe la main au prochain joueur encore en vie.
function passerAuJoueurSuivant() {
  if (etat.scene !== "jeu") return; // la partie est peut-être déjà terminée

  do {
    etat.joueurActuelIndex = (etat.joueurActuelIndex + 1) % etat.joueurs.length;
  } while (etat.joueurs[etat.joueurActuelIndex].coeurs <= 0);

  demarrerTour();
}

// Le robot choisit simplement deux cartes cachées au hasard.
function jouerTourRobot() {
  if (etat.scene !== "jeu") return;

  const cartesDisponibles = etat.cartes.filter((c) => !c.retournee && !c.trouvee);
  const premiereCarte = cartesDisponibles[Math.floor(Math.random() * cartesDisponibles.length)];
  choisirCarte(premiereCarte.id);

  setTimeout(() => {
    const cartesRestantes = etat.cartes.filter((c) => !c.retournee && !c.trouvee);
    const deuxiemeCarte = cartesRestantes[Math.floor(Math.random() * cartesRestantes.length)];
    choisirCarte(deuxiemeCarte.id);
  }, 600);
}


// ===================================================================
// CHRONOMÈTRE DE LA PARTIE (minutes : secondes)
// Démarre avec la partie et s'arrête à la victoire ou à la défaite finale.
// ===================================================================
let identifiantChrono = null;
let secondesEcoulees = 0;
let chronoDemarre = false; // devient true au premier clic sur une carte, jusqu'à la fin de la partie

function demarrerChrono() {
  chronoDemarre = true;
  secondesEcoulees = 0;
  chronoAffichage.textContent = "00:00";

  identifiantChrono = setInterval(() => {
    secondesEcoulees += 1;
    chronoAffichage.textContent = formaterTemps(secondesEcoulees);
  }, 1000);
}

function arreterChrono() {
  clearInterval(identifiantChrono);
}

// Reprend le chrono là où il en était, sans le remettre à zéro.
function reprendreChrono() {
  clearInterval(identifiantChrono);
  identifiantChrono = setInterval(() => {
    secondesEcoulees += 1;
    chronoAffichage.textContent = formaterTemps(secondesEcoulees);
  }, 1000);
}

// ===================================================================
// PAUSE (livre rouvert pendant la partie)
// Le chrono et le minuteur de tour s'arrêtent sans se réinitialiser ;
// choisirCarte() est aussi bloqué via etat.enPause.
// ===================================================================
function mettreEnPause() {
  etat.enPause = true;
  arreterChrono();
  clearInterval(identifiantMinuteurTour);
}

function reprendrePartie() {
  etat.enPause = false;
  // Le chrono ne reprend que s'il avait déjà démarré (le joueur a pu ouvrir
  // le livre en pause avant même d'avoir retourné sa première carte).
  if (chronoDemarre) {
    reprendreChrono();
  }
  lancerMinuteurTour();
}

// Transforme un nombre de secondes en texte "MM:SS".
function formaterTemps(totalSecondes) {
  const minutes = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
  const secondes = (totalSecondes % 60).toString().padStart(2, "0");
  return `${minutes}:${secondes}`;
}


// ===================================================================
// FIN DE PARTIE
// ===================================================================
let dernierResultatPartie = null; // mémorisé pour pouvoir retraduire l'écran de fin si la langue change

function terminerPartie(resultat) {
  arreterChrono();
  clearInterval(identifiantMinuteurTour);
  languetteLivre.hidden = true;

  dernierResultatPartie = resultat;
  afficherResultatFin();
  afficherStatistiquesFin();
  changerEcran("fin");
}

// Affiche le titre et le message de fin dans la langue actuelle. Appelée à la
// fin de la partie, et de nouveau si la langue change pendant l'écran de fin.
function afficherResultatFin() {
  if (dernierResultatPartie === "victoire") {
    titreFin.textContent = t("victoire-titre");
    messageFin.textContent = `${t("victoire-message")} ${formaterTemps(secondesEcoulees)}.`;
  } else {
    titreFin.textContent = t("defaite-titre");
    messageFin.textContent = t("defaite-message");
  }
}

// Affiche, pour chaque joueur, ses paires trouvées, ses vies restantes et le
// temps moyen mis pour trouver une paire (somme des temps ÷ nombre de paires).
function afficherStatistiquesFin() {
  statistiquesFin.innerHTML = "";

  etat.joueurs.forEach((joueur) => {
    const tempsMoyen = joueur.pairesTrouvees > 0
      ? Math.round(joueur.sommeTempsPaires / joueur.pairesTrouvees)
      : null;
    const texteTempsMoyen = tempsMoyen !== null ? `${tempsMoyen}${t("temps-moyen-paire")}` : t("aucune-paire");

    const ligne = document.createElement("div");
    ligne.className = `ligne-stat-fin ${joueur.classeCouleur}`;
    ligne.innerHTML = `
      <span class="lumiere"></span>
      <span class="nom-stat-fin">${nomJoueur(joueur)}</span>
      <span>${joueur.pairesTrouvees} ${t("paires-trouvees")}</span>
      <span>❤️ ${joueur.coeurs}</span>
      <span>${texteTempsMoyen}</span>
    `;
    statistiquesFin.appendChild(ligne);
  });
}

// Le bouton "Rejouer" ramène directement au menu pour choisir une nouvelle configuration.
document.getElementById("bouton-rejouer").addEventListener("click", () => {
  changerEcran("menu");
});
