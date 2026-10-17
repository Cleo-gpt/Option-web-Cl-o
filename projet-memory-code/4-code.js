// ===================================================================
// 🔴🔴🔴 ÉCART ATELIERS — séparer chaque classe dans son propre fichier
// n'a pas d'équivalent dans les ateliers du cours : leurs classes (Meule,
// Billet...) vivent toujours dans le même fichier que le reste de l'atelier
// (voir 2-MODIF.md, section "À partir de maintenant"). Écart assumé, demandé
// explicitement par l'utilisateur. 🔴🔴🔴
// ===================================================================


// ===================================================================
// MEMORY MULTIJOUEUR — LOGIQUE DU JEU
//
// Contient les classes qui n'ont pas leur propre fichier (BarreReglages,
// GestionnaireEcrans, AffichageFin — voir plus bas), les constantes
// partagées, et les éléments HTML récupérés une fois pour toutes. Les
// autres classes vivent chacune dans leur propre fichier, chargés juste
// avant celui-ci : 4-theme-visuel.js, 4-traducteur.js, 4-carte.js,
// 4-joueur.js, 4-partie.js, 4-menu.js, 4-livre-des-regles.js.
//
// Fichier : 4-code.js (fichier entier).
// ===================================================================


// ===================================================================
// CONSTANTES DU JEU
//
// "partieActuelle" pointe vers la partie en cours (ou null avant qu'une
// partie n'ait commencé) : existe en dehors de toute classe, car partagée
// par tout le code (l'écran actuellement affiché, lui, est la propriété
// gestionnaireEcrans.actuel, voir plus bas). Les autres constantes
// (couleurs des joueurs, coeurs de départ, durée d'un tour) sont des
// valeurs fixes du jeu, utilisées par plusieurs classes.
//
// Fichier : 4-code.js (ci-dessous) ; "partieActuelle" est une instance de la
// classe Partie (voir 4-partie.js), ces constantes sont lues depuis
// 4-partie.js et 4-menu.js.
// ===================================================================
let partieActuelle = null;

// Couleurs des lumières, dans l'ordre des joueurs (voir 6-style.css)
const CLASSES_COULEUR_JOUEURS = ["joueur-1", "joueur-2", "joueur-3", "joueur-4"];
const CLES_TRADUCTION_COULEURS = ["couleur-bleu", "couleur-vert", "couleur-rose", "couleur-jaune"];

const COEURS_DEPART = 10;
const TEMPS_TOUR = 45; // secondes laissées à chaque joueur pour retourner 2 cartes


// ===================================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
//
// Récupère une fois pour toutes les éléments qu'on va devoir modifier,
// plutôt que de refaire document.getElementById() à chaque fois.
//
// Fichier : 4-code.js (ci-dessous) ; les éléments correspondent aux ids
// déclarés dans 5-index.html.
// ===================================================================
const ecranMenu = document.getElementById("ecran-menu");
const ecranJeu = document.getElementById("ecran-jeu");
const ecranFin = document.getElementById("ecran-fin");

const blocNbJoueurs = document.getElementById("bloc-nb-joueurs");
const blocDifficulteOrdi = document.getElementById("bloc-difficulte-ordi");
const recapMenu = document.getElementById("recap-menu");
const boutonValiderMenu = document.getElementById("bouton-valider-menu");

const chronoAffichage = document.getElementById("chrono");
const tempsTourAffichage = document.getElementById("temps-tour");
const listeJoueurs = document.getElementById("liste-joueurs");
const pairesTrouvees = document.getElementById("paires-trouvees");
const grilleCartes = document.getElementById("grille-cartes");

const titreFin = document.getElementById("titre-fin");
const messageFin = document.getElementById("message-fin");
const statistiquesFin = document.getElementById("statistiques-fin");

// Éléments du livre des règles
const livre = document.getElementById("livre");
const couvertureLivre = document.getElementById("couverture-livre");
const pageQuestion = document.getElementById("page-question");
const pageBonneChance = document.getElementById("page-bonne-chance");
const pageRegles = document.getElementById("page-regles");
const boutonLancerPartie = document.getElementById("bouton-lancer-partie");
const languetteLivre = document.getElementById("languette-livre");


// ===================================================================
// CLASSE BARRE RÉGLAGES
//
// Cycle entre 3 niveaux de luminosité, combinés au thème visuel choisi dans
// le menu : <body> porte donc 2 classes en même temps, par exemple
// "theme-japon theme-jour" ("nuit" est la luminosité par défaut, sans
// classe). Une seule instance globale, "barreReglages", gère ce cycle.
//
// Fichier : 4-code.js (classe + instance + écoute du bouton 🌗
// ci-dessous) ; les couleurs de chaque combinaison sont définies en CSS
// dans 6-style.css (body.theme-<visuel>.theme-<luminosite>).
// ===================================================================
class BarreReglages {
  constructor(luminosites) {
    this.luminosites = luminosites;
    this.luminositeActuelleIndex = 0;
  }

  // Passe à la luminosité suivante (cycle nuit -> crepuscule -> jour -> nuit...).
  cyclerLuminosite() {
    this.luminositeActuelleIndex = (this.luminositeActuelleIndex + 1) % this.luminosites.length;
    this.appliquerClassesBody();
  }

  // Applique sur <body> la classe du thème visuel choisi (menu.theme) et
  // celle de la luminosité actuelle, sans effacer l'autre (contrairement à
  // une simple affectation de body.className).
  appliquerClassesBody() {
    this.luminosites.forEach((luminosite) => document.body.classList.remove(`theme-${luminosite}`));
    Object.keys(THEMES_VISUELS).forEach((theme) => document.body.classList.remove(`theme-${theme}`));

    document.body.classList.add(`theme-${menu.theme}`);
    const luminosite = this.luminosites[this.luminositeActuelleIndex];
    if (luminosite !== "nuit") {
      document.body.classList.add(`theme-${luminosite}`);
    }
  }
}

const barreReglages = new BarreReglages(["nuit", "crepuscule", "jour"]);

const boutonTheme = document.getElementById("bouton-theme");
boutonTheme.addEventListener("click", () => barreReglages.cyclerLuminosite());


// ===================================================================
// CLASSE GESTIONNAIRE ÉCRANS
//
// Affiche l'écran demandé (menu / jeu / fin) et cache tous les autres, pour
// n'en montrer qu'un à la fois. Une seule instance globale,
// "gestionnaireEcrans", retient quel écran est actuellement affiché
// (gestionnaireEcrans.actuel).
//
// Fichier : 4-code.js (classe + instance ci-dessous) ; méthode changer()
// appelée depuis 4-menu.js et 4-partie.js à chaque changement d'écran.
// ===================================================================
class GestionnaireEcrans {
  constructor() {
    this.actuel = "menu"; // "menu" | "jeu" | "fin"
  }

  changer(nom) {
    this.actuel = nom;
    ecranMenu.hidden = nom !== "menu";
    ecranJeu.hidden = nom !== "jeu";
    ecranFin.hidden = nom !== "fin";
  }
}

const gestionnaireEcrans = new GestionnaireEcrans();


// Transforme un nombre de secondes en texte "MM:SS".
function formaterTemps(totalSecondes) {
  const minutes = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
  const secondes = (totalSecondes % 60).toString().padStart(2, "0");
  return `${minutes}:${secondes}`;
}


// ===================================================================
// CLASSE AFFICHAGE FIN
//
// Affiche le titre, le message de fin et les statistiques de chaque joueur
// (paires trouvées, coeurs restants, temps moyens) sur l'écran de fin. Une
// seule instance globale, "affichageFin", gère cet affichage.
//
// Fichier : 4-code.js (classe + instance + écoute du bouton "Rejouer"
// ci-dessous) ; appelée depuis Partie.terminer() (voir 4-partie.js).
// ===================================================================
class AffichageFin {
  // Affiche le titre et le message de fin dans la langue actuelle. Appelée
  // à la fin de la partie, et de nouveau si la langue change pendant
  // l'écran de fin.
  afficherResultat() {
    if (partieActuelle.dernierResultat === "victoire") {
      titreFin.textContent = t("victoire-titre");
      messageFin.textContent = `${t("victoire-message")} ${formaterTemps(partieActuelle.secondesEcoulees)}.`;
    } else {
      titreFin.textContent = t("defaite-titre");
      messageFin.textContent = t("defaite-message");
    }
  }

  // Affiche, pour chaque joueur, ses paires trouvées, ses vies restantes, le
  // temps moyen mis pour trouver une paire, et le temps de réflexion moyen
  // réel entre le 1er et le 2e clic de chaque tour.
  afficherStatistiques() {
    statistiquesFin.innerHTML = "";

    partieActuelle.joueurs.forEach((joueur) => {
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
        <span class="nom-stat-fin">${joueur.nomAffiche()}</span>
        <span>${joueur.pairesTrouvees} ${t("paires-trouvees")}</span>
        <span>❤️ ${joueur.coeurs}</span>
        <span>${texteTempsMoyen}</span>
        <span>${texteTempsReflexion}</span>
      `;
      statistiquesFin.appendChild(ligne);
    });
  }
}

const affichageFin = new AffichageFin();

// Le bouton "Rejouer" ramène directement au menu pour choisir une nouvelle configuration.
document.getElementById("bouton-rejouer").addEventListener("click", () => {
  gestionnaireEcrans.changer("menu");
});
