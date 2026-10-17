// ===================================================================
// CLASSE SÉRIE PARTIES
//
// Représente une série de plusieurs parties consécutives jouées avec la
// même configuration (mode, joueurs, thème, nombre de cartes, difficulté),
// choisie dans le menu quand le mode est "multi" ou "ordinateur" (voir
// Menu.plusieursPartiesPossibles() dans 4-menu.js). Garde le résultat de
// chaque partie jouée, lance automatiquement la partie suivante dès
// qu'une partie se termine, et déclenche l'écran de fin (avec un tableau
// récapitulatif de toutes les parties) une fois la série complète.
//
// Fichier : 4-serie-parties.js (classe entière). Pas d'instance globale :
// une nouvelle instance est créée à chaque validation du menu (voir
// 4-menu.js), et reste accessible via etatPartie.serieActuelle.
// ===================================================================
class SerieParties {
  constructor(mode, nbJoueurs, difficulteOrdi, theme, nbCartes, difficulte, nbParties) {
    this.mode = mode;
    this.nbJoueurs = nbJoueurs;
    this.difficulteOrdi = difficulteOrdi;
    this.theme = theme;
    this.nbCartes = nbCartes;
    this.difficulte = difficulte;
    this.nbParties = nbParties;

    this.resultats = []; // { dernierResultat, joueurs } de chaque partie déjà terminée
  }

  // Vrai si la série comporte plusieurs parties (sinon, le jeu se comporte
  // exactement comme avant : une seule partie, écran de fin classique).
  estMultiPartie() {
    return this.nbParties > 1;
  }

  estTerminee() {
    return this.resultats.length >= this.nbParties;
  }

  // Numéro de la partie en train d'être jouée (1 pour la première).
  numeroPartieActuelle() {
    return this.resultats.length + 1;
  }

  // Crée et démarre une nouvelle partie avec la même configuration que les
  // précédentes de la série (nouveau mélange des cartes, joueurs remis à
  // 10 coeurs via le constructeur de Joueur).
  demarrerPartieSuivante() {
    etatPartie.partieActuelle = new Partie(this.mode, this.nbJoueurs, this.difficulteOrdi, this.theme, this.nbCartes, this.difficulte);
  }

  // Enregistre le résultat de la partie qui vient de se terminer : son
  // issue (victoire/défaite) et l'état final de chaque joueur (coeurs,
  // paires trouvées, temps moyens). La partie ne touche plus ses joueurs
  // une fois terminée, donc garder la référence suffit (pas besoin de
  // recopier chaque Joueur).
  enregistrerResultatPartie(partie) {
    this.resultats.push({
      dernierResultat: partie.dernierResultat,
      joueurs: partie.joueurs,
    });
  }

  // Le gagnant d'une partie donnée de la série : le joueur qui y a trouvé
  // le plus de paires. Retourne null en cas d'égalité parfaite (personne
  // ne se détache).
  gagnantPartie(resultat) {
    let meilleur = resultat.joueurs[0];
    for (const joueur of resultat.joueurs) {
      if (joueur.pairesTrouvees > meilleur.pairesTrouvees) {
        meilleur = joueur;
      }
    }

    let nbMeilleurs = 0;
    for (const joueur of resultat.joueurs) {
      if (joueur.pairesTrouvees === meilleur.pairesTrouvees) {
        nbMeilleurs++;
      }
    }

    return nbMeilleurs === 1 ? meilleur : null;
  }

  // Le gagnant de la série entière : celui qui a gagné le plus de parties
  // (voir gagnantPartie()). En cas d'égalité, départagé par le total de
  // paires trouvées cumulées sur toute la série. Retourne null si, même
  // avec ce départage, personne ne se détache.
  gagnantSerie() {
    // Une ligne de stats cumulées par joueur (index dans this.resultats[0].joueurs,
    // le même joueur occupe toujours le même index d'une partie à l'autre).
    const statsCumulees = [];
    for (const joueur of this.resultats[0].joueurs) {
      statsCumulees.push({ joueur: joueur, nbVictoires: 0, totalPaires: 0 });
    }

    this.resultats.forEach((resultat) => {
      const gagnant = this.gagnantPartie(resultat);
      resultat.joueurs.forEach((joueur, index) => {
        statsCumulees[index].totalPaires += joueur.pairesTrouvees;
        if (joueur === gagnant) {
          statsCumulees[index].nbVictoires += 1;
        }
      });
    });

    let meilleur = statsCumulees[0];
    for (const stats of statsCumulees) {
      if (
        stats.nbVictoires > meilleur.nbVictoires
        || (stats.nbVictoires === meilleur.nbVictoires && stats.totalPaires > meilleur.totalPaires)
      ) {
        meilleur = stats;
      }
    }

    let nbMeilleurs = 0;
    for (const stats of statsCumulees) {
      if (stats.nbVictoires === meilleur.nbVictoires && stats.totalPaires === meilleur.totalPaires) {
        nbMeilleurs++;
      }
    }

    return nbMeilleurs === 1 ? meilleur.joueur : null;
  }
}
