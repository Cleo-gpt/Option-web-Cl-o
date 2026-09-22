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
// max dans le menu est limité en conséquence (voir js/menu.js).
const NB_SYMBOLES_PAR_THEME = {
  anime: 36,
  japon: 36,
  mediamatique: 20,
  medieval: 36,
  communaute: 36,
  youtube: 36,
};

// Extension de fichier par symbole, quand elle diffère du défaut ".png" (les
// thèmes en placeholders utilisent du ".svg" ; le thème "mediamatique" est en
// ".png" sauf son symbole 11, un logo fourni au format ".svg").
const EXTENSION_PAR_DEFAUT_PAR_THEME = {
  anime: "svg",
  japon: "svg",
  mediamatique: "png",
  medieval: "svg",
  communaute: "svg",
  youtube: "svg",
};

const EXCEPTIONS_EXTENSION = {
  mediamatique: { 11: "svg" }, // PhpMyAdmin, fourni en SVG
};

// Chemin de l'image de dos (face cachée, identique pour toutes les cartes d'un thème).
function cheminDosCarte(theme) {
  return `images/themes/${theme}/dos.svg`;
}

// Chemin de l'image d'un symbole donné (1 à NB_SYMBOLES_PAR_THEME[theme]) pour un thème.
function cheminSymboleCarte(theme, numeroSymbole) {
  const numero = String(numeroSymbole).padStart(2, "0");
  const exception = EXCEPTIONS_EXTENSION[theme] && EXCEPTIONS_EXTENSION[theme][numeroSymbole];
  const extension = exception || EXTENSION_PAR_DEFAUT_PAR_THEME[theme];
  return `images/themes/${theme}/symbole-${numero}.${extension}`;
}
