// ===================================================================
// FIN DE PARTIE
// ===================================================================
let dernierResultatPartie = null; // mémorisé pour pouvoir retraduire l'écran de fin si la langue change

function terminerPartie(resultat) {
  arreterChrono();
  clearInterval(identifiantMinuteurTour);
  languetteLivre.hidden = true;

  dernierResultatPartie = resultat;
  afficherResultatFin();
  afficherStatistiquesFin();
  changerEcran("fin");
}

// Affiche le titre et le message de fin dans la langue actuelle. Appelée à la
// fin de la partie, et de nouveau si la langue change pendant l'écran de fin.
function afficherResultatFin() {
  if (dernierResultatPartie === "victoire") {
    titreFin.textContent = t("victoire-titre");
    messageFin.textContent = `${t("victoire-message")} ${formaterTemps(secondesEcoulees)}.`;
  } else {
    titreFin.textContent = t("defaite-titre");
    messageFin.textContent = t("defaite-message");
  }
}

// Affiche, pour chaque joueur, ses paires trouvées, ses vies restantes, le
// temps moyen mis pour trouver une paire, et le temps de réflexion moyen réel
// entre le 1er et le 2e clic de chaque tour (mesuré en millisecondes puis
// arrondi à la seconde, voir enregistrerTempsReflexion() dans tour-de-jeu.js).
function afficherStatistiquesFin() {
  statistiquesFin.innerHTML = "";

  etat.joueurs.forEach((joueur) => {
    const tempsMoyen = joueur.pairesTrouvees > 0
      ? Math.round(joueur.sommeTempsPaires / joueur.pairesTrouvees)
      : null;
    const texteTempsMoyen = tempsMoyen !== null ? `${tempsMoyen}${t("temps-moyen-paire")}` : t("aucune-paire");

    const tempsReflexionMoyen = joueur.nbToursJoues > 0
      ? (joueur.sommeTempsReflexion / joueur.nbToursJoues).toFixed(1)
      : null;
    const texteTempsReflexion = tempsReflexionMoyen !== null
      ? `${tempsReflexionMoyen}${t("temps-reflexion-moyen")}`
      : t("aucun-temps-reflexion");

    const ligne = document.createElement("div");
    ligne.className = `ligne-stat-fin ${joueur.classeCouleur}`;
    ligne.innerHTML = `
      <span class="lumiere"></span>
      <span class="nom-stat-fin">${nomJoueur(joueur)}</span>
      <span>${joueur.pairesTrouvees} ${t("paires-trouvees")}</span>
      <span>❤️ ${joueur.coeurs}</span>
      <span>${texteTempsMoyen}</span>
      <span>${texteTempsReflexion}</span>
    `;
    statistiquesFin.appendChild(ligne);
  });
}

// Le bouton "Rejouer" ramène directement au menu pour choisir une nouvelle configuration.
document.getElementById("bouton-rejouer").addEventListener("click", () => {
  changerEcran("menu");
});
