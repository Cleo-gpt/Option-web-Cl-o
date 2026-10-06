// ===================================================================
// CLASSE JOUEUR
//
// Représente un joueur humain ou le robot : ses coeurs, sa couleur, et les
// statistiques accumulées pendant la partie (paires trouvées, temps de
// réflexion, erreurs).
//
// Fichier : joueur.js (classe entière).
// ===================================================================
class Joueur {
  constructor(numero, classeCouleur, estRobot) {
    this.numero = numero;             // le nom affiché ("Joueur 1"...) est composé avec nomAffiche()
    this.classeCouleur = classeCouleur;
    this.estRobot = estRobot;
    this.coeurs = COEURS_DEPART;
    this.pairesTrouvees = 0;          // pour les statistiques affichées à la fin de la partie
    this.sommeTempsPaires = 0;        // somme des secondes mises à trouver chaque paire (pour la moyenne)
    this.sommeTempsReflexion = 0;     // somme des secondes entre le 1er et le 2e clic de chaque tour joué
    this.nbToursJoues = 0;            // nombre de tours où les 2 cartes ont été retournées (pour la moyenne de réflexion)
    this.erreurs = 0;                 // nombre de paires ratées, utilisé par l'IA pour évaluer le niveau du joueur humain
  }

  // Le nom affiché ("Joueur 1" / "Spieler 1" / "Player 1", ou le nom de
  // l'ordinateur), toujours recalculé dans la langue actuelle.
  nomAffiche() {
    return this.estRobot ? t("ordinateur-mot") : `${t("joueur-mot")} ${this.numero}`;
  }

  estElimine() {
    return this.coeurs <= 0;
  }

  gagnerCoeur() {
    this.coeurs += 1;
  }

  // Fait perdre un coeur, sans jamais descendre sous 0.
  perdreCoeur() {
    this.coeurs = Math.max(0, this.coeurs - 1);
    this.erreurs += 1;
  }

  // Une paire de plus, et le temps mis pour la trouver (donné par l'appelant,
  // qui connaît le chrono de la partie) vient allonger la moyenne.
  gagnerPaire(secondesDepuisDebutTour) {
    this.pairesTrouvees += 1;
    this.sommeTempsPaires += secondesDepuisDebutTour;
  }

  // Ajoute une mesure de temps de réflexion (entre le 1er et le 2e clic),
  // utilisée pour calculer sa moyenne à l'écran de fin.
  enregistrerTempsReflexion(secondes) {
    this.sommeTempsReflexion += secondes;
    this.nbToursJoues += 1;
  }
}
