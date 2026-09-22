// ===================================================================
// ÉTAT DU JEU
// Une seule structure centralise tout ce qu'il faut savoir sur la partie en cours :
// la configuration choisie dans le menu, les cartes, les joueurs et le tour actuel.
// ===================================================================
const etat = {
  scene: "menu",       // "menu" | "jeu" | "fin"
  mode: null,           // "ordinateur" | "multi"
  nbJoueurs: 1,          // nombre de joueurs humains (1 si contre l'ordinateur)
  difficulteOrdi: null,  // "naze" | "moyen" | "fort" (uniquement en mode "ordinateur")
  theme: THEME_PAR_DEFAUT, // voir THEMES_VISUELS dans js/themes.js
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

// Les symboles des cartes (dos + images de paires) dépendent du thème visuel
// choisi dans le menu : voir js/themes.js.
