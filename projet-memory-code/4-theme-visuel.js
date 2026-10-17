// ===================================================================
// CLASSE THEME VISUEL
//
// Représente un thème visuel du jeu (ex: "mediamatique", "japon") : combien
// de symboles de cartes il a, et dans quel dossier aller chercher ses
// images. Toutes les images de tous les thèmes sont en PNG.
//
// Fichier : 4-theme-visuel.js (classe ThemeVisuel, + la classe
// CatalogueThemes et son instance globale "catalogueThemes" juste en
// dessous, qui porte THEMES_VISUELS et THEME_PAR_DEFAUT).
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

// ===================================================================
// CLASSE CATALOGUE THÈMES
//
// Porte l'ensemble des thèmes visuels disponibles (un par identifiant,
// tous à 28 symboles) et l'identifiant du thème choisi par défaut au
// chargement de la page. Une seule instance globale, "catalogueThemes".
// ===================================================================
class CatalogueThemes {
  constructor() {
    this.themes = {
      anime: new ThemeVisuel("anime", 28),
      japon: new ThemeVisuel("japon", 28),
      mediamatique: new ThemeVisuel("mediamatique", 28),
      communaute: new ThemeVisuel("communaute", 28),
      youtube: new ThemeVisuel("youtube", 28),
    };
    this.themeParDefaut = "mediamatique";
  }
}

const catalogueThemes = new CatalogueThemes();
