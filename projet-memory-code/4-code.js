// ===================================================================
// 🔴🔴🔴 ÉCART ATELIERS — séparer chaque classe dans son propre fichier
// n'a pas d'équivalent dans les ateliers du cours : leurs classes (Meule,
// Billet...) vivent toujours dans le même fichier que le reste de l'atelier
// (voir 2-MODIF.md, section "À partir de maintenant"). Écart assumé, demandé
// explicitement par l'utilisateur. 🔴🔴🔴
// ===================================================================


// ===================================================================
// MEMORY MULTIJOUEUR — LOGIQUE DU JEU
//
// Contient tout ce qui n'est pas une classe : les constantes partagées, les
// éléments HTML récupérés une fois pour toutes, la barre de réglages
// (luminosité jour/nuit), la gestion des écrans, et l'affichage de fin de
// partie. Les classes vivent chacune dans leur propre fichier, chargés
// juste avant celui-ci : 4-theme-visuel.js, 4-traducteur.js, 4-carte.js,
// 4-joueur.js, 4-partie.js, 4-menu.js, 4-livre-des-regles.js.
//
// Fichier : 4-code.js (fichier entier).
// ===================================================================


// ===================================================================
// CONSTANTES DU JEU
//
// "scene" pilote l'écran affiché (menu/jeu/fin) et "partieActuelle" pointe
// vers la partie en cours (ou null avant qu'une partie n'ait commencé) : ces
// deux variables existent en dehors de toute classe, car partagées par tout
// le code. Les autres constantes (couleurs des joueurs, coeurs de départ,
// durée d'un tour) sont des valeurs fixes du jeu, utilisées par plusieurs
// classes.
//
// Fichier : 4-code.js (ci-dessous) ; "partieActuelle" est une instance de la
// classe Partie (voir 4-partie.js), "scene" et ces constantes sont lues depuis
// 4-partie.js et 4-menu.js.
// ===================================================================
let scene = "menu"; // "menu" | "jeu" | "fin"
let partieActuelle = null;

// Couleurs des lumières, dans l'ordre des joueurs (voir 6-style.css)
const CLASSES_COULEUR_JOUEURS = ["joueur-1", "joueur-2", "joueur-3", "joueur-4"];
const CLES_TRADUCTION_COULEURS = ["couleur-bleu", "couleur-vert", "couleur-rose", "couleur-jaune"];

const COEURS_DEPART = 10;
const TEMPS_TOUR = 45; // secondes laissées à chaque joueur pour retourner 2 cartes


// ===================================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
//
// Récupère une fois pour toutes les éléments qu'on va devoir modifier,
// plutôt que de refaire document.getElementById() à chaque fois.
//
// Fichier : 4-code.js (ci-dessous) ; les éléments correspondent aux ids
// déclarés dans 5-index.html.
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
const pairesTrouvees = document.getElementById("paires-trouvees");
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
// BARRE DE RÉGLAGES : LUMINOSITÉ JOUR / NUIT / ENTRE-DEUX
//
// Cycle entre 3 niveaux de luminosité, combinés au thème visuel choisi dans
// le menu : <body> porte donc 2 classes en même temps, par exemple
// "theme-japon theme-jour" ("nuit" est la luminosité par défaut, sans
// classe).
//
// Fichier : 4-code.js (ci-dessous) ; les couleurs de chaque combinaison sont
// définies en CSS dans 6-style.css
// (body.theme-<visuel>.theme-<luminosite>).
// ===================================================================
const LUMINOSITES = ["nuit", "crepuscule", "jour"];
let luminositeActuelleIndex = 0;

// Applique sur <body> la classe du thème visuel choisi (menu.theme) et
// celle de la luminosité actuelle, sans effacer l'autre (contrairement à une
// simple affectation de body.className).
function appliquerClassesBody() {
  LUMINOSITES.forEach((luminosite) => document.body.classList.remove(`theme-${luminosite}`));
  Object.keys(THEMES_VISUELS).forEach((theme) => document.body.classList.remove(`theme-${theme}`));

  document.body.classList.add(`theme-${menu.theme}`);
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


// ===================================================================
// GESTION DES ÉCRANS
//
// Affiche l'écran demandé (menu / jeu / fin) et cache tous les autres, pour
// n'en montrer qu'un à la fois.
//
// Fichier : 4-code.js, fonction changerEcran() ; appelée depuis 4-menu.js et
// 4-partie.js à chaque changement d'écran.
// ===================================================================
function changerEcran(nom) {
  scene = nom;
  ecranMenu.hidden = nom !== "menu";
  ecranJeu.hidden = nom !== "jeu";
  ecranFin.hidden = nom !== "fin";
}


// Transforme un nombre de secondes en texte "MM:SS".
function formaterTemps(totalSecondes) {
  const minutes = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
  const secondes = (totalSecondes % 60).toString().padStart(2, "0");
  return `${minutes}:${secondes}`;
}


// ===================================================================
// FIN DE PARTIE (affichage)
//
// Affiche le titre, le message de fin et les statistiques de chaque joueur
// (paires trouvées, coeurs restants, temps moyens) sur l'écran de fin.
//
// Fichier : 4-code.js, fonctions afficherResultatFin() à
// afficherStatistiquesFin() ; appelées depuis Partie.terminer()
// (voir 4-partie.js).
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
