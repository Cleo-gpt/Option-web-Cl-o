// ===================================================================
// TOUR DE JEU
// Un tour = un joueur retourne 2 cartes (ou le temps s'écoule).
// ===================================================================
let identifiantMinuteurTour = null;
let secondesRestantesTour = TEMPS_TOUR;
let secondesDebutTourJoueur = 0; // valeur du chrono au début du tour en cours, pour mesurer le temps mis à trouver une paire

function demarrerTour() {
  etat.cartesRetournees = [];
  allumerLumiereJoueurActuel();

  secondesRestantesTour = TEMPS_TOUR;
  tempsTourAffichage.textContent = `${secondesRestantesTour}s`;
  secondesDebutTourJoueur = secondesEcoulees;

  lancerMinuteurTour();

  // Si c'est le tour de l'ordinateur, il joue automatiquement après un court délai.
  const joueurActuel = etat.joueurs[etat.joueurActuelIndex];
  if (joueurActuel.estRobot) {
    setTimeout(() => {
      if (!etat.enPause) jouerTourRobot();
    }, 800);
  }
}

// Démarre le décompte du tour à partir de la valeur actuelle de "secondesRestantesTour"
// (utilisé au début d'un tour, mais aussi pour reprendre après une pause).
function lancerMinuteurTour() {
  clearInterval(identifiantMinuteurTour);
  identifiantMinuteurTour = setInterval(() => {
    secondesRestantesTour -= 1;
    tempsTourAffichage.textContent = `${secondesRestantesTour}s`;

    if (secondesRestantesTour <= 0) {
      // Le temps est écoulé : le joueur n'a pas terminé son tour, il perd un coeur.
      clearInterval(identifiantMinuteurTour);
      perdreCoeurJoueurActuel();
      passerAuJoueurSuivant();
    }
  }, 1000);
}

// Le joueur (ou le robot) clique sur une carte pour la retourner.
function choisirCarte(idCarte) {
  if (etat.enPause) return; // le livre est ouvert : le plateau est bloqué
  if (etat.paireEnAttente) return; // on attend que la paire précédente soit masquée

  const carte = etat.cartes.find((c) => c.id === idCarte);
  if (carte.retournee || carte.trouvee) return; // carte déjà visible : rien à faire
  if (etat.cartesRetournees.length >= 2) return; // déjà 2 cartes retournées ce tour-ci

  // Le chrono de la partie démarre seulement au tout premier clic sur une carte.
  if (!chronoDemarre) {
    demarrerChrono();
  }

  carte.retournee = true;
  rafraichirCarte(carte);
  etat.cartesRetournees.push(carte);

  if (etat.cartesRetournees.length === 2) {
    verifierPaire();
  }
}

// Compare les deux cartes retournées : paire trouvée (+1 coeur) ou erreur (-1 coeur).
function verifierPaire() {
  clearInterval(identifiantMinuteurTour);
  etat.paireEnAttente = true;

  const [carteA, carteB] = etat.cartesRetournees;
  const estUnePaire = carteA.symbole === carteB.symbole;

  setTimeout(() => {
    if (estUnePaire) {
      carteA.trouvee = true;
      carteB.trouvee = true;
      gagnerCoeurJoueurActuel();
    } else {
      carteA.retournee = false;
      carteB.retournee = false;
      perdreCoeurJoueurActuel();
    }
    rafraichirCarte(carteA);
    rafraichirCarte(carteB);
    etat.paireEnAttente = false;

    if (toutesLesPairesTrouvees()) {
      terminerPartie("victoire");
      return;
    }

    // En cas de paire trouvée, le même joueur rejoue ; sinon on passe au suivant.
    if (estUnePaire) {
      demarrerTour();
    } else {
      passerAuJoueurSuivant();
    }
  }, 800);
}

function toutesLesPairesTrouvees() {
  return etat.cartes.every((carte) => carte.trouvee);
}

function gagnerCoeurJoueurActuel() {
  const joueur = etat.joueurs[etat.joueurActuelIndex];
  joueur.coeurs += 1;
  afficherCoeurs(etat.joueurActuelIndex);

  // Statistiques pour l'écran de fin : une paire de plus, et le temps mis
  // pour la trouver (depuis le début de ce tour) vient allonger la moyenne.
  joueur.pairesTrouvees += 1;
  joueur.sommeTempsPaires += secondesEcoulees - secondesDebutTourJoueur;
}

// Fait perdre un coeur au joueur actuel et vérifie s'il est éliminé.
function perdreCoeurJoueurActuel() {
  const joueur = etat.joueurs[etat.joueurActuelIndex];
  joueur.coeurs = Math.max(0, joueur.coeurs - 1);
  afficherCoeurs(etat.joueurActuelIndex);

  if (joueur.coeurs === 0 && plusAucunJoueurEnVie()) {
    terminerPartie("defaite");
  }
}

function plusAucunJoueurEnVie() {
  return etat.joueurs.every((joueur) => joueur.coeurs <= 0);
}

// Passe la main au prochain joueur encore en vie.
function passerAuJoueurSuivant() {
  if (etat.scene !== "jeu") return; // la partie est peut-être déjà terminée

  do {
    etat.joueurActuelIndex = (etat.joueurActuelIndex + 1) % etat.joueurs.length;
  } while (etat.joueurs[etat.joueurActuelIndex].coeurs <= 0);

  demarrerTour();
}

// Le robot choisit simplement deux cartes cachées au hasard.
function jouerTourRobot() {
  if (etat.scene !== "jeu") return;

  const cartesDisponibles = etat.cartes.filter((c) => !c.retournee && !c.trouvee);
  const premiereCarte = cartesDisponibles[Math.floor(Math.random() * cartesDisponibles.length)];
  choisirCarte(premiereCarte.id);

  setTimeout(() => {
    const cartesRestantes = etat.cartes.filter((c) => !c.retournee && !c.trouvee);
    const deuxiemeCarte = cartesRestantes[Math.floor(Math.random() * cartesRestantes.length)];
    choisirCarte(deuxiemeCarte.id);
  }, 600);
}
