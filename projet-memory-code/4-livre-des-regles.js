// ===================================================================
// CLASSE LIVRE DES RÈGLES
//
// Représente le livre fermé qu'il faut cliquer pour ouvrir. Il sert deux
// fois : au premier accès à la partie (avant que les cartes ne soient
// jouables), et en pause pendant la partie (rouvert via la languette
// #languette-livre) — le comportement change selon le contexte (voir
// "premier accès" dans le code ci-dessous). Une seule instance globale,
// "livreDesRegles", gère tout le livre.
//
// Fichiers : 4-livre-des-regles.js (classe + ses écouteurs de clic) ;
// l'élément DOM du livre lui-même reste elementsHTML.livre (voir 4-code.js).
// ===================================================================
class LivreDesRegles {
  constructor() {
    this.premierAcces = true; // true tant que le joueur n'a pas encore répondu à la question initiale
  }

  // Ouvre le livre fermé pour la toute première fois, avant que le plateau ne soit révélé.
  ouvrirPremierAcces() {
    this.premierAcces = true;
    elementsHTML.languetteLivre.hidden = true; // pas encore de partie en cours : pas de pause possible
    this.afficherFerme();
    elementsHTML.livre.hidden = false;
  }

  // Rouvre le livre en pleine partie : on saute directement à la page des règles,
  // pas besoin de reposer la question "voulez-vous lire les règles ?".
  ouvrirEnPause() {
    this.premierAcces = false;
    etatPartie.partieActuelle.mettreEnPause();
    this.afficherPage(elementsHTML.pageRegles);
    elementsHTML.boutonLancerPartie.textContent = t("relancer-partie");
    elementsHTML.livre.classList.remove("livre-ferme");
    elementsHTML.livre.classList.add("livre-ouvert");
    elementsHTML.livre.hidden = false;
  }

  // Remet le livre sur sa couverture fermée (page de garde) et affiche la question.
  afficherFerme() {
    elementsHTML.livre.classList.add("livre-ferme");
    elementsHTML.livre.classList.remove("livre-ouvert");
    this.afficherPage(elementsHTML.pageQuestion);
    elementsHTML.boutonLancerPartie.textContent = t("lancer-partie");
  }

  // N'affiche qu'une seule page du livre à la fois.
  afficherPage(pageAMontrer) {
    [elementsHTML.pageQuestion, elementsHTML.pageBonneChance, elementsHTML.pageRegles].forEach((page) => {
      page.hidden = page !== pageAMontrer;
    });
  }

  // Referme le livre et démarre ou reprend le jeu, selon qu'on en est au tout
  // premier accès ou à une pause en cours de partie.
  fermerEtLancerPartie() {
    elementsHTML.livre.hidden = true;
    elementsHTML.languetteLivre.hidden = false;

    if (this.premierAcces) {
      etatPartie.partieActuelle.demarrerTour();
      this.premierAcces = false;
    } else {
      etatPartie.partieActuelle.reprendre();
    }
  }

  // Branche tous les boutons du livre (couverture, question, languette) sur
  // cette instance. Appelée une seule fois, à la création de l'instance
  // globale "livreDesRegles".
  initialiserEcouteurs() {
    // Cliquer sur la couverture fermée ouvre le livre sur sa première page.
    elementsHTML.couvertureLivre.addEventListener("click", () => {
      elementsHTML.livre.classList.remove("livre-ferme");
      elementsHTML.livre.classList.add("livre-ouvert");
    });

    // "Oui, je souhaite lire les règles" : la page se tourne sur les règles.
    document.getElementById("bouton-lire-regles").addEventListener("click", () => {
      this.afficherPage(elementsHTML.pageRegles);
    });

    // "Non, je ne souhaite pas lire les règles" : phrase affichée 10 secondes
    // puis la partie démarre automatiquement (seulement au tout premier accès).
    document.getElementById("bouton-refuser-regles").addEventListener("click", () => {
      this.afficherPage(elementsHTML.pageBonneChance);
      setTimeout(() => {
        this.fermerEtLancerPartie();
      }, 500);
    });

    // "Lancer la partie" / "Relancer la partie" : referme le livre et
    // démarre ou reprend le jeu.
    elementsHTML.boutonLancerPartie.addEventListener("click", () => {
      this.fermerEtLancerPartie();
    });

    // La languette reste visible pendant toute la partie pour rouvrir le
    // livre (= pause).
    elementsHTML.languetteLivre.addEventListener("click", () => {
      this.ouvrirEnPause();
    });
  }
}

const livreDesRegles = new LivreDesRegles();
livreDesRegles.initialiserEcouteurs();
