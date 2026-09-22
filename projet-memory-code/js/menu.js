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

// Le thème "Animé / Pop culture" représente plusieurs univers à la fois : sa
// couleur d'accent (boutons, bordures) est tirée au hasard parmi ces teintes
// vives à chaque sélection du thème, plutôt que de se fixer sur une seule
// (qui finirait par rappeler un autre thème, comme le rose de Japon).
const ACCENTS_ANIME_POSSIBLES = ["#4fd3ff", "#6bffb0", "#ffe14d", "#ff9142", "#b06bff", "#ff4f9a"];

function choisirAccentAnimeAuHasard() {
  const accent = ACCENTS_ANIME_POSSIBLES[Math.floor(Math.random() * ACCENTS_ANIME_POSSIBLES.length)];
  document.body.style.setProperty("--accent", accent);
}

// Choix du thème visuel : change immédiatement l'apparence de toute la page
// (fond, couleurs, police, dos de carte) pour un aperçu en direct, même avant
// de valider le reste de la configuration. "Médiéval" est présélectionné par
// défaut (voir index.html et THEME_PAR_DEFAUT dans js/themes.js).
gererGroupeBoutons("[data-theme]", (dataset) => {
  etat.theme = dataset.theme;
  document.body.style.removeProperty("--accent"); // reprend la valeur par défaut du thème choisi
  appliquerClassesBody();
  if (etat.theme === "anime") {
    choisirAccentAnimeAuHasard();
  }
  mettreAJourLimiteCartes();
  mettreAJourRecapMenu();
});

// Certains thèmes ont moins de 36 symboles disponibles (voir
// NB_SYMBOLES_PAR_THEME dans js/themes.js) : leurs boutons "Nombre de cartes"
// au-delà de 2× ce nombre de symboles sont désactivés. Si le nombre de cartes
// déjà choisi n'est plus disponible pour le nouveau thème, on désélectionne
// ce bouton (le joueur doit en choisir un autre valide).
function mettreAJourLimiteCartes() {
  const nbCartesMax = NB_SYMBOLES_PAR_THEME[etat.theme] * 2;

  document.querySelectorAll("[data-cartes]").forEach((bouton) => {
    const nbCartesBouton = Number(bouton.dataset.cartes);
    const disponible = nbCartesBouton <= nbCartesMax;
    bouton.disabled = !disponible;

    if (!disponible && bouton.classList.contains("selectionne")) {
      bouton.classList.remove("selectionne");
      etat.nbCartes = null;
    }
  });
}

// Choix du mode : solo, contre l'ordinateur, ou multijoueur.
// Le bloc "nombre de joueurs" ne s'affiche que si "multi" est choisi, le bloc
// "difficulté de l'ordinateur" seulement si "ordinateur" est choisi (le mode
// solo n'a besoin d'aucun des deux : un seul joueur humain, pas de robot).
gererGroupeBoutons("[data-mode]", (dataset) => {
  etat.mode = dataset.mode;
  blocNbJoueurs.hidden = etat.mode !== "multi";
  blocDifficulteOrdi.hidden = etat.mode !== "ordinateur";

  if (etat.mode !== "multi") {
    etat.nbJoueurs = 1; // solo ou contre l'ordinateur : un seul joueur humain
  }
  if (etat.mode !== "ordinateur") {
    etat.difficulteOrdi = null;
  }
  mettreAJourRecapMenu();
});

gererGroupeBoutons("[data-joueurs]", (dataset) => {
  etat.nbJoueurs = Number(dataset.joueurs);
  mettreAJourRecapMenu();
});

gererGroupeBoutons("[data-difficulte-ordi]", (dataset) => {
  etat.difficulteOrdi = dataset.difficulteOrdi;
  mettreAJourRecapMenu();
});

// Boutons 12 à 72 (pas de 4/8) : le nombre maximum de cartes proposé.
gererGroupeBoutons("[data-cartes]", (dataset) => {
  etat.nbCartes = Number(dataset.cartes);
  mettreAJourRecapMenu();
});

gererGroupeBoutons("[data-difficulte]", (dataset) => {
  etat.difficulte = dataset.difficulte;
  mettreAJourRecapMenu();
});

// Vérifie que chaque paramètre obligatoire a bien été choisi par le joueur
// (mode, nombre de joueurs si multi, difficulté de l'ordi si mode ordinateur,
// nombre de cartes, difficulté du mélange). Sert à la fois pour activer/désactiver
// le bouton et comme sécurité au moment du clic.
function configurationComplete() {
  const modeChoisi = etat.mode !== null;
  const nbJoueursOk = etat.mode !== "multi" || document.querySelector("[data-joueurs].selectionne") !== null;
  const difficulteOrdiOk = etat.mode !== "ordinateur" || document.querySelector("[data-difficulte-ordi].selectionne") !== null;
  const cartesChoisies = document.querySelector("[data-cartes].selectionne") !== null;
  const difficulteChoisie = document.querySelector("[data-difficulte].selectionne") !== null;

  return modeChoisi && nbJoueursOk && difficulteOrdiOk && cartesChoisies && difficulteChoisie;
}

// Affiche un petit résumé des choix et active le bouton "Valider" seulement
// quand tout ce qui est obligatoire a été choisi.
function mettreAJourRecapMenu() {
  const pret = configurationComplete();
  boutonValiderMenu.disabled = !pret;

  if (pret) {
    let texteMode;
    if (etat.mode === "multi") {
      texteMode = `${etat.nbJoueurs} ${t("joueurs-mot")}`;
    } else if (etat.mode === "ordinateur") {
      texteMode = `${t("contre-ordinateur")} (${t("ordi-" + etat.difficulteOrdi).toLowerCase()})`;
    } else {
      texteMode = t("mode-solo");
    }
    recapMenu.textContent = `${t("theme-" + etat.theme)} · ${texteMode} · ${etat.nbCartes} ${t("cartes-mot")} · ${t("difficulte-mot")} ${t(etat.difficulte).toLowerCase()}`;
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
mettreAJourLimiteCartes();
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
