class Materiel {
  constructor(nom, salle, emprunteur) {
    this.nom = nom;
    this.salle = salle;
    this.emprunteur = emprunteur;
  }

  estDispo() {
    /* à vous : retournez vrai quand emprunteur est une chaîne vide */
  }

  emprunter(qui) {
    /* à vous : remplacez l’emprunteur par qui */
  }

  rendre() {
    /* à vous : remettez une chaîne vide */
  }
}

let stock = [];

function versJson() {
  return JSON.stringify(
    stock.map((materiel) => ({
      nom: materiel.nom,
      salle: materiel.salle,
      emprunteur: materiel.emprunteur,
    })),
    null,
    2
  );
}

function afficher() {
  const cartes = document.getElementById("cartes");
  cartes.innerHTML = "";

  stock.forEach((item) => {
    const dispo = item.estDispo();
    const article = document.createElement("article");
    article.className = "fiche";
    article.innerHTML = `
      <h3>${item.nom}</h3>
      <dl>
        <dt>Salle</dt><dd>${item.salle}</dd>
        <dt>Emprunteur</dt><dd>${dispo ? "—" : item.emprunteur}</dd>
      </dl>
      <p class="badge ${dispo ? "badge--oui" : "badge--non"}">
        ${dispo ? "Disponible" : "Sorti"}
      </p>`;

    const bouton = document.createElement("button");
    bouton.type = "button";
    bouton.textContent = dispo ? "Emprunter (Nora)" : "Rendre";
    bouton.addEventListener("click", () => {
      if (item.estDispo()) item.emprunter("Nora");
      else item.rendre();
      afficher();
    });

    article.appendChild(bouton);
    cartes.appendChild(article);
  });

  document.getElementById("json").textContent = versJson();
}

function charger(lignes) {
  stock = lignes.map(
    (ligne) => new Materiel(ligne.nom, ligne.salle, ligne.emprunteur)
  );
  afficher();
}

charger(JSON.parse(document.getElementById("source").textContent));

fetch("data/prets.json")
  .then((reponse) => {
    if (!reponse.ok) throw new Error("fichier introuvable");
    return reponse.json();
  })
  .then((lignes) => {
    charger(lignes);
    document.getElementById("etat").textContent =
      `${lignes.length} objets lus depuis data/prets.json.`;
  })
  .catch(() => {
    document.getElementById("etat").textContent =
      "Page ouverte par double-clic : les trois lignes intégrées ont été lues.";
  });
