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
};

const joueur = new Joueur();
joueur.sauter(); joueur.avancer(); console.log(joueur.y);

