const etat = { scene: "menu" };
const SAUTS_AVANT_FIN = 3;
let sauts = 0;
const bouton = document.getElementById("action");
const etiquette = document.getElementById("etat");
bouton.addEventListener("click", () => {
actionDuBouton();
etiquette.textContent = `État : ${etat.scene}`;
});
function actionDuBouton(clickevent) {
  if (etat.scene === "menu") {
    /* passer à l'état "jeu" */
    etat.scene = "jeu";
    bouton.textContent = "Agir";
    return;
  }

  if (etat.scene === "over") {
    /* over → rejouer : remettre la scène sur "jeu" */
    etat.scene = "jeu";
    sauts = 0;
    bouton.textContent = "Agir";
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
    etat.scene = "over";
    bouton.textContent = "Rejouer";
  }
}
