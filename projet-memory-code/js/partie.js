// ===================================================================
// PRÉPARATION DE LA PARTIE
// Crée les joueurs, mélange les cartes et affiche le plateau de jeu, mais sans
// démarrer le chrono ni le tour : le plateau reste caché derrière le livre
// jusqu'à ce que le joueur ait répondu à la question des règles.
// ===================================================================
function preparerPartie() {
  creerJoueurs();
  etat.cartes = creerEtMelangerCartes(etat.nbCartes, etat.difficulte);
  etat.joueurActuelIndex = 0;
  etat.cartesRetournees = [];
  chronoDemarre = false;
  chronoAffichage.textContent = "00:00";

  afficherJoueurs();
  afficherCartes();
}

// Démarre réellement la partie (le tour), une fois le livre refermé.
// Le chrono, lui, ne démarre qu'au premier clic sur une carte (voir choisirCarte()).
function demarrerPartie() {
  demarrerTour();
}

// Construit la liste des joueurs : des humains, puis un robot si le mode "ordinateur" est choisi.
function creerJoueurs() {
  etat.joueurs = [];

  for (let i = 0; i < etat.nbJoueurs; i++) {
    etat.joueurs.push({
      numero: i + 1,          // le nom affiché ("Joueur 1", "Player 1"...) est composé avec t() à l'affichage
      classeCouleur: CLASSES_COULEUR_JOUEURS[i],
      coeurs: COEURS_DEPART,
      estRobot: false,
      pairesTrouvees: 0,      // pour les statistiques affichées à la fin de la partie
      sommeTempsPaires: 0,    // somme des secondes mises à trouver chaque paire (pour la moyenne)
    });
  }

  if (etat.mode === "ordinateur") {
    etat.joueurs.push({
      numero: null,
      classeCouleur: "joueur-robot",
      coeurs: COEURS_DEPART,
      estRobot: true,
      pairesTrouvees: 0,
      sommeTempsPaires: 0,
    });
  }
}

// Le nom affiché d'un joueur ("Joueur 1" / "Spieler 1" / "Player 1", ou le nom
// de l'ordinateur), toujours recalculé dans la langue actuelle.
function nomJoueur(joueur) {
  return joueur.estRobot ? t("ordinateur-mot") : `${t("joueur-mot")} ${joueur.numero}`;
}

// Crée les paires de cartes puis les mélange. La difficulté choisie change
// simplement le nombre de mélanges effectués : plus il y en a, plus l'ordre
// final est imprévisible.
function creerEtMelangerCartes(nbCartes, difficulte) {
  const nbPaires = nbCartes / 2;
  const symbolesUtilises = SYMBOLES.slice(0, nbPaires);

  // Chaque symbole apparaît deux fois (= une paire)
  let cartes = symbolesUtilises.concat(symbolesUtilises).map((symbole, index) => ({
    id: index,
    symbole: symbole,
    retournee: false,
    trouvee: false,
  }));

  const nbMelanges = { facile: 1, moyen: 4, difficile: 10 }[difficulte];
  for (let m = 0; m < nbMelanges; m++) {
    cartes = melangerUneFois(cartes);
  }

  return cartes;
}

// Mélange de Fisher-Yates : parcourt le tableau depuis la fin et échange
// chaque carte avec une autre choisie au hasard avant elle.
function melangerUneFois(cartes) {
  const resultat = cartes.slice();
  for (let i = resultat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultat[i], resultat[j]] = [resultat[j], resultat[i]];
  }
  return resultat;
}
