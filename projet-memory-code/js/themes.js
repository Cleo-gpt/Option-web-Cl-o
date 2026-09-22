// ===================================================================
// THÈMES VISUELS
// Chaque thème change le fond, les couleurs, la police (voir style.css, classes
// body.theme-<id>) et les images des cartes (dos + symboles). Ce fichier ne
// contient que la partie "données" : la liste des thèmes et le chemin de leurs
// images. Les couleurs/polices sont gérées entièrement en CSS.
//
// IMPORTANT : les images sont pour l'instant des espaces réservés générés
// automatiquement (voir images/themes/<id>/), à remplacer par les vraies
// images de chaque thème. Chaque thème prévoit jusqu'à 36 symboles (de quoi
// couvrir les 72 cartes proposées dans le menu).
// ===================================================================
const THEMES_VISUELS = ["anime", "japon", "mediamatique", "medieval", "communaute", "youtube"];
const THEME_PAR_DEFAUT = "medieval";

const NB_SYMBOLES_PAR_THEME = 36;

// Chemin de l'image de dos (face cachée, identique pour toutes les cartes d'un thème).
function cheminDosCarte(theme) {
  return `images/themes/${theme}/dos.svg`;
}

// Chemin de l'image d'un symbole donné (1 à NB_SYMBOLES_PAR_THEME) pour un thème.
function cheminSymboleCarte(theme, numeroSymbole) {
  const numero = String(numeroSymbole).padStart(2, "0");
  return `images/themes/${theme}/symbole-${numero}.svg`;
}
