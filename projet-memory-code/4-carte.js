// ===================================================================
// CLASSE CARTE
//
// Représente une carte de la grille : son identifiant, le symbole qu'elle
// porte (deux cartes partagent le même numeroSymbole = une paire), et si
// elle est actuellement retournée ou déjà trouvée.
//
// Fichier : 4-carte.js (classe entière).
// ===================================================================
class Carte {
  constructor(id, numeroSymbole) {
    this.id = id;
    this.numeroSymbole = numeroSymbole;
    this.retournee = false;
    this.trouvee = false;
    this.joueurTrouveurIndex = null; // index du joueur qui a formé cette paire (voir marquerTrouvee)
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

  // Marque la carte comme trouvée, et retient quel joueur l'a trouvée (pour
  // l'estomper en CSS quand ce n'est plus son tour, voir Partie.rafraichirCarte()).
  marquerTrouvee(joueurTrouveurIndex) {
    this.trouvee = true;
    this.joueurTrouveurIndex = joueurTrouveurIndex;
  }

  // Une carte est visible (son symbole se voit) si elle est retournée ou déjà trouvée.
  estVisible() {
    return this.retournee || this.trouvee;
  }
}
