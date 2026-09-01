const etat = { scene: "menu" };
const SAUTS_AVANT_FIN = 3;
let sauts = 0;
const bouton = document.getElementById("action");
const etiquette = document.getElementById("etat");
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

  if (etat.scene === "over") {
    /* over → rejouer : remettre la scène sur "jeu" */
    joueur.reinitialiser();
    changerScene("jeu");
    sauts = 0;
    return;
  }

  /* ajouter la classe "saute" à #joueur */
  document.getElementById("joueur").classList.add("saute");
  setTimeout(() => {
    /* retirer la classe "saute" après 180ms */
    document.getElementById("joueur").classList.remove("saute");
  }, 180);

  sauts += 1;
  if (sauts >= SAUTS_AVANT_FIN) {
    changerScene("over");
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
  bouton.textContent = etat.scene === "over" ? "Rejouer" : "Agir";
}

class Joueur {
constructor() {
this.y = 220;
this.vitesseY = 0;
}
sauter() {
this.vitesseY = -10;
}
avancer() {
this.vitesseY += 0.5;
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
const hauteurDuSol = 300;

function mettreAJour() {
  if (etat.scene !== "jeu") return;
  joueur.avancer();
  if (joueur.estPerdu(hauteurDuSol)) {
    changerScene("over");
  }
}

function confirmerSaut() {
scene.classList.add("retour-saut");
setTimeout(() => {
/* à vous : retirer la classe retour-saut */
scene.classList.remove("retour-saut");
}, 180);
joueur.sauter();
}