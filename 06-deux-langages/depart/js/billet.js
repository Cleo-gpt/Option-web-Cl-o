class Billet {
  constructor(titre, prix, places) {
    this.titre = titre;
    this.prix = prix;
    this.places = places;
  }

  estComplet() {
    return this.places < 0;
  }

  prixFinal() {
    if (this.places < 3) {
      return this.prix * 0.9;
    }
    return this.prix;
  }
}

const affiche = [
  new Billet("Paléo, grande scène — samedi", 45, 0),
  new Billet("Club de la Gare — jazz", 22, 2),
  new Billet("Salle des fêtes — chorale", 12, 80)
];

const racine = document.getElementById("billets");

affiche.forEach((billet) => {
const article = document.createElement("article");
article.className = "fiche";
const prix = billet.prixFinal().toFixed(2).replace(".", ",");
article.innerHTML = `
<h3>${billet.titre}</h3>
<p>${billet.places} places · ${prix} francs</p>
<p class="badge">${billet.estComplet() ? "Complet" : "Ouvert"}</p>
`;
racine.appendChild(article);
});