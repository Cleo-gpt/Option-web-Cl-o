// ===================================================================
// CHRONOMÈTRE DE LA PARTIE (minutes : secondes)
// Démarre avec la partie et s'arrête à la victoire ou à la défaite finale.
// ===================================================================
let identifiantChrono = null;
let secondesEcoulees = 0;
let chronoDemarre = false; // devient true au premier clic sur une carte, jusqu'à la fin de la partie

function demarrerChrono() {
  chronoDemarre = true;
  secondesEcoulees = 0;
  chronoAffichage.textContent = "00:00";

  identifiantChrono = setInterval(() => {
    secondesEcoulees += 1;
    chronoAffichage.textContent = formaterTemps(secondesEcoulees);
  }, 1000);
}

function arreterChrono() {
  clearInterval(identifiantChrono);
}

// Reprend le chrono là où il en était, sans le remettre à zéro.
function reprendreChrono() {
  clearInterval(identifiantChrono);
  identifiantChrono = setInterval(() => {
    secondesEcoulees += 1;
    chronoAffichage.textContent = formaterTemps(secondesEcoulees);
  }, 1000);
}

// ===================================================================
// PAUSE (livre rouvert pendant la partie)
// Le chrono et le minuteur de tour s'arrêtent sans se réinitialiser ;
// choisirCarte() est aussi bloqué via etat.enPause.
// ===================================================================
function mettreEnPause() {
  etat.enPause = true;
  arreterChrono();
  clearInterval(identifiantMinuteurTour);
}

function reprendrePartie() {
  etat.enPause = false;
  // Le chrono ne reprend que s'il avait déjà démarré (le joueur a pu ouvrir
  // le livre en pause avant même d'avoir retourné sa première carte).
  if (chronoDemarre) {
    reprendreChrono();
  }
  lancerMinuteurTour();
}

// Transforme un nombre de secondes en texte "MM:SS".
function formaterTemps(totalSecondes) {
  const minutes = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
  const secondes = (totalSecondes % 60).toString().padStart(2, "0");
  return `${minutes}:${secondes}`;
}
