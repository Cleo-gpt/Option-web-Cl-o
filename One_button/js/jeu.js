const etat = { scene: "menu" };
const SAUTS_AVANT_FIN = 3;
let sauts = 0;
let score = 0;
const bouton = document.getElementById("action");
const etiquette = document.getElementById("etat");
const panneauFin = document.getElementById("panneau-fin");
const panneauTitre = document.getElementById("panneau-titre");
const panneauScoreValeur = document.getElementById("panneau-score-valeur");
const infoNiveau = document.getElementById("info-niveau");
const infoScore = document.getElementById("info-score");
bouton.addEventListener("click", () => {
actionDuBouton(changerScene);
etiquette.textContent = `État : ${etat.scene}`;
});

function actionDuBouton(changerScene) {
  if (etat.scene === "menu") {
    /* passer à l'état "jeu" */
    changerScene("jeu");
    return;
  }

  if (etat.scene === "over" || etat.scene === "victoire") {
    /* over/victoire → rejouer : remettre la scène sur "jeu" */
    niveauActuel = 0;
    score = 0;
    infoScore.textContent = score;
    joueur.reinitialiser();
    changerScene("jeu");
    sauts = 0;
    return;
  }

  /* ajouter la classe "saute" à #joueur */
  document.getElementById("joueur").classList.add("saute");
  joueur.sauter();
  confirmerSaut();
  setTimeout(() => {
    /* retirer la classe "saute" après 180ms */
    document.getElementById("joueur").classList.remove("saute");
  }, 180);

  sauts += 1;
  score += 1;
  infoScore.textContent = score;
  if (sauts >= SAUTS_AVANT_FIN) {
    niveauSuivant();
  }
}

function niveauSuivant() {
  if (niveauActuel < niveaux.length - 1) {
    niveauActuel += 1;
    sauts = 0;
    joueur.reinitialiser();
    changerScene("jeu");
  } else {
    changerScene("victoire");
  }
}

document.addEventListener("keydown", (evenement) => {
  if (evenement.key !== "Escape") return;
  if (etat.scene === "jeu") {
    changerScene("pause");
  } else if (etat.scene === "pause") {
    changerScene("jeu");
  }
});

function changerScene(prochaineScene) {
  etat.scene = prochaineScene;
  etiquette.textContent = `État : ${etat.scene}`;
  bouton.textContent = etat.scene === "over" || etat.scene === "victoire" ? "Rejouer" : "Agir";
  if (etat.scene === "over") {
    panneauTitre.textContent = "Partie terminée";
    panneauScoreValeur.textContent = score;
    panneauFin.hidden = false;
  } else if (etat.scene === "victoire") {
    panneauTitre.textContent = "Victoire !";
    panneauScoreValeur.textContent = score;
    panneauFin.hidden = false;
  } else {
    panneauFin.hidden = true;
  }
  if (etat.scene === "jeu" && sauts === 0) {
    infoNiveau.textContent = niveauActuel + 1;
  }
}

class Joueur {
constructor() {
this.y = 220;
this.vitesseY = 0;
}
sauter() {
this.vitesseY = -10;
}
avancer(vitesse) {
this.vitesseY += vitesse;
this.y += this.vitesseY;
}
estPerdu(limite) {
  return this.y > limite;
}
reinitialiser() {
  this.y = 220;
  this.vitesseY = 0;
}
}


const joueur = new Joueur();

const niveaux = [
  { vitesse: 2, limite: 320 },
  { vitesse: 3, limite: 300 },
  { vitesse: 4, limite: 280 }
];
let niveauActuel = 0;

function mettreAJour() {
  if (etat.scene !== "jeu") return;
  const niveau = niveaux[niveauActuel];
  joueur.avancer(niveau.vitesse);
  if (joueur.estPerdu(niveau.limite)) {
    changerScene("over");
  }
}

function confirmerSaut() {
scene.classList.add("retour-saut");
setTimeout(() => {
/* à vous : retirer la classe retour-saut */
scene.classList.remove("retour-saut");
}, 180);
}

const scene = document.getElementById("scene");