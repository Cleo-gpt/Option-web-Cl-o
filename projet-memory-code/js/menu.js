// ===================================================================
// ÉCRAN 1 : MENU DE CONFIGURATION
// Chaque groupe de boutons (mode, joueurs, cartes, difficulté) fonctionne pareil :
// un clic sélectionne le bouton, désélectionne les autres du même groupe, et
// enregistre le choix dans "etat".
// ===================================================================

// Gère un groupe de boutons de choix (ex: les boutons de difficulté).
// "selecteur" cible les boutons du groupe, "surChoix" reçoit la valeur choisie.
function gererGroupeBoutons(selecteur, surChoix) {
  const boutons = document.querySelectorAll(selecteur);
  boutons.forEach((bouton) => {
    bouton.addEventListener("click", () => {
      boutons.forEach((b) => b.classList.remove("selectionne"));
      bouton.classList.add("selectionne");
      surChoix(bouton.dataset);
    });
  });
}

// Choix du mode : contre l'ordinateur ou multijoueur.
// Le bloc "nombre de joueurs" ne s'affiche que si "multi" est choisi.
gererGroupeBoutons("[data-mode]", (dataset) => {
  etat.mode = dataset.mode;
  if (etat.mode === "multi") {
    blocNbJoueurs.hidden = false;
  } else {
    blocNbJoueurs.hidden = true;
    etat.nbJoueurs = 1; // contre l'ordinateur : un seul joueur humain
  }
  mettreAJourRecapMenu();
});

gererGroupeBoutons("[data-joueurs]", (dataset) => {
  etat.nbJoueurs = Number(dataset.joueurs);
  mettreAJourRecapMenu();
});

// Les 4 boutons 12/16/20/24 et le curseur choisissent tous deux le même
// paramètre : choisir l'un désélectionne l'autre.
gererGroupeBoutons("[data-cartes]", (dataset) => {
  etat.nbCartes = Number(dataset.cartes);
  curseurCartes.classList.remove("selectionne");
  mettreAJourRecapMenu();
});

// Curseur 24 → 92 (pas de 4) : au-delà des 4 boutons.
const curseurCartes = document.getElementById("curseur-cartes");
const bulleCurseurCartes = document.getElementById("bulle-curseur-cartes");

// Déplace la bulle au-dessus de la poignée. La position en pourcentage de la
// piste (valeur - min) / (max - min) donne directement la position en % de la
// largeur du curseur, comme un thermomètre gradué de 0 à 100.
function deplacerBulleCurseurCartes() {
  const pourcentage = (curseurCartes.value - curseurCartes.min) / (curseurCartes.max - curseurCartes.min);
  bulleCurseurCartes.style.left = `${pourcentage * 100}%`;
  bulleCurseurCartes.textContent = curseurCartes.value;
}

curseurCartes.addEventListener("input", () => {
  etat.nbCartes = Number(curseurCartes.value);
  deplacerBulleCurseurCartes();
  curseurCartes.classList.add("selectionne");
  document.querySelectorAll("[data-cartes]").forEach((b) => b.classList.remove("selectionne"));
  mettreAJourRecapMenu();
});

deplacerBulleCurseurCartes(); // position initiale de la bulle, au chargement de la page

gererGroupeBoutons("[data-difficulte]", (dataset) => {
  etat.difficulte = dataset.difficulte;
  mettreAJourRecapMenu();
});

// Vérifie que chaque paramètre obligatoire a bien été choisi par le joueur
// (mode, nombre de joueurs si multi, nombre de cartes, difficulté). Sert à la
// fois pour activer/désactiver le bouton et comme sécurité au moment du clic.
function configurationComplete() {
  const modeChoisi = etat.mode !== null;
  const nbJoueursOk = etat.mode !== "multi" || document.querySelector("[data-joueurs].selectionne") !== null;
  const cartesChoisies = document.querySelector("[data-cartes].selectionne") !== null
    || curseurCartes.classList.contains("selectionne");
  const difficulteChoisie = document.querySelector("[data-difficulte].selectionne") !== null;

  return modeChoisi && nbJoueursOk && cartesChoisies && difficulteChoisie;
}

// Affiche un petit résumé des choix et active le bouton "Valider" seulement
// quand tout ce qui est obligatoire a été choisi.
function mettreAJourRecapMenu() {
  const pret = configurationComplete();
  boutonValiderMenu.disabled = !pret;

  if (pret) {
    const texteMode = etat.mode === "multi" ? `${etat.nbJoueurs} ${t("joueurs-mot")}` : t("contre-ordinateur");
    recapMenu.textContent = `${texteMode} · ${etat.nbCartes} ${t("cartes-mot")} · ${t("difficulte-mot")} ${t(etat.difficulte).toLowerCase()}`;
  } else {
    recapMenu.textContent = "";
  }
}

// Une fois la configuration validée, on prépare la partie (cartes, joueurs) et
// on ouvre directement le livre fermé sur sa page de garde, avant que le plateau
// ne soit révélé.
// La vérification est refaite ici (en plus du bouton désactivé) : une sécurité
// pour ne jamais démarrer une partie si un paramètre n'a pas été choisi.
boutonValiderMenu.addEventListener("click", () => {
  if (!configurationComplete()) return;

  preparerPartie();
  changerEcran("jeu");
  ouvrirLivrePremierAcces();
});

// Synchronise l'état du bouton dès le chargement de la page, plutôt que de se
// reposer uniquement sur l'attribut "disabled" écrit à la main dans le HTML.
mettreAJourRecapMenu();


// ===================================================================
// GESTION DES ÉCRANS
// Affiche l'écran demandé et cache tous les autres, pour n'en montrer qu'un à la fois.
// ===================================================================
function changerEcran(nom) {
  etat.scene = nom;
  ecranMenu.hidden = nom !== "menu";
  ecranJeu.hidden = nom !== "jeu";
  ecranFin.hidden = nom !== "fin";
}
