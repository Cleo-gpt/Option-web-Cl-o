// ===================================================================
// CLASSE MENU
// L'écran de configuration : la configuration choisie (thème, mode, nombre de
// joueurs, difficulté de l'ordinateur, nombre de cartes, difficulté du
// mélange) et la validation qui active ou non le bouton "Valider". Une seule
// instance globale, "menu" (voir plus bas), gère tout l'écran de menu.
// ===================================================================
class Menu {
  constructor() {
    this.theme = THEME_PAR_DEFAUT;
    this.mode = null;           // "solo" | "ordinateur" | "multi"
    this.nbJoueurs = 1;          // nombre de joueurs humains (1 si solo ou contre l'ordinateur)
    this.difficulteOrdi = null;  // "naze" | "moyen" | "fort" (uniquement en mode "ordinateur")
    this.nbCartes = 16;          // toujours un multiple de 4
    this.difficulte = "facile";  // "facile" | "moyen" | "difficile"
  }

  // Vérifie que chaque paramètre obligatoire a bien été choisi par le joueur
  // (mode, nombre de joueurs si multi, difficulté de l'ordi si mode
  // ordinateur, nombre de cartes, difficulté du mélange). Sert à la fois pour
  // activer/désactiver le bouton et comme sécurité au moment du clic.
  estComplet() {
    const modeChoisi = this.mode !== null;
    const nbJoueursOk = this.mode !== "multi" || document.querySelector("[data-joueurs].selectionne") !== null;
    const difficulteOrdiOk = this.mode !== "ordinateur" || document.querySelector("[data-difficulte-ordi].selectionne") !== null;
    const cartesChoisies = document.querySelector("[data-cartes].selectionne") !== null;
    const difficulteChoisie = document.querySelector("[data-difficulte].selectionne") !== null;

    return modeChoisi && nbJoueursOk && difficulteOrdiOk && cartesChoisies && difficulteChoisie;
  }

  // Affiche un petit résumé des choix et active le bouton "Valider" seulement
  // quand tout ce qui est obligatoire a été choisi.
  mettreAJourRecapMenu() {
    const pret = this.estComplet();
    boutonValiderMenu.disabled = !pret;

    if (pret) {
      let texteMode;
      if (this.mode === "multi") {
        texteMode = `${this.nbJoueurs} ${t("joueurs-mot")}`;
      } else if (this.mode === "ordinateur") {
        texteMode = `${t("contre-ordinateur")} (${t("ordi-" + this.difficulteOrdi).toLowerCase()})`;
      } else {
        texteMode = t("mode-solo");
      }
      recapMenu.textContent = `${t("theme-" + this.theme)} · ${texteMode} · ${this.nbCartes} ${t("cartes-mot")} · ${t("difficulte-mot")} ${t(this.difficulte).toLowerCase()}`;
    } else {
      recapMenu.textContent = "";
    }
  }

  // Certains thèmes ont moins de symboles disponibles que d'autres (voir
  // ThemeVisuel.nbCartesMax() dans theme-visuel.js) : leurs boutons "Nombre de
  // cartes" au-delà de cette limite sont désactivés. Le mode solo est en plus
  // toujours limité à 32 cartes (une partie à un seul joueur avec un trop
  // grand plateau devient longue et répétitive). Si le nombre de cartes déjà
  // choisi n'est plus disponible, on désélectionne ce bouton (le joueur doit
  // en choisir un autre valide).
  mettreAJourLimiteCartes() {
    const nbCartesMaxSolo = 32;
    const nbCartesMaxTheme = THEMES_VISUELS[this.theme].nbCartesMax();
    const nbCartesMax = this.mode === "solo" ? Math.min(nbCartesMaxSolo, nbCartesMaxTheme) : nbCartesMaxTheme;

    document.querySelectorAll("[data-cartes]").forEach((bouton) => {
      const nbCartesBouton = Number(bouton.dataset.cartes);
      const disponible = nbCartesBouton <= nbCartesMax;
      bouton.disabled = !disponible;

      if (!disponible && bouton.classList.contains("selectionne")) {
        bouton.classList.remove("selectionne");
        this.nbCartes = null;
      }
    });
  }
}

const menu = new Menu();
appliquerClassesBody(); // thème par défaut dès le chargement de la page

// ===================================================================
// ÉCRAN 1 : MENU DE CONFIGURATION
// Chaque groupe de boutons (thème, mode, joueurs, cartes, difficulté)
// fonctionne pareil : un clic sélectionne le bouton, désélectionne les autres
// du même groupe, et enregistre le choix dans "menu".
// ===================================================================

// Le thème "Animé / Pop culture" représente plusieurs univers à la fois : sa
// couleur d'accent (boutons, bordures) est tirée au hasard parmi 6 classes
// CSS (accent-anime-1 à accent-anime-6, voir style.css) à chaque sélection du
// thème, plutôt que de se fixer sur une seule teinte (qui finirait par
// rappeler un autre thème, comme le rose de Japon).
const NB_ACCENTS_ANIME = 6;

function choisirAccentAnimeAuHasard() {
  for (let i = 1; i <= NB_ACCENTS_ANIME; i++) {
    document.body.classList.remove(`accent-anime-${i}`);
  }
  const numeroChoisi = Math.floor(Math.random() * NB_ACCENTS_ANIME) + 1;
  document.body.classList.add(`accent-anime-${numeroChoisi}`);
}

// Choix du thème visuel : change immédiatement l'apparence de toute la page
// (fond, couleurs, police, dos de carte) pour un aperçu en direct, même avant
// de valider le reste de la configuration. "Médiamatique" est présélectionné
// par défaut (voir index.html et THEME_PAR_DEFAUT dans theme-visuel.js).
const boutonsTheme = document.querySelectorAll("[data-theme]");
boutonsTheme.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsTheme.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    menu.theme = bouton.dataset.theme;
    appliquerClassesBody();
    if (menu.theme === "anime") {
      choisirAccentAnimeAuHasard();
    }
    menu.mettreAJourLimiteCartes();
    menu.mettreAJourRecapMenu();
  });
});

// Choix du mode : solo, contre l'ordinateur, ou multijoueur.
// Le bloc "nombre de joueurs" ne s'affiche que si "multi" est choisi, le bloc
// "difficulté de l'ordinateur" seulement si "ordinateur" est choisi (le mode
// solo n'a besoin d'aucun des deux : un seul joueur humain, pas de robot).
const boutonsMode = document.querySelectorAll("[data-mode]");
boutonsMode.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsMode.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    menu.mode = bouton.dataset.mode;
    blocNbJoueurs.hidden = menu.mode !== "multi";
    blocDifficulteOrdi.hidden = menu.mode !== "ordinateur";

    if (menu.mode !== "multi") {
      menu.nbJoueurs = 1; // solo ou contre l'ordinateur : un seul joueur humain
    }
    if (menu.mode !== "ordinateur") {
      menu.difficulteOrdi = null;
    }
    menu.mettreAJourLimiteCartes();
    menu.mettreAJourRecapMenu();
  });
});

const boutonsJoueurs = document.querySelectorAll("[data-joueurs]");
boutonsJoueurs.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsJoueurs.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    menu.nbJoueurs = Number(bouton.dataset.joueurs);
    menu.mettreAJourRecapMenu();
  });
});

const boutonsDifficulteOrdi = document.querySelectorAll("[data-difficulte-ordi]");
boutonsDifficulteOrdi.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsDifficulteOrdi.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    menu.difficulteOrdi = bouton.dataset.difficulteOrdi;
    menu.mettreAJourRecapMenu();
  });
});

// Boutons 12 à 56 (pas de 4/8) : le nombre maximum de cartes proposé.
const boutonsCartes = document.querySelectorAll("[data-cartes]");
boutonsCartes.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsCartes.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    menu.nbCartes = Number(bouton.dataset.cartes);
    menu.mettreAJourRecapMenu();
  });
});

const boutonsDifficulte = document.querySelectorAll("[data-difficulte]");
boutonsDifficulte.forEach((bouton) => {
  bouton.addEventListener("click", () => {
    boutonsDifficulte.forEach((b) => b.classList.remove("selectionne"));
    bouton.classList.add("selectionne");

    menu.difficulte = bouton.dataset.difficulte;
    menu.mettreAJourRecapMenu();
  });
});

// Une fois la configuration validée, on crée la partie (cartes, joueurs) et
// on ouvre directement le livre fermé sur sa page de garde, avant que le plateau
// ne soit révélé.
// La vérification est refaite ici (en plus du bouton désactivé) : une sécurité
// pour ne jamais démarrer une partie si un paramètre n'a pas été choisi.
boutonValiderMenu.addEventListener("click", () => {
  if (!menu.estComplet()) return;

  partieActuelle = new Partie(menu.mode, menu.nbJoueurs, menu.difficulteOrdi, menu.theme, menu.nbCartes, menu.difficulte);
  changerEcran("jeu");
  livreDesRegles.ouvrirPremierAcces();
});

// Synchronise l'état du bouton dès le chargement de la page, plutôt que de se
// reposer uniquement sur l'attribut "disabled" écrit à la main dans le HTML.
menu.mettreAJourLimiteCartes();
menu.mettreAJourRecapMenu();
