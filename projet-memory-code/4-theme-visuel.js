// ===================================================================
// CLASSE THEME VISUEL
//
// Représente un thème visuel du jeu (ex: "mediamatique", "japon") : combien
// de symboles de cartes il a, et dans quel dossier aller chercher ses
// images. Toutes les images de tous les thèmes sont en PNG.
//
// Fichier : 4-theme-visuel.js (classe entière, + THEMES_VISUELS et
// THEME_PAR_DEFAUT juste en dessous).
// ===================================================================
class ThemeVisuel {
  constructor(nom, nbSymboles) {
    this.nom = nom;
    this.nbSymboles = nbSymboles;
  }

  // Chemin de l'image d'un symbole donné (1 à this.nbSymboles).
  cheminSymboleCarte(numeroSymbole) {
    const numero = String(numeroSymbole).padStart(2, "0");
    return `images/themes/${this.nom}/symbole-${numero}.png`;
  }

  // Nombre maximum de cartes jouables avec ce thème (2 cartes par symbole).
  nbCartesMax() {
    return this.nbSymboles * 2;
  }
}

// Un thème par identifiant, construit une fois pour toutes au chargement de
// la page. Tous ont 28 symboles.
const THEMES_VISUELS = {
  anime: new ThemeVisuel("anime", 28),
  japon: new ThemeVisuel("japon", 28),
  mediamatique: new ThemeVisuel("mediamatique", 28),
  communaute: new ThemeVisuel("communaute", 28),
  youtube: new ThemeVisuel("youtube", 28),
};

const THEME_PAR_DEFAUT = "mediamatique";
