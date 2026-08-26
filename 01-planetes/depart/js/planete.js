class Planete {
  constructor(nom, distanceUa, satellites, type) {
    this.nom = nom;
    this.distanceUa = distanceUa;
    this.satellites = satellites;
    this.type = type;
  }

  
  estGazeuse() {
    /* à vous : une ligne */
return this.type === "gazeuse";
  }

  plusLoinQue(autre) {
    /* à vous : une ligne */
    return this.distanceUa > autre.distanceUa;
  }
}

/* Étape 2 : fabriquez seulement Terre ici. */
const catalogue = [
new Planete("Mercure", 0.39, 0, "rocheuse"),
new Planete("Terre", 1, 1, "rocheuse"),
new Planete("Saturne", 9.5, 146, "gazeuse"),
new Planete("Neptune", 30, 16, "gazeuse"),
];
/* Étape 5 : affichage */
const liste = document.getElementById("liste");

catalogue.forEach((planete) => {
  const gazeuse = planete.estGazeuse();
  const article = document.createElement("article");
  article.className = "fiche";
  article.innerHTML = `
    <h3>${planete.nom}</h3>
    <dl>
      <dt>Distance</dt><dd>${planete.distanceUa} UA</dd>
      <dt>Satellites</dt><dd>${planete.satellites}</dd>
      <dt>Type</dt><dd>${planete.type}</dd>
    </dl>
    <p class="badge ${gazeuse ? "badge--oui" : "badge--non"}">
      Gazeuse : ${gazeuse ? "oui" : "non"}
    </p>`;
  liste.appendChild(article);
});

const terre = catalogue[1];
const saturne = catalogue[2];
document.getElementById("comparaison").textContent =
  saturne.plusLoinQue(terre)
    ? "Saturne.plusLoinQue(Terre) répond oui."
    : "Vérifiez les distances des deux objets.";
