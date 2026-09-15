// ===================================================================
// ÉTAT DU JEU
// Une seule structure centralise tout ce qu'il faut savoir sur la partie en cours :
// la configuration choisie dans le menu, les cartes, les joueurs et le tour actuel.
// ===================================================================
const etat = {
  scene: "menu",       // "menu" | "jeu" | "fin"
  mode: null,           // "ordinateur" | "multi"
  nbJoueurs: 1,          // nombre de joueurs humains (1 si contre l'ordinateur)
  nbCartes: 16,          // toujours un multiple de 4
  difficulte: "facile",  // "facile" | "moyen" | "difficile"
  cartes: [],            // toutes les cartes de la grille
  joueurs: [],           // liste des joueurs (humains + robot éventuel)
  joueurActuelIndex: 0,
  cartesRetournees: [],  // les 0, 1 ou 2 cartes actuellement retournées par le joueur en cours
  paireEnAttente: false, // true pendant la petite pause où on affiche 2 cartes qui ne correspondent pas
  enPause: false,         // true pendant que le livre est rouvert en cours de partie
};

// Couleurs des lumières, dans l'ordre des joueurs (voir style.css)
const CLASSES_COULEUR_JOUEURS = ["joueur-1", "joueur-2", "joueur-3", "joueur-4"];
const NOMS_COULEURS = ["Bleu", "Vert", "Rose", "Jaune"];

const COEURS_DEPART = 10;
const TEMPS_TOUR = 45; // secondes laissées à chaque joueur pour retourner 2 cartes

// Symboles utilisés sur les cartes (24 cartes = 12 paires maximum avec cette liste)
const SYMBOLES = ["🍎", "🍋", "🍇", "🍉", "🍓", "🍒", "🍍", "🥝", "🥥", "🍑", "🍌", "🥕"];


// ===================================================================
// RÉCUPÉRATION DES ÉLÉMENTS HTML
// On récupère une fois pour toutes les éléments qu'on va devoir modifier,
// plutôt que de refaire document.getElementById() à chaque fois.
// ===================================================================
const ecranMenu = document.getElementById("ecran-menu");
const ecranJeu = document.getElementById("ecran-jeu");
const ecranFin = document.getElementById("ecran-fin");

const blocNbJoueurs = document.getElementById("bloc-nb-joueurs");
const recapMenu = document.getElementById("recap-menu");
const boutonValiderMenu = document.getElementById("bouton-valider-menu");

const chronoAffichage = document.getElementById("chrono");
const tempsTourAffichage = document.getElementById("temps-tour");
const listeJoueurs = document.getElementById("liste-joueurs");
const grilleCartes = document.getElementById("grille-cartes");

const titreFin = document.getElementById("titre-fin");
const messageFin = document.getElementById("message-fin");

// Éléments du livre des règles
const livre = document.getElementById("livre");
const couvertureLivre = document.getElementById("couverture-livre");
const pageQuestion = document.getElementById("page-question");
const pageBonneChance = document.getElementById("page-bonne-chance");
const pageRegles = document.getElementById("page-regles");
const boutonLancerPartie = document.getElementById("bouton-lancer-partie");
const languetteLivre = document.getElementById("languette-livre");


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

gererGroupeBoutons("[data-cartes]", (dataset) => {
  etat.nbCartes = Number(dataset.cartes);
  mettreAJourRecapMenu();
});

gererGroupeBoutons("[data-difficulte]", (dataset) => {
  etat.difficulte = dataset.difficulte;
  mettreAJourRecapMenu();
});

// Affiche un petit résumé des choix et active le bouton "Valider" seulement
// quand tout ce qui est obligatoire a été choisi.
function mettreAJourRecapMenu() {
  const modeChoisi = etat.mode !== null;
  const nbJoueursOk = etat.mode !== "multi" || document.querySelector("[data-joueurs].selectionne");
  const cartesChoisies = document.querySelector("[data-cartes].selectionne");
  const difficulteChoisie = document.querySelector("[data-difficulte].selectionne");

  const pret = modeChoisi && nbJoueursOk && cartesChoisies && difficulteChoisie;
  boutonValiderMenu.disabled = !pret;

  if (pret) {
    const texteMode = etat.mode === "multi" ? `${etat.nbJoueurs} joueurs` : "contre l'ordinateur";
    recapMenu.textContent = `${texteMode} · ${etat.nbCartes} cartes · difficulté ${etat.difficulte}`;
  } else {
    recapMenu.textContent = "";
  }
}

// Une fois la configuration validée, on prépare la partie (cartes, joueurs) et
// on ouvre directement le livre fermé sur sa page de garde, avant que le plateau
// ne soit révélé.
boutonValiderMenu.addEventListener("click", () => {
  preparerPartie();
  changerEcran("jeu");
  ouvrirLivrePremierAcces();
});


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


// ===================================================================
// LIVRE DES RÈGLES
// Un livre fermé qu'il faut cliquer pour ouvrir. Il sert deux fois :
// - au premier accès à la partie (avant que les cartes ne soient jouables),
// - en pause pendant la partie, rouvert via la languette #languette-livre.
// Le comportement change selon le contexte (voir "premier accès" ci-dessous).
// ===================================================================
let livrePremierAcces = true; // true tant que le joueur n'a pas encore répondu à la question initiale

// Ouvre le livre fermé pour la toute première fois, avant que le plateau ne soit révélé.
function ouvrirLivrePremierAcces() {
  livrePremierAcces = true;
  languetteLivre.hidden = true; // pas encore de partie en cours : pas de pause possible
  afficherLivreFerme();
  livre.hidden = false;
}

// Rouvre le livre en pleine partie : on saute directement à la page des règles,
// pas besoin de reposer la question "voulez-vous lire les règles ?".
function ouvrirLivreEnPause() {
  livrePremierAcces = false;
  mettreEnPause();
  afficherPage(pageRegles);
  boutonLancerPartie.textContent = "Relancer la partie";
  livre.classList.remove("livre-ferme");
  livre.classList.add("livre-ouvert");
  livre.hidden = false;
}

// Remet le livre sur sa couverture fermée (page de garde) et affiche la question.
function afficherLivreFerme() {
  livre.classList.add("livre-ferme");
  livre.classList.remove("livre-ouvert");
  afficherPage(pageQuestion);
  boutonLancerPartie.textContent = "Lancer la partie";
}

// N'affiche qu'une seule page du livre à la fois.
function afficherPage(pageAMontrer) {
  [pageQuestion, pageBonneChance, pageRegles].forEach((page) => {
    page.hidden = page !== pageAMontrer;
  });
}

// Cliquer sur la couverture fermée ouvre le livre sur sa première page.
couvertureLivre.addEventListener("click", () => {
  livre.classList.remove("livre-ferme");
  livre.classList.add("livre-ouvert");
});

// "Oui, je souhaite lire les règles" : la page se tourne sur les règles.
document.getElementById("bouton-lire-regles").addEventListener("click", () => {
  afficherPage(pageRegles);
});

// "Non, je ne souhaite pas lire les règles" : phrase affichée 10 secondes puis
// la partie démarre automatiquement (seulement au tout premier accès).
document.getElementById("bouton-refuser-regles").addEventListener("click", () => {
  afficherPage(pageBonneChance);
  setTimeout(() => {
    fermerLivreEtLancerPartie();
  }, 5000);
});

// "Lancer la partie" / "Relancer la partie" : referme le livre et démarre ou reprend le jeu.
boutonLancerPartie.addEventListener("click", () => {
  fermerLivreEtLancerPartie();
});

function fermerLivreEtLancerPartie() {
  livre.hidden = true;
  languetteLivre.hidden = false;

  if (livrePremierAcces) {
    demarrerPartie();
    livrePremierAcces = false;
  } else {
    reprendrePartie();
  }
}

// La languette reste visible pendant toute la partie pour rouvrir le livre (= pause).
languetteLivre.addEventListener("click", () => {
  ouvrirLivreEnPause();
});


// ===================================================================
// PRÉPARATION DE LA PARTIE
// Crée les joueurs, mélange les cartes et affiche le plateau de jeu, mais sans
// démarrer le chrono ni le tour : le plateau reste caché derrière le livre
// jusqu'à ce que le joueur ait répondu à la question des règles.
// ===================================================================
function preparerPartie() {
  creerJoueurs();
  etat.cartes = creerEtMelangerCartes(etat.nbCartes, etat.difficulte);
  etat.joueurActuelIndex = 0;
  etat.cartesRetournees = [];
  chronoDemarre = false;
  chronoAffichage.textContent = "00:00";

  afficherJoueurs();
  afficherCartes();
}

// Démarre réellement la partie (le tour), une fois le livre refermé.
// Le chrono, lui, ne démarre qu'au premier clic sur une carte (voir choisirCarte()).
function demarrerPartie() {
  demarrerTour();
}

// Construit la liste des joueurs : des humains, puis un robot si le mode "ordinateur" est choisi.
function creerJoueurs() {
  etat.joueurs = [];

  for (let i = 0; i < etat.nbJoueurs; i++) {
    etat.joueurs.push({
      nom: `Joueur ${i + 1}`,
      classeCouleur: CLASSES_COULEUR_JOUEURS[i],
      coeurs: COEURS_DEPART,
      estRobot: false,
    });
  }

  if (etat.mode === "ordinateur") {
    etat.joueurs.push({
      nom: "Ordinateur",
      classeCouleur: "joueur-robot",
      coeurs: COEURS_DEPART,
      estRobot: true,
    });
  }
}

// Crée les paires de cartes puis les mélange. La difficulté choisie change
// simplement le nombre de mélanges effectués : plus il y en a, plus l'ordre
// final est imprévisible.
function creerEtMelangerCartes(nbCartes, difficulte) {
  const nbPaires = nbCartes / 2;
  const symbolesUtilises = SYMBOLES.slice(0, nbPaires);

  // Chaque symbole apparaît deux fois (= une paire)
  let cartes = symbolesUtilises.concat(symbolesUtilises).map((symbole, index) => ({
    id: index,
    symbole: symbole,
    retournee: false,
    trouvee: false,
  }));

  const nbMelanges = { facile: 1, moyen: 4, difficile: 10 }[difficulte];
  for (let m = 0; m < nbMelanges; m++) {
    cartes = melangerUneFois(cartes);
  }

  return cartes;
}

// Mélange de Fisher-Yates : parcourt le tableau depuis la fin et échange
// chaque carte avec une autre choisie au hasard avant elle.
function melangerUneFois(cartes) {
  const resultat = cartes.slice();
  for (let i = resultat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultat[i], resultat[j]] = [resultat[j], resultat[i]];
  }
  return resultat;
}


// ===================================================================
// AFFICHAGE DES JOUEURS (colonne de gauche : lumière + nom + coeurs)
// ===================================================================
function afficherJoueurs() {
  listeJoueurs.innerHTML = "";

  etat.joueurs.forEach((joueur, index) => {
    const ligne = document.createElement("div");
    ligne.className = `ligne-joueur ${joueur.classeCouleur}`;
    ligne.id = `ligne-joueur-${index}`;

    const nomCouleur = joueur.estRobot ? "Argenté" : NOMS_COULEURS[index];
    ligne.innerHTML = `
      <span class="lumiere"></span>
      <span>${joueur.nom} (${nomCouleur})</span>
      <span class="coeurs" id="coeurs-${index}">❤️ ${joueur.coeurs}</span>
    `;
    listeJoueurs.appendChild(ligne);
  });
}

// Met à jour uniquement le nombre de coeurs affiché pour un joueur donné.
function afficherCoeurs(index) {
  const joueur = etat.joueurs[index];
  document.getElementById(`coeurs-${index}`).textContent = `❤️ ${joueur.coeurs}`;

  const ligne = document.getElementById(`ligne-joueur-${index}`);
  ligne.classList.toggle("elimine", joueur.coeurs <= 0);
}

// Allume la lumière du joueur dont c'est le tour et éteint celles des autres.
function allumerLumiereJoueurActuel() {
  etat.joueurs.forEach((_, index) => {
    const lumiere = document.querySelector(`#ligne-joueur-${index} .lumiere`);
    lumiere.classList.toggle("allumee", index === etat.joueurActuelIndex);
  });
}


// ===================================================================
// AFFICHAGE DES CARTES
// ===================================================================
function afficherCartes() {
  grilleCartes.innerHTML = "";

  etat.cartes.forEach((carte) => {
    const bouton = document.createElement("button");
    bouton.className = "carte";
    bouton.id = `carte-${carte.id}`;
    bouton.addEventListener("click", () => choisirCarte(carte.id));
    grilleCartes.appendChild(bouton);
  });
}

// Met à jour l'apparence d'une carte en fonction de son état (cachée / retournée / trouvée).
function rafraichirCarte(carte) {
  const bouton = document.getElementById(`carte-${carte.id}`);
  bouton.classList.toggle("retournee", carte.retournee);
  bouton.classList.toggle("trouvee", carte.trouvee);
  bouton.textContent = carte.retournee || carte.trouvee ? carte.symbole : "";
}


// ===================================================================
// TOUR DE JEU
// Un tour = un joueur retourne 2 cartes (ou le temps s'écoule).
// ===================================================================
let identifiantMinuteurTour = null;
let secondesRestantesTour = TEMPS_TOUR;

function demarrerTour() {
  etat.cartesRetournees = [];
  allumerLumiereJoueurActuel();

  secondesRestantesTour = TEMPS_TOUR;
  tempsTourAffichage.textContent = `${secondesRestantesTour}s`;

  lancerMinuteurTour();

  // Si c'est le tour de l'ordinateur, il joue automatiquement après un court délai.
  const joueurActuel = etat.joueurs[etat.joueurActuelIndex];
  if (joueurActuel.estRobot) {
    setTimeout(() => {
      if (!etat.enPause) jouerTourRobot();
    }, 800);
  }
}

// Démarre le décompte du tour à partir de la valeur actuelle de "secondesRestantesTour"
// (utilisé au début d'un tour, mais aussi pour reprendre après une pause).
function lancerMinuteurTour() {
  clearInterval(identifiantMinuteurTour);
  identifiantMinuteurTour = setInterval(() => {
    secondesRestantesTour -= 1;
    tempsTourAffichage.textContent = `${secondesRestantesTour}s`;

    if (secondesRestantesTour <= 0) {
      // Le temps est écoulé : le joueur n'a pas terminé son tour, il perd un coeur.
      clearInterval(identifiantMinuteurTour);
      perdreCoeurJoueurActuel();
      passerAuJoueurSuivant();
    }
  }, 1000);
}

// Le joueur (ou le robot) clique sur une carte pour la retourner.
function choisirCarte(idCarte) {
  if (etat.enPause) return; // le livre est ouvert : le plateau est bloqué
  if (etat.paireEnAttente) return; // on attend que la paire précédente soit masquée

  const carte = etat.cartes.find((c) => c.id === idCarte);
  if (carte.retournee || carte.trouvee) return; // carte déjà visible : rien à faire
  if (etat.cartesRetournees.length >= 2) return; // déjà 2 cartes retournées ce tour-ci

  // Le chrono de la partie démarre seulement au tout premier clic sur une carte.
  if (!chronoDemarre) {
    demarrerChrono();
  }

  carte.retournee = true;
  rafraichirCarte(carte);
  etat.cartesRetournees.push(carte);

  if (etat.cartesRetournees.length === 2) {
    verifierPaire();
  }
}

// Compare les deux cartes retournées : paire trouvée (+1 coeur) ou erreur (-1 coeur).
function verifierPaire() {
  clearInterval(identifiantMinuteurTour);
  etat.paireEnAttente = true;

  const [carteA, carteB] = etat.cartesRetournees;
  const estUnePaire = carteA.symbole === carteB.symbole;

  setTimeout(() => {
    if (estUnePaire) {
      carteA.trouvee = true;
      carteB.trouvee = true;
      gagnerCoeurJoueurActuel();
    } else {
      carteA.retournee = false;
      carteB.retournee = false;
      perdreCoeurJoueurActuel();
    }
    rafraichirCarte(carteA);
    rafraichirCarte(carteB);
    etat.paireEnAttente = false;

    if (toutesLesPairesTrouvees()) {
      terminerPartie("victoire");
      return;
    }

    // En cas de paire trouvée, le même joueur rejoue ; sinon on passe au suivant.
    if (estUnePaire) {
      demarrerTour();
    } else {
      passerAuJoueurSuivant();
    }
  }, 800);
}

function toutesLesPairesTrouvees() {
  return etat.cartes.every((carte) => carte.trouvee);
}

function gagnerCoeurJoueurActuel() {
  const joueur = etat.joueurs[etat.joueurActuelIndex];
  joueur.coeurs += 1;
  afficherCoeurs(etat.joueurActuelIndex);
}

// Fait perdre un coeur au joueur actuel et vérifie s'il est éliminé.
function perdreCoeurJoueurActuel() {
  const joueur = etat.joueurs[etat.joueurActuelIndex];
  joueur.coeurs = Math.max(0, joueur.coeurs - 1);
  afficherCoeurs(etat.joueurActuelIndex);

  if (joueur.coeurs === 0 && plusAucunJoueurEnVie()) {
    terminerPartie("defaite");
  }
}

function plusAucunJoueurEnVie() {
  return etat.joueurs.every((joueur) => joueur.coeurs <= 0);
}

// Passe la main au prochain joueur encore en vie.
function passerAuJoueurSuivant() {
  if (etat.scene !== "jeu") return; // la partie est peut-être déjà terminée

  do {
    etat.joueurActuelIndex = (etat.joueurActuelIndex + 1) % etat.joueurs.length;
  } while (etat.joueurs[etat.joueurActuelIndex].coeurs <= 0);

  demarrerTour();
}

// Le robot choisit simplement deux cartes cachées au hasard.
function jouerTourRobot() {
  if (etat.scene !== "jeu") return;

  const cartesDisponibles = etat.cartes.filter((c) => !c.retournee && !c.trouvee);
  const premiereCarte = cartesDisponibles[Math.floor(Math.random() * cartesDisponibles.length)];
  choisirCarte(premiereCarte.id);

  setTimeout(() => {
    const cartesRestantes = etat.cartes.filter((c) => !c.retournee && !c.trouvee);
    const deuxiemeCarte = cartesRestantes[Math.floor(Math.random() * cartesRestantes.length)];
    choisirCarte(deuxiemeCarte.id);
  }, 600);
}


// ===================================================================
// CHRONOMÈTRE DE LA PARTIE (minutes : secondes)
// Démarre avec la partie et s'arrête à la victoire ou à la défaite finale.
// ===================================================================
let identifiantChrono = null;
let secondesEcoulees = 0;
let chronoDemarre = false; // devient true au premier clic sur une carte, jusqu'à la fin de la partie

function demarrerChrono() {
  chronoDemarre = true;
  secondesEcoulees = 0;
  chronoAffichage.textContent = "00:00";

  identifiantChrono = setInterval(() => {
    secondesEcoulees += 1;
    chronoAffichage.textContent = formaterTemps(secondesEcoulees);
  }, 1000);
}

function arreterChrono() {
  clearInterval(identifiantChrono);
}

// Reprend le chrono là où il en était, sans le remettre à zéro.
function reprendreChrono() {
  clearInterval(identifiantChrono);
  identifiantChrono = setInterval(() => {
    secondesEcoulees += 1;
    chronoAffichage.textContent = formaterTemps(secondesEcoulees);
  }, 1000);
}

// ===================================================================
// PAUSE (livre rouvert pendant la partie)
// Le chrono et le minuteur de tour s'arrêtent sans se réinitialiser ;
// choisirCarte() est aussi bloqué via etat.enPause.
// ===================================================================
function mettreEnPause() {
  etat.enPause = true;
  arreterChrono();
  clearInterval(identifiantMinuteurTour);
}

function reprendrePartie() {
  etat.enPause = false;
  // Le chrono ne reprend que s'il avait déjà démarré (le joueur a pu ouvrir
  // le livre en pause avant même d'avoir retourné sa première carte).
  if (chronoDemarre) {
    reprendreChrono();
  }
  lancerMinuteurTour();
}

// Transforme un nombre de secondes en texte "MM:SS".
function formaterTemps(totalSecondes) {
  const minutes = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
  const secondes = (totalSecondes % 60).toString().padStart(2, "0");
  return `${minutes}:${secondes}`;
}


// ===================================================================
// FIN DE PARTIE
// ===================================================================
function terminerPartie(resultat) {
  arreterChrono();
  clearInterval(identifiantMinuteurTour);
  languetteLivre.hidden = true;

  if (resultat === "victoire") {
    titreFin.textContent = "Toutes les paires sont trouvées !";
    messageFin.textContent = `Partie terminée en ${formaterTemps(secondesEcoulees)}.`;
  } else {
    titreFin.textContent = "Partie terminée";
    messageFin.textContent = "Tous les joueurs ont perdu leurs coeurs.";
  }

  changerEcran("fin");
}

// Le bouton "Rejouer" ramène directement au menu pour choisir une nouvelle configuration.
document.getElementById("bouton-rejouer").addEventListener("click", () => {
  changerEcran("menu");
});
