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
