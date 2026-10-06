// ===================================================================
// CLASSE THEME VISUEL
// Un thème visuel du jeu (ex: "medieval", "japon") : combien de symboles de
// cartes il a, dans quel format de fichier, et les quelques exceptions à ce
// format (des vraies images fournies au fur et à mesure, dans le format où
// elles ont été trouvées, plutôt que les placeholders ".svg" d'origine).
// ===================================================================
class ThemeVisuel {
  constructor(nom, nbSymboles, extensionParDefaut) {
    this.nom = nom;
    this.nbSymboles = nbSymboles;
    this.extensionParDefaut = extensionParDefaut;
    this.exceptions = []; // ajoutées avec ajouterException(), une par symbole hors format
  }

  // Enregistre qu'un symbole précis utilise un format différent de celui par
  // défaut du thème (voir les appels dans THEMES_VISUELS plus bas).
  ajouterException(numeroSymbole, extension) {
    this.exceptions.push({ numeroSymbole, extension });
  }

  // Cherche une extension spéciale pour ce symbole ; renvoie null si le
  // symbole suit le format par défaut du thème.
  chercherExtensionException(numeroSymbole) {
    for (let i = 0; i < this.exceptions.length; i++) {
      if (this.exceptions[i].numeroSymbole === numeroSymbole) {
        return this.exceptions[i].extension;
      }
    }
    return null;
  }

  // Chemin de l'image d'un symbole donné (1 à this.nbSymboles).
  cheminSymboleCarte(numeroSymbole) {
    const numero = String(numeroSymbole).padStart(2, "0");
    const extension = this.chercherExtensionException(numeroSymbole) || this.extensionParDefaut;
    return `images/themes/${this.nom}/symbole-${numero}.${extension}`;
  }

  // Nombre maximum de cartes jouables avec ce thème (2 cartes par symbole).
  nbCartesMax() {
    return this.nbSymboles * 2;
  }
}

// Un thème par identifiant, construit une fois pour toutes au chargement de
// la page. Tous ont 28 symboles placeholders (les 56 cartes maximum proposées
// dans le menu) ; certains n'ont encore que quelques vraies images, le reste
// étant des placeholders SVG en attendant (voir les exceptions plus bas).
const THEMES_VISUELS = {
  anime: new ThemeVisuel("anime", 28, "svg"),
  japon: new ThemeVisuel("japon", 28, "jpeg"),
  mediamatique: new ThemeVisuel("mediamatique", 28, "svg"),
  medieval: new ThemeVisuel("medieval", 28, "svg"),
  communaute: new ThemeVisuel("communaute", 28, "svg"),
  youtube: new ThemeVisuel("youtube", 28, "svg"),
};

THEMES_VISUELS.mediamatique.ajouterException(1, "png");
THEMES_VISUELS.mediamatique.ajouterException(2, "png");
THEMES_VISUELS.mediamatique.ajouterException(3, "png");
THEMES_VISUELS.mediamatique.ajouterException(4, "png");
THEMES_VISUELS.mediamatique.ajouterException(5, "png");
THEMES_VISUELS.mediamatique.ajouterException(6, "png");
THEMES_VISUELS.mediamatique.ajouterException(7, "png");
THEMES_VISUELS.mediamatique.ajouterException(8, "png");
THEMES_VISUELS.mediamatique.ajouterException(9, "png");
THEMES_VISUELS.mediamatique.ajouterException(10, "png");
THEMES_VISUELS.mediamatique.ajouterException(12, "png");

THEMES_VISUELS.anime.ajouterException(1, "png");
THEMES_VISUELS.anime.ajouterException(2, "jpg");
THEMES_VISUELS.anime.ajouterException(3, "webp");
THEMES_VISUELS.anime.ajouterException(4, "jpg");
THEMES_VISUELS.anime.ajouterException(5, "webp");
THEMES_VISUELS.anime.ajouterException(6, "webp");
THEMES_VISUELS.anime.ajouterException(7, "jpg");
THEMES_VISUELS.anime.ajouterException(8, "jpg");
THEMES_VISUELS.anime.ajouterException(9, "jpg");
THEMES_VISUELS.anime.ajouterException(10, "jpg");
THEMES_VISUELS.anime.ajouterException(11, "webp");
THEMES_VISUELS.anime.ajouterException(12, "webp");
THEMES_VISUELS.anime.ajouterException(13, "webp");
THEMES_VISUELS.anime.ajouterException(14, "jpg");
THEMES_VISUELS.anime.ajouterException(15, "jpg");
THEMES_VISUELS.anime.ajouterException(16, "jpg");
THEMES_VISUELS.anime.ajouterException(17, "jpg");
THEMES_VISUELS.anime.ajouterException(18, "jpg");
THEMES_VISUELS.anime.ajouterException(19, "jpg");
THEMES_VISUELS.anime.ajouterException(20, "webp");
THEMES_VISUELS.anime.ajouterException(21, "jpg");
THEMES_VISUELS.anime.ajouterException(22, "webp");
THEMES_VISUELS.anime.ajouterException(23, "webp");
THEMES_VISUELS.anime.ajouterException(24, "jpg");
THEMES_VISUELS.anime.ajouterException(25, "jpeg");
THEMES_VISUELS.anime.ajouterException(26, "webp");
THEMES_VISUELS.anime.ajouterException(27, "jpg");
THEMES_VISUELS.anime.ajouterException(28, "jpg");

THEMES_VISUELS.communaute.ajouterException(1, "jpg");
THEMES_VISUELS.communaute.ajouterException(2, "jpg");
THEMES_VISUELS.communaute.ajouterException(3, "png");
THEMES_VISUELS.communaute.ajouterException(4, "jpg");
THEMES_VISUELS.communaute.ajouterException(5, "jpg");
THEMES_VISUELS.communaute.ajouterException(6, "jpg");
THEMES_VISUELS.communaute.ajouterException(7, "JPG");
THEMES_VISUELS.communaute.ajouterException(8, "jpeg");
THEMES_VISUELS.communaute.ajouterException(9, "jpeg");
THEMES_VISUELS.communaute.ajouterException(10, "jpeg");
THEMES_VISUELS.communaute.ajouterException(11, "jpeg");
THEMES_VISUELS.communaute.ajouterException(12, "jpeg");
THEMES_VISUELS.communaute.ajouterException(13, "jpeg");
THEMES_VISUELS.communaute.ajouterException(14, "jpg");
THEMES_VISUELS.communaute.ajouterException(15, "jpeg");
THEMES_VISUELS.communaute.ajouterException(16, "jpg");
THEMES_VISUELS.communaute.ajouterException(17, "jpeg");
THEMES_VISUELS.communaute.ajouterException(18, "jpg");
THEMES_VISUELS.communaute.ajouterException(19, "jpg");
THEMES_VISUELS.communaute.ajouterException(20, "jpg");
THEMES_VISUELS.communaute.ajouterException(21, "jpg");
THEMES_VISUELS.communaute.ajouterException(22, "jpg");
THEMES_VISUELS.communaute.ajouterException(23, "jpg");
THEMES_VISUELS.communaute.ajouterException(24, "webp");
THEMES_VISUELS.communaute.ajouterException(25, "png");
THEMES_VISUELS.communaute.ajouterException(26, "jpg");
THEMES_VISUELS.communaute.ajouterException(27, "jpg");
THEMES_VISUELS.communaute.ajouterException(28, "webp");

THEMES_VISUELS.youtube.ajouterException(1, "png");
THEMES_VISUELS.youtube.ajouterException(2, "jpg");
THEMES_VISUELS.youtube.ajouterException(3, "jpg");
THEMES_VISUELS.youtube.ajouterException(4, "jpg");
THEMES_VISUELS.youtube.ajouterException(5, "jpg");
THEMES_VISUELS.youtube.ajouterException(6, "png");
THEMES_VISUELS.youtube.ajouterException(7, "jpg");
THEMES_VISUELS.youtube.ajouterException(8, "jpg");
THEMES_VISUELS.youtube.ajouterException(9, "jpg");
THEMES_VISUELS.youtube.ajouterException(10, "webp");
THEMES_VISUELS.youtube.ajouterException(11, "webp");
THEMES_VISUELS.youtube.ajouterException(12, "jpg");
THEMES_VISUELS.youtube.ajouterException(13, "webp");
THEMES_VISUELS.youtube.ajouterException(14, "png");
THEMES_VISUELS.youtube.ajouterException(15, "jpg");
THEMES_VISUELS.youtube.ajouterException(16, "jpg");
THEMES_VISUELS.youtube.ajouterException(17, "png");
THEMES_VISUELS.youtube.ajouterException(18, "jpg");
THEMES_VISUELS.youtube.ajouterException(19, "png");

const THEME_PAR_DEFAUT = "medieval";
