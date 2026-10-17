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
// CLASSE ÉTAT PARTIE
//
// Porte les deux vraies variables globales du jeu : "partieActuelle" (la
// partie en train d'être jouée, ou null avant qu'une partie n'ait
// commencé) et "serieActuelle" (la série de plusieurs parties en cours,
// ou null en solo ou avant qu'une partie n'ait commencé — voir
// SerieParties dans 4-serie-parties.js). Une classe sans méthode : elle
// existe quand même pour que même ces données partagées soient portées
// par une instance plutôt que des variables libres (l'écran actuellement
// affiché, lui, est gestionnaireEcrans.actuel, voir plus bas).
//
// Fichier : 4-code.js (classe + instance globale "etatPartie" ci-dessous) ;
// lue et écrite depuis 4-partie.js, 4-menu.js et 4-serie-parties.js.
// ===================================================================
class EtatPartie {
  constructor() {
    this.partieActuelle = null;
    this.serieActuelle = null;
  }
}

const etatPartie = new EtatPartie();


// ===================================================================
// CLASSE CONSTANTES JEU
//
// Porte les valeurs fixes du jeu, utilisées par plusieurs classes :
// couleurs des lumières des joueurs, coeurs de départ, durée d'un tour.
// Une seule instance globale, "constantesJeu".
//
// Fichier : 4-code.js (classe + instance ci-dessous) ; lue depuis
// 4-partie.js, 4-menu.js et 4-joueur.js.
// ===================================================================
class ConstantesJeu {
  constructor() {
    // Couleurs des lumières, dans l'ordre des joueurs (voir 6-style.css)
    this.classesCouleurJoueurs = ["joueur-1", "joueur-2", "joueur-3", "joueur-4"];
    this.clesTraductionCouleurs = ["couleur-bleu", "couleur-vert", "couleur-rose", "couleur-jaune"];

    this.coeursDepart = 10;
    this.tempsTour = 45; // secondes laissées à chaque joueur pour retourner 2 cartes
  }
}

const constantesJeu = new ConstantesJeu();


// ===================================================================
// CLASSE ÉLÉMENTS HTML
//
// Récupère une fois pour toutes les éléments qu'on va devoir modifier,
// plutôt que de refaire document.getElementById() à chaque fois. Une seule
// instance globale, "elementsHTML", porte toutes ces références.
//
// Fichier : 4-code.js (classe + instance ci-dessous) ; les éléments
// correspondent aux ids déclarés dans 5-index.html.
// ===================================================================
class ElementsHTML {
  constructor() {
    this.boutonLangue = document.getElementById("bouton-langue");

    this.ecranMenu = document.getElementById("ecran-menu");
    this.ecranJeu = document.getElementById("ecran-jeu");
    this.ecranFin = document.getElementById("ecran-fin");

    this.blocNbJoueurs = document.getElementById("bloc-nb-joueurs");
    this.blocDifficulteOrdi = document.getElementById("bloc-difficulte-ordi");
    this.blocNbParties = document.getElementById("bloc-nb-parties");
    this.recapMenu = document.getElementById("recap-menu");
    this.boutonValiderMenu = document.getElementById("bouton-valider-menu");

    this.chronoAffichage = document.getElementById("chrono");
    this.tempsTourAffichage = document.getElementById("temps-tour");
    this.listeJoueurs = document.getElementById("liste-joueurs");
    this.pairesTrouvees = document.getElementById("paires-trouvees");
    this.grilleCartes = document.getElementById("grille-cartes");

    this.titreFin = document.getElementById("titre-fin");
    this.messageFin = document.getElementById("message-fin");
    this.statistiquesFin = document.getElementById("statistiques-fin");

    // Éléments du livre des règles
    this.livre = document.getElementById("livre");
    this.couvertureLivre = document.getElementById("couverture-livre");
    this.pageQuestion = document.getElementById("page-question");
    this.pageBonneChance = document.getElementById("page-bonne-chance");
    this.pageRegles = document.getElementById("page-regles");
    this.boutonLancerPartie = document.getElementById("bouton-lancer-partie");
    this.languetteLivre = document.getElementById("languette-livre");
  }
}

const elementsHTML = new ElementsHTML();


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
    Object.keys(catalogueThemes.themes).forEach((theme) => document.body.classList.remove(`theme-${theme}`));

    document.body.classList.add(`theme-${menu.theme}`);
    const luminosite = this.luminosites[this.luminositeActuelleIndex];
    if (luminosite !== "nuit") {
      document.body.classList.add(`theme-${luminosite}`);
    }
  }

  // Écoute le clic sur le bouton 🌗 : cycle la luminosité. Appelée une
  // seule fois, à la création de l'instance globale "barreReglages".
  initialiserEcouteur() {
    document.getElementById("bouton-theme").addEventListener("click", () => this.cyclerLuminosite());
  }
}

const barreReglages = new BarreReglages(["nuit", "crepuscule", "jour"]);
barreReglages.initialiserEcouteur();


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
    elementsHTML.ecranMenu.hidden = nom !== "menu";
    elementsHTML.ecranJeu.hidden = nom !== "jeu";
    elementsHTML.ecranFin.hidden = nom !== "fin";
  }
}

const gestionnaireEcrans = new GestionnaireEcrans();


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
  // Transforme un nombre de secondes en texte "MM:SS". Utilisée ici et
  // depuis Partie (voir 4-partie.js) pour l'affichage du chronomètre.
  formaterTemps(totalSecondes) {
    const minutes = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
    const secondes = (totalSecondes % 60).toString().padStart(2, "0");
    return `${minutes}:${secondes}`;
  }

  // Affiche le titre et le message de fin dans la langue actuelle. Appelée
  // à la fin de la partie (ou de la série), et de nouveau si la langue
  // change pendant l'écran de fin. En solo ou pour une partie seule, le
  // titre annonce la victoire ou la défaite de cette partie. Pour une
  // série de plusieurs parties, le titre annonce plutôt le joueur qui a
  // gagné le plus de parties (voir SerieParties.gagnantSerie()).
  afficherResultat() {
    const serie = etatPartie.serieActuelle;
    if (serie !== null && serie.estMultiPartie()) {
      const gagnant = serie.gagnantSerie();
      elementsHTML.titreFin.textContent = gagnant !== null
        ? `${gagnant.nomAffiche()} ${traducteur.t("serie-gagnant")}`
        : traducteur.t("serie-egalite");
      elementsHTML.messageFin.textContent = `${serie.nbParties} ${traducteur.t("parties-mot")} ${traducteur.t("parties-jouees")}.`;
      return;
    }

    const partieActuelle = etatPartie.partieActuelle;
    if (partieActuelle.dernierResultat === "victoire") {
      elementsHTML.titreFin.textContent = traducteur.t("victoire-titre");
      elementsHTML.messageFin.textContent = `${traducteur.t("victoire-message")} ${this.formaterTemps(partieActuelle.secondesEcoulees)}.`;
    } else {
      elementsHTML.titreFin.textContent = traducteur.t("defaite-titre");
      elementsHTML.messageFin.textContent = traducteur.t("defaite-message");
    }
  }

  // Construit la ligne de statistiques d'un seul joueur (paires trouvées,
  // vies restantes, temps moyen par paire, temps de réflexion moyen réel
  // entre le 1er et le 2e clic de chaque tour) : réutilisée pour une
  // partie seule comme pour chaque partie du tableau d'une série.
  genererLigneStatJoueur(joueur) {
    const tempsMoyen = joueur.pairesTrouvees > 0
      ? Math.round(joueur.sommeTempsPaires / joueur.pairesTrouvees)
      : null;
    const texteTempsMoyen = tempsMoyen !== null ? `${tempsMoyen}${traducteur.t("temps-moyen-paire")}` : traducteur.t("aucune-paire");

    const tempsReflexionMoyen = joueur.nbToursJoues > 0
      ? (joueur.sommeTempsReflexion / joueur.nbToursJoues).toFixed(1)
      : null;
    const texteTempsReflexion = tempsReflexionMoyen !== null
      ? `${tempsReflexionMoyen}${traducteur.t("temps-reflexion-moyen")}`
      : traducteur.t("aucun-temps-reflexion");

    const ligne = document.createElement("div");
    ligne.className = `ligne-stat-fin ${joueur.classeCouleur}`;
    ligne.innerHTML = `
      <span class="lumiere"></span>
      <span class="nom-stat-fin">${joueur.nomAffiche()}</span>
      <span>${joueur.pairesTrouvees} ${traducteur.t("paires-trouvees")}</span>
      <span>❤️ ${joueur.coeurs}</span>
      <span>${texteTempsMoyen}</span>
      <span>${texteTempsReflexion}</span>
    `;
    return ligne;
  }

  // Affiche le tableau de statistiques : un bloc par partie jouée (avec un
  // titre "Partie N") pour une série de plusieurs parties, ou un seul bloc
  // sans titre pour une partie seule (solo, ou une seule partie choisie).
  afficherStatistiques() {
    elementsHTML.statistiquesFin.innerHTML = "";

    const serie = etatPartie.serieActuelle;
    if (serie !== null && serie.estMultiPartie()) {
      serie.resultats.forEach((resultat, index) => {
        const titreBloc = document.createElement("h3");
        titreBloc.textContent = `${traducteur.t("partie-mot")} ${index + 1}`;
        elementsHTML.statistiquesFin.appendChild(titreBloc);

        resultat.joueurs.forEach((joueur) => {
          elementsHTML.statistiquesFin.appendChild(this.genererLigneStatJoueur(joueur));
        });
      });
      return;
    }

    etatPartie.partieActuelle.joueurs.forEach((joueur) => {
      elementsHTML.statistiquesFin.appendChild(this.genererLigneStatJoueur(joueur));
    });
  }

  // Écoute le clic sur le bouton "Rejouer" : ramène directement au menu
  // pour choisir une nouvelle configuration. Appelée une seule fois, à la
  // création de l'instance globale "affichageFin".
  initialiserEcouteur() {
    document.getElementById("bouton-rejouer").addEventListener("click", () => {
      gestionnaireEcrans.changer("menu");
    });
  }
}

const affichageFin = new AffichageFin();
affichageFin.initialiserEcouteur();
