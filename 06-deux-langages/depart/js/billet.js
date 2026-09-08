class Billet {
  constructor(titre, prix, places) {
    this.titre = titre;
    this.prix = prix;
    this.places = places;
  }

  estComplet() {
    /* à vous : règle billet complet */
  }

  prixFinal() {
    /* à vous : règle tarif de dernière minute */
  }
}

/* OBJETS JS
   Étape 2 : créez d’abord seulement paleo.
   Étape 3 : remplacez-le par le tableau affiche des trois billets.
*/

/* AFFICHAGE JS
   Parcourez affiche et créez une carte par billet dans #billets.
   La boucle demande prixFinal() et estComplet() à chaque objet.
*/
