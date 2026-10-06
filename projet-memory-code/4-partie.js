// ===================================================================
// CLASSE PARTIE
//
// Regroupe tout ce qu'il faut savoir sur la partie en cours : les cartes,
// les joueurs, le tour actuel, le chrono et le minuteur de tour, l'IA du
// robot, et la fin de partie. Une seule instance vit à la fois, dans la
// variable "partieActuelle".
//
// Fichier : 4-partie.js (classe entière) ; "partieActuelle" et les éléments
// HTML qu'elle manipule (chrono, grille de cartes...) sont déclarés dans
// 4-code.js.
// ===================================================================
class Partie {
  constructor(mode, nbJoueurs, difficulteOrdi, theme, nbCartes, difficulte) {
    this.mode = mode;
    this.difficulteOrdi = difficulteOrdi;
    this.theme = theme;

    this.joueurs = this.creerJoueurs(nbJoueurs);
    this.cartes = this.creerEtMelangerCartes(nbCartes, difficulte);
    this.joueurActuelIndex = 0;
    this.cartesRetournees = [];
    this.paireEnAttente = false; // true pendant la petite pause où on affiche 2 cartes qui ne correspondent pas
    this.enPause = false;        // true pendant que le livre est rouvert en cours de partie

    // Chronomètre de la partie (minutes : secondes)
    this.identifiantChrono = null;
    this.secondesEcoulees = 0;
    this.chronoDemarre = false; // devient true au premier clic sur une carte, jusqu'à la fin de la partie

    // Minuteur du tour en cours
    this.identifiantMinuteurTour = null;
    this.secondesRestantesTour = TEMPS_TOUR;
    this.secondesDebutTourJoueur = 0;   // valeur du chrono au début du tour, pour mesurer le temps mis à trouver une paire
    this.instantPremierClicTour = 0;    // Date.now() au premier clic du tour, pour le temps de réflexion réel

    this.memoireRobot = {};             // symbole -> liste des ids de cartes vues avec ce symbole, encore cachées
    this.dernierResultat = null;        // "victoire" | "defaite", mémorisé pour retraduire l'écran de fin

    this.afficherJoueurs();
    this.afficherCartes();
  }

  // Construit la liste des joueurs : des humains, puis un robot si le mode "ordinateur" est choisi.
  creerJoueurs(nbJoueurs) {
    const joueurs = [];

    for (let i = 0; i < nbJoueurs; i++) {
      joueurs.push(new Joueur(i + 1, CLASSES_COULEUR_JOUEURS[i], false));
    }

    if (this.mode === "ordinateur") {
      joueurs.push(new Joueur(null, "joueur-robot", true));
    }

    return joueurs;
  }

  // Crée les paires de cartes puis les mélange. La difficulté choisie change
  // simplement le nombre de mélanges effectués : plus il y en a, plus l'ordre
  // final est imprévisible. Chaque carte retient le numéro de son symbole :
  // l'image affichée dépend du thème visuel choisi (voir
  // ThemeVisuel.cheminSymboleCarte() dans 4-theme-visuel.js), mais la
  // comparaison de paires se fait sur ce numéro, indépendamment du thème.
  creerEtMelangerCartes(nbCartes, difficulte) {
    const nbPaires = nbCartes / 2;

    // Chaque symbole apparaît deux fois (= une paire)
    let cartes = [];
    let id = 0;
    for (let numeroSymbole = 1; numeroSymbole <= nbPaires; numeroSymbole++) {
      for (let exemplaire = 0; exemplaire < 2; exemplaire++) {
        cartes.push(new Carte(id, numeroSymbole));
        id++;
      }
    }

    const nbMelanges = { facile: 1, moyen: 4, difficile: 10 }[difficulte];
    for (let m = 0; m < nbMelanges; m++) {
      cartes = this.melangerUneFois(cartes);
    }

    return cartes;
  }

  // Mélange de Fisher-Yates : parcourt le tableau depuis la fin et échange
  // chaque carte avec une autre choisie au hasard avant elle.
  melangerUneFois(cartes) {
    const resultat = cartes.slice();
    for (let i = resultat.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultat[i], resultat[j]] = [resultat[j], resultat[i]];
    }
    return resultat;
  }


  // ===================================================================
  // AFFICHAGE DES JOUEURS
  //
  // Dessine la colonne de gauche (lumière + nom + coeurs par joueur) et la
  // tient à jour (coeurs, lumière du joueur actif).
  //
  // Fichier : 4-partie.js, méthodes afficherJoueurs() à
  // allumerLumiereJoueurActuel().
  // ===================================================================

  afficherJoueurs() {
    listeJoueurs.innerHTML = "";

    this.joueurs.forEach((joueur, index) => {
      const ligne = document.createElement("div");
      ligne.className = `ligne-joueur ${joueur.classeCouleur}`;
      ligne.classList.toggle("elimine", joueur.estElimine()); // reste correct si on retraduit en cours de partie
      ligne.id = `ligne-joueur-${index}`;

      const nomCouleur = joueur.estRobot ? t("couleur-argente") : t(CLES_TRADUCTION_COULEURS[index]);
      ligne.innerHTML = `
        <span class="lumiere"></span>
        <span>${joueur.nomAffiche()} (${nomCouleur})</span>
        <span class="coeurs" id="coeurs-${index}">❤️ ${joueur.coeurs}</span>
      `;
      listeJoueurs.appendChild(ligne);
    });
  }

  // Met à jour uniquement le nombre de coeurs affiché pour un joueur donné.
  afficherCoeurs(index) {
    const joueur = this.joueurs[index];
    document.getElementById(`coeurs-${index}`).textContent = `❤️ ${joueur.coeurs}`;

    const ligne = document.getElementById(`ligne-joueur-${index}`);
    ligne.classList.toggle("elimine", joueur.estElimine());
  }

  // Allume la lumière du joueur dont c'est le tour et éteint celles des autres.
  allumerLumiereJoueurActuel() {
    this.joueurs.forEach((_, index) => {
      const lumiere = document.querySelector(`#ligne-joueur-${index} .lumiere`);
      lumiere.classList.toggle("allumee", index === this.joueurActuelIndex);
    });
  }


  // ===================================================================
  // AFFICHAGE DES CARTES
  //
  // Dessine la grille de cartes (un bouton par carte, avec son image de
  // symbole cachée au départ) et la met à jour quand une carte change
  // d'état (retournée / trouvée).
  //
  // Fichier : 4-partie.js, méthodes afficherCartes() à afficherPairesTrouvees().
  // ===================================================================

  afficherCartes() {
    grilleCartes.innerHTML = "";

    this.cartes.forEach((carte) => {
      const bouton = document.createElement("button");
      bouton.className = "carte";
      bouton.id = `carte-${carte.id}`;
      bouton.addEventListener("click", () => this.choisirCarte(carte.id));

      // Le dos (face cachée) est posé en CSS via background-image (voir .carte
      // dans 6-style.css) : il suit automatiquement le thème choisi. Seule l'image
      // du symbole (face visible) est gérée ici, une fois la carte retournée.
      const imageSymbole = document.createElement("img");
      imageSymbole.className = "image-symbole-carte";
      imageSymbole.src = THEMES_VISUELS[this.theme].cheminSymboleCarte(carte.numeroSymbole);
      imageSymbole.alt = "";
      imageSymbole.hidden = true;
      bouton.appendChild(imageSymbole);

      grilleCartes.appendChild(bouton);
    });

    this.afficherPairesTrouvees();
  }

  // Met à jour l'apparence d'une carte en fonction de son état (cachée / retournée / trouvée).
  rafraichirCarte(carte) {
    const bouton = document.getElementById(`carte-${carte.id}`);
    bouton.classList.toggle("retournee", carte.retournee);
    bouton.classList.toggle("trouvee", carte.trouvee);
    bouton.querySelector(".image-symbole-carte").hidden = !carte.estVisible();
  }

  // Affiche, sous la liste des joueurs, une petite carte miniature par paire
  // déjà trouvée (une carte sur deux suffit, les deux cartes d'une paire
  // montrent le même symbole), dans l'ordre où les paires ont été trouvées.
  // Même structure que les cartes du plateau (un conteneur + une image à
  // l'intérieur), juste en plus petit via la classe "mini-carte-trouvee".
  afficherPairesTrouvees() {
    const cartesTrouvees = this.cartes.filter((carte) => carte.trouvee);

    pairesTrouvees.innerHTML = "";
    for (let i = 0; i < cartesTrouvees.length; i += 2) {
      const carte = cartesTrouvees[i];
      const miniCarte = document.createElement("div");
      miniCarte.className = "mini-carte-trouvee";

      const imageSymbole = document.createElement("img");
      imageSymbole.src = THEMES_VISUELS[this.theme].cheminSymboleCarte(carte.numeroSymbole);
      imageSymbole.alt = "";
      miniCarte.appendChild(imageSymbole);

      pairesTrouvees.appendChild(miniCarte);
    }
  }


  // ===================================================================
  // TOUR DE JEU
  //
  // Un tour = un joueur retourne 2 cartes (ou le temps s'écoule). Gère le
  // minuteur du tour, le clic sur une carte, la vérification de paire, et
  // le passage au joueur suivant.
  //
  // Fichier : 4-partie.js, méthodes demarrerTour() à passerAuJoueurSuivant().
  // ===================================================================

  demarrerTour() {
    this.cartesRetournees = [];
    this.allumerLumiereJoueurActuel();

    this.secondesRestantesTour = TEMPS_TOUR;
    tempsTourAffichage.textContent = `${this.secondesRestantesTour}s`;
    this.secondesDebutTourJoueur = this.secondesEcoulees;

    this.lancerMinuteurTour();

    // Si c'est le tour de l'ordinateur, il joue automatiquement après un court délai.
    const joueurActuel = this.joueurs[this.joueurActuelIndex];
    if (joueurActuel.estRobot) {
      setTimeout(() => {
        if (!this.enPause) this.jouerTourRobot();
      }, 800);
    }
  }

  // Démarre le décompte du tour à partir de la valeur actuelle de
  // "secondesRestantesTour" (utilisé au début d'un tour, mais aussi pour
  // reprendre après une pause).
  lancerMinuteurTour() {
    clearInterval(this.identifiantMinuteurTour);
    this.identifiantMinuteurTour = setInterval(() => {
      this.secondesRestantesTour -= 1;
      tempsTourAffichage.textContent = `${this.secondesRestantesTour}s`;

      if (this.secondesRestantesTour <= 0) {
        // Le temps est écoulé : le joueur n'a pas terminé son tour, il perd un coeur.
        clearInterval(this.identifiantMinuteurTour);
        this.perdreCoeurJoueurActuel();
        this.passerAuJoueurSuivant();
      }
    }, 1000);
  }

  // Le joueur (ou le robot) clique sur une carte pour la retourner.
  choisirCarte(idCarte) {
    if (this.enPause) return; // le livre est ouvert : le plateau est bloqué
    if (this.paireEnAttente) return; // on attend que la paire précédente soit masquée

    const carte = this.cartes.find((c) => c.id === idCarte);
    if (carte.estVisible()) return; // carte déjà visible : rien à faire
    if (this.cartesRetournees.length >= 2) return; // déjà 2 cartes retournées ce tour-ci

    // Le chrono de la partie démarre seulement au tout premier clic sur une carte.
    if (!this.chronoDemarre) {
      this.demarrerChrono();
    }

    // Horodatage du premier clic du tour, pour mesurer le temps de réflexion
    // réel jusqu'au second clic (voir verifierPaire()).
    if (this.cartesRetournees.length === 0) {
      this.instantPremierClicTour = Date.now();
    }

    carte.retourner();
    this.rafraichirCarte(carte);
    this.cartesRetournees.push(carte);
    this.memoriserCartePourRobot(carte);

    if (this.cartesRetournees.length === 2) {
      this.verifierPaire();
    }
  }

  // Compare les deux cartes retournées : paire trouvée (+1 coeur) ou erreur (-1 coeur).
  verifierPaire() {
    clearInterval(this.identifiantMinuteurTour);
    this.paireEnAttente = true;

    const [carteA, carteB] = this.cartesRetournees;
    const estUnePaire = carteA.estUnePaireAvec(carteB);

    // Temps de réflexion réel entre le 1er et le 2e clic de ce tour (en secondes).
    const tempsReflexion = (Date.now() - this.instantPremierClicTour) / 1000;
    this.joueurs[this.joueurActuelIndex].enregistrerTempsReflexion(tempsReflexion);

    setTimeout(() => {
      if (estUnePaire) {
        carteA.marquerTrouvee();
        carteB.marquerTrouvee();
        this.gagnerCoeurJoueurActuel();
        this.afficherPairesTrouvees();
      } else {
        carteA.cacher();
        carteB.cacher();
        this.perdreCoeurJoueurActuel();
      }
      this.rafraichirCarte(carteA);
      this.rafraichirCarte(carteB);
      this.paireEnAttente = false;

      if (this.toutesLesPairesTrouvees()) {
        this.terminer("victoire");
        return;
      }

      // En cas de paire trouvée, le même joueur rejoue ; sinon on passe au suivant.
      if (estUnePaire) {
        this.demarrerTour();
      } else {
        this.passerAuJoueurSuivant();
      }
    }, 800);
  }

  toutesLesPairesTrouvees() {
    return this.cartes.every((carte) => carte.trouvee);
  }

  gagnerCoeurJoueurActuel() {
    const joueur = this.joueurs[this.joueurActuelIndex];
    joueur.gagnerCoeur();
    this.afficherCoeurs(this.joueurActuelIndex);

    // Statistiques pour l'écran de fin : une paire de plus, et le temps mis
    // pour la trouver (depuis le début de ce tour) vient allonger la moyenne.
    joueur.gagnerPaire(this.secondesEcoulees - this.secondesDebutTourJoueur);
  }

  // Fait perdre un coeur au joueur actuel et vérifie s'il est éliminé.
  perdreCoeurJoueurActuel() {
    const joueur = this.joueurs[this.joueurActuelIndex];
    joueur.perdreCoeur();
    this.afficherCoeurs(this.joueurActuelIndex);

    if (joueur.estElimine() && this.plusAucunJoueurEnVie()) {
      this.terminer("defaite");
    }
  }

  plusAucunJoueurEnVie() {
    return this.joueurs.every((joueur) => joueur.estElimine());
  }

  // Passe la main au prochain joueur encore en vie.
  passerAuJoueurSuivant() {
    if (scene !== "jeu") return; // la partie est peut-être déjà terminée

    do {
      this.joueurActuelIndex = (this.joueurActuelIndex + 1) % this.joueurs.length;
    } while (this.joueurs[this.joueurActuelIndex].estElimine());

    this.demarrerTour();
  }


  // ===================================================================
  // IA DU ROBOT (mode "contre l'ordinateur")
  //
  // Le robot a une mémoire des cartes déjà vues (les siennes et celles du
  // joueur humain) et l'utilise plus ou moins selon la difficulté choisie :
  // - "naze"  : mémorise mais évite volontairement de jouer une paire connue.
  // - "moyen" : joue parfois la paire connue, parfois au hasard (des feintes).
  // - "fort"  : joue la paire connue dès que possible, sauf s'il écrase déjà
  //             trop le joueur, auquel cas il rate volontairement un tour de
  //             temps en temps pour garder la partie intéressante.
  //
  // Fichier : 4-partie.js, méthodes memoriserCartePourRobot() à
  // jouerTourRobot().
  // ===================================================================

  // Appelée à chaque carte retournée (par le joueur humain ou le robot
  // lui-même) : le robot "voit" toujours les cartes retournées, comme un
  // joueur humain le ferait.
  memoriserCartePourRobot(carte) {
    if (!this.memoireRobot[carte.numeroSymbole]) {
      this.memoireRobot[carte.numeroSymbole] = [];
    }
    if (!this.memoireRobot[carte.numeroSymbole].includes(carte.id)) {
      this.memoireRobot[carte.numeroSymbole].push(carte.id);
    }
  }

  // Cherche un symbole dont le robot connaît 2 cartes différentes, encore
  // cachées et non trouvées. Retourne les 2 cartes si une paire connue existe,
  // sinon null.
  chercherPaireConnue() {
    for (const symbole in this.memoireRobot) {
      const idsConnus = this.memoireRobot[symbole].filter((id) => {
        const carte = this.cartes.find((c) => c.id === id);
        return carte && !carte.estVisible();
      });
      if (idsConnus.length >= 2) {
        const carteA = this.cartes.find((c) => c.id === idsConnus[0]);
        const carteB = this.cartes.find((c) => c.id === idsConnus[1]);
        return [carteA, carteB];
      }
    }
    return null;
  }

  // Tire une carte cachée au hasard, en excluant éventuellement une carte déjà choisie.
  carteAuHasard(carteAExclure) {
    const cartesDisponibles = this.cartes.filter(
      (c) => !c.estVisible() && c !== carteAExclure
    );
    return cartesDisponibles[Math.floor(Math.random() * cartesDisponibles.length)];
  }

  joueurHumain() {
    return this.joueurs.find((j) => !j.estRobot);
  }

  joueurRobot() {
    return this.joueurs.find((j) => j.estRobot);
  }

  // Écart de coeurs robot - humain : positif si le robot mène.
  ecartCoeursRobot() {
    return this.joueurRobot().coeurs - this.joueurHumain().coeurs;
  }

  // Probabilité que le robot joue la paire connue plutôt qu'au hasard, si il en a une.
  probabiliteJouerPaireConnue() {
    if (this.difficulteOrdi === "naze") {
      return 0; // ne joue jamais la paire connue : il perd naturellement
    }
    if (this.difficulteOrdi === "moyen") {
      return 0.5; // une feinte sur deux
    }
    // "fort" : joue quasi toujours la paire connue, sauf s'il écrase déjà le
    // joueur humain (grand écart de coeurs en sa faveur) : il se retient alors
    // un tour sur trois pour laisser la partie ouverte.
    const ecrasement = this.ecartCoeursRobot() >= 4;
    return ecrasement ? 0.7 : 0.95;
  }

  // Choisit les 2 cartes que le robot va retourner ce tour-ci, selon sa
  // mémoire et la difficulté choisie.
  choisirCartesRobot() {
    const paireConnue = this.chercherPaireConnue();

    if (paireConnue && Math.random() < this.probabiliteJouerPaireConnue()) {
      return paireConnue;
    }

    // Pas de paire connue exploitée : 2 cartes au hasard parmi les cachées
    // (c'est aussi ce qui fait "découvrir" nos propres cartes pour plus tard).
    const premiereCarte = this.carteAuHasard();
    const deuxiemeCarte = this.carteAuHasard(premiereCarte);
    return [premiereCarte, deuxiemeCarte];
  }

  // Le robot joue son tour : un court délai avant chaque clic pour rester
  // lisible à l'écran, comme un joueur qui regarde le plateau avant de choisir.
  jouerTourRobot() {
    if (scene !== "jeu") return;

    const [premiereCarte, deuxiemeCarte] = this.choisirCartesRobot();
    this.choisirCarte(premiereCarte.id);

    setTimeout(() => {
      if (scene !== "jeu" || this.enPause) return;
      this.choisirCarte(deuxiemeCarte.id);
    }, 600);
  }


  // ===================================================================
  // CHRONOMÈTRE ET PAUSE
  //
  // Démarre, arrête et reprend le chrono de la partie ; met la partie en
  // pause (et la reprend) quand le livre des règles est rouvert en cours
  // de jeu.
  //
  // Fichier : 4-partie.js, méthodes demarrerChrono() à reprendre().
  // ===================================================================

  demarrerChrono() {
    this.chronoDemarre = true;
    this.secondesEcoulees = 0;
    chronoAffichage.textContent = "00:00";
    this.lancerChrono();
  }

  arreterChrono() {
    clearInterval(this.identifiantChrono);
  }

  // Démarre le décompte du chrono à partir de la valeur actuelle de
  // "secondesEcoulees" (utilisé au tout premier démarrage, mais aussi pour
  // reprendre après une pause sans repartir de zéro).
  lancerChrono() {
    clearInterval(this.identifiantChrono);
    this.identifiantChrono = setInterval(() => {
      this.secondesEcoulees += 1;
      chronoAffichage.textContent = formaterTemps(this.secondesEcoulees);
    }, 1000);
  }

  // Le chrono et le minuteur de tour s'arrêtent sans se réinitialiser ;
  // choisirCarte() est aussi bloqué via this.enPause.
  mettreEnPause() {
    this.enPause = true;
    this.arreterChrono();
    clearInterval(this.identifiantMinuteurTour);
  }

  reprendre() {
    this.enPause = false;
    // Le chrono ne reprend que s'il avait déjà démarré (le joueur a pu ouvrir
    // le livre en pause avant même d'avoir retourné sa première carte).
    if (this.chronoDemarre) {
      this.lancerChrono();
    }
    this.lancerMinuteurTour();
  }


  // ===================================================================
  // FIN DE PARTIE
  //
  // Arrête le chrono et le minuteur, puis affiche l'écran de fin (titre,
  // message et statistiques de chaque joueur).
  //
  // Fichier : 4-partie.js, méthode terminer() ; les fonctions d'affichage
  // afficherResultatFin() et afficherStatistiquesFin() sont dans 4-code.js.
  // ===================================================================

  terminer(resultat) {
    this.arreterChrono();
    clearInterval(this.identifiantMinuteurTour);
    languetteLivre.hidden = true;

    this.dernierResultat = resultat;
    afficherResultatFin();
    afficherStatistiquesFin();
    changerEcran("fin");
  }
}
