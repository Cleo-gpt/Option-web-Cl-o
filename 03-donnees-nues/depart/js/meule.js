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

const cave = [
new Meule("Gruyère d’alpage", 90, 6),
new Meule("Tomme jeune", 20, 5),
new Meule("Sérac léger", 70, 2),
];

const liste = document.getElementById("liste");
cave.forEach((meule) => {
const pret = meule.estPret();
const article = document.createElement("article");
article.className = "fiche";
article.innerHTML = `
<h3>${meule.nom}</h3>
<dl>
<dt>Affinage</dt><dd>${meule.joursAffinage} jours</dd>
<dt>Poids</dt><dd>${meule.poidsKg} kg</dd>
</dl>
<p class="badge ${pret ? "badge--oui" : "badge--non"}">
Prête : ${pret ? "oui" : "non"}
</p>`;
liste.appendChild(article);
})