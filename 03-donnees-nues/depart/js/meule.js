const joursGruyere = 90;
const poidsGruyere = 6;

const joursTomme = 90;
const poidsTomme = 6;

const joursSerac = 90;
const poidsSerac = 6;

let verdictGruyere;
if (joursGruyere >= 60 && poidsGruyere >= 4) {
verdictGruyere = "oui";
} else {
verdictGruyere = "non";
}
console.log(verdictGruyere);

let verdictTomme;
if (joursTomme >= 60 && poidsTomme >= 4) {
verdictTomme = "oui";
} else {
verdictTomme = "non";
}
console.log(verdictTomme);

let verdictSerac;
if (joursSerac >= 60 && poidsSerac >= 4) {
verdictSerac = "oui";
} else {
verdictSerac = "non";
}
console.log(verdictSerac);

class Meule {
  constructor(nom, joursAffinage, poidsKg) {
    this.nom = nom;
    this.joursAffinage = joursAffinage;
    this.poidsKg = poidsKg;
  }

  estPret() {
  if (this.joursAffinage >= 60 && this.poidsKg >= 4) {
    return true;
  } else {
    return false;
  }
}

}

/* Étape 4 : fabriquez seulement le Gruyère ici. */

/* Étape 5 : remplacez l’objet de test par la cave et son affichage. */
