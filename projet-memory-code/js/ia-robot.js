// ===================================================================
// IA DU ROBOT (mode "contre l'ordinateur")
// Le robot a une mémoire des cartes déjà vues (les siennes et celles du joueur
// humain) et l'utilise plus ou moins selon la difficulté choisie dans le menu :
// - "naze"  : mémorise mais évite volontairement de jouer une paire connue.
// - "moyen" : joue parfois la paire connue, parfois au hasard (des feintes).
// - "fort"  : joue la paire connue dès que possible, sauf s'il écrase déjà
//             trop le joueur, auquel cas il rate volontairement un tour de
//             temps en temps pour garder la partie intéressante.
// ===================================================================

// symbole -> liste des ids de cartes vues avec ce symbole, encore cachées.
let memoireRobot = {};

// Remise à zéro de la mémoire à chaque nouvelle partie (voir preparerPartie() dans partie.js).
function reinitialiserMemoireRobot() {
  memoireRobot = {};
}

// Appelée à chaque carte retournée (par le joueur humain ou le robot lui-même) :
// le robot "voit" toujours les cartes retournées, comme un joueur humain le ferait.
function memoriserCartePourRobot(carte) {
  if (!memoireRobot[carte.numeroSymbole]) {
    memoireRobot[carte.numeroSymbole] = [];
  }
  if (!memoireRobot[carte.numeroSymbole].includes(carte.id)) {
    memoireRobot[carte.numeroSymbole].push(carte.id);
  }
}

// Cherche un symbole dont le robot connaît 2 cartes différentes, encore cachées
// et non trouvées. Retourne les 2 cartes si une paire connue existe, sinon null.
function chercherPaireConnue() {
  for (const symbole in memoireRobot) {
    const idsConnus = memoireRobot[symbole].filter((id) => {
      const carte = etat.cartes.find((c) => c.id === id);
      return carte && !carte.retournee && !carte.trouvee;
    });
    if (idsConnus.length >= 2) {
      const carteA = etat.cartes.find((c) => c.id === idsConnus[0]);
      const carteB = etat.cartes.find((c) => c.id === idsConnus[1]);
      return [carteA, carteB];
    }
  }
  return null;
}

// Tire une carte cachée au hasard, en excluant éventuellement une carte déjà choisie.
function carteAuHasard(carteAExclure) {
  const cartesDisponibles = etat.cartes.filter(
    (c) => !c.retournee && !c.trouvee && c !== carteAExclure
  );
  return cartesDisponibles[Math.floor(Math.random() * cartesDisponibles.length)];
}


// ===================================================================
// SUIVI DE LA PERFORMANCE DU JOUEUR HUMAIN
// Utilisé par le niveau "fort" pour savoir s'il écrase trop la partie.
// ===================================================================

// Le joueur humain de référence face au robot (mode "ordinateur" = un seul humain).
function joueurHumain() {
  return etat.joueurs.find((j) => !j.estRobot);
}

function joueurRobot() {
  return etat.joueurs.find((j) => j.estRobot);
}

// Écart de coeurs robot - humain : positif si le robot mène.
function ecartCoeursRobot() {
  return joueurRobot().coeurs - joueurHumain().coeurs;
}


// ===================================================================
// DÉCISION DE JEU DU ROBOT SELON LA DIFFICULTÉ
// ===================================================================

// Probabilité que le robot joue la paire connue plutôt qu'au hasard, si il en a une.
function probabiliteJouerPaireConnue() {
  if (etat.difficulteOrdi === "naze") {
    return 0; // ne joue jamais la paire connue : il perd naturellement
  }
  if (etat.difficulteOrdi === "moyen") {
    return 0.5; // une feinte sur deux
  }
  // "fort" : joue quasi toujours la paire connue, sauf s'il écrase déjà le
  // joueur humain (grand écart de coeurs en sa faveur) : il se retient alors
  // un tour sur trois pour laisser la partie ouverte.
  const ecrasement = ecartCoeursRobot() >= 4;
  return ecrasement ? 0.7 : 0.95;
}

// Choisit les 2 cartes que le robot va retourner ce tour-ci, selon sa mémoire
// et la difficulté choisie.
function choisirCartesRobot() {
  const paireConnue = chercherPaireConnue();

  if (paireConnue && Math.random() < probabiliteJouerPaireConnue()) {
    return paireConnue;
  }

  // Pas de paire connue exploitée : 2 cartes au hasard parmi les cachées
  // (c'est aussi ce qui fait "découvrir" nos propres cartes pour plus tard).
  const premiereCarte = carteAuHasard();
  const deuxiemeCarte = carteAuHasard(premiereCarte);
  return [premiereCarte, deuxiemeCarte];
}

// Le robot joue son tour : un court délai avant chaque clic pour rester lisible
// à l'écran, comme un joueur qui regarde le plateau avant de choisir.
function jouerTourRobot() {
  if (etat.scene !== "jeu") return;

  const [premiereCarte, deuxiemeCarte] = choisirCartesRobot();
  choisirCarte(premiereCarte.id);

  setTimeout(() => {
    if (etat.scene !== "jeu" || etat.enPause) return;
    choisirCarte(deuxiemeCarte.id);
  }, 600);
}
