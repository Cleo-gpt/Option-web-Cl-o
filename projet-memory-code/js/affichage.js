// ===================================================================
// AFFICHAGE DES JOUEURS (colonne de gauche : lumière + nom + coeurs)
// ===================================================================
function afficherJoueurs() {
  listeJoueurs.innerHTML = "";

  etat.joueurs.forEach((joueur, index) => {
    const ligne = document.createElement("div");
    ligne.className = `ligne-joueur ${joueur.classeCouleur}`;
    ligne.classList.toggle("elimine", joueur.coeurs <= 0); // reste correct si on retraduit en cours de partie
    ligne.id = `ligne-joueur-${index}`;

    const nomCouleur = joueur.estRobot ? t("couleur-argente") : t(CLES_TRADUCTION_COULEURS[index]);
    ligne.innerHTML = `
      <span class="lumiere"></span>
      <span>${nomJoueur(joueur)} (${nomCouleur})</span>
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

// Nombre de colonnes qui rapproche le plus la grille d'un carré, quel que
// soit le nombre de cartes (ex: 16 → 4 colonnes, 72 → 9 colonnes, la
// dernière ligne pouvant rester incomplète).
function calculerNbColonnesGrille(nbCartes) {
  return Math.ceil(Math.sqrt(nbCartes));
}

function afficherCartes() {
  grilleCartes.innerHTML = "";
  const nbColonnes = calculerNbColonnesGrille(etat.cartes.length);
  grilleCartes.style.gridTemplateColumns = `repeat(${nbColonnes}, 70px)`;

  etat.cartes.forEach((carte) => {
    const bouton = document.createElement("button");
    bouton.className = "carte";
    bouton.id = `carte-${carte.id}`;
    bouton.addEventListener("click", () => choisirCarte(carte.id));

    // Le dos (face cachée) est posé en CSS via background-image (voir .carte
    // dans style.css) : il suit automatiquement le thème choisi. Seule l'image
    // du symbole (face visible) est gérée ici, une fois la carte retournée.
    const imageSymbole = document.createElement("img");
    imageSymbole.className = "image-symbole-carte";
    imageSymbole.src = cheminSymboleCarte(etat.theme, carte.numeroSymbole);
    imageSymbole.alt = "";
    imageSymbole.hidden = true;
    bouton.appendChild(imageSymbole);

    grilleCartes.appendChild(bouton);
  });
}

// Met à jour l'apparence d'une carte en fonction de son état (cachée / retournée / trouvée).
function rafraichirCarte(carte) {
  const bouton = document.getElementById(`carte-${carte.id}`);
  bouton.classList.toggle("retournee", carte.retournee);
  bouton.classList.toggle("trouvee", carte.trouvee);
  bouton.querySelector(".image-symbole-carte").hidden = !(carte.retournee || carte.trouvee);
}
