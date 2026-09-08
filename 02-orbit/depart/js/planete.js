class Planete {
  constructor(nom, distance, rayon, couleur, vitesse, type) {
    this.nom = nom;
    this.distance = distance;
    this.rayon = rayon;
    this.couleur = couleur;
    this.vitesse = vitesse;
    this.angle = 0;
    this.type = type;
  }

  avancer() {
    this.angle += this.vitesse
  }

  position(cx, cy) {
return {
x: cx + Math.cos(this.angle) * this.distance,
y: cy + Math.sin(this.angle) * this.distance,
};
  }

  dessiner(ctx, cx, cy) {
const lieu = this.position(cx, cy);
ctx.beginPath();
ctx.fillStyle = this.couleur;
ctx.arc(lieu.x, lieu.y, this.rayon, 0, 2 * Math.PI);
ctx.fill();
}

  estGazeuse() {
    return this.type === "gazeuse"
  }
}


const canvas = document.getElementById("ciel");
const ctx = canvas.getContext("2d");
const cx = canvas.width / 2;
const cy = canvas.height / 2;

const systeme = [
new Planete("Mercure", 70, 7, "#b7b3ab", 0.032, "rocheuse"),
new Planete("Terre", 125, 11, "#3d8fd1", 0.018, "rocheuse"),
new Planete("Saturne", 190, 18, "#e6c36a", 0.008, "gazeuse"),
new Planete("Neptune", 240, 13, "#4169c9", 0.005, "gazeuse"),
new Planete("Terre", 125, 11, "#3d8fd1", 0.018, "rocheuse"),
];

function dessinerDecor() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.beginPath();
ctx.fillStyle = "#f5c16c";
ctx.arc(cx, cy, 22, 0, Math.PI * 2);
ctx.fill();
}

const prefereMoins = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let enPause = prefereMoins;
function boucle() {
dessinerDecor();
systeme.forEach((planete) => {
if (!enPause) planete.avancer();
planete.dessiner(ctx, cx, cy);
});
requestAnimationFrame(boucle);
}
boucle();

const boutonPause = document.getElementById("pause");
function etiquettePause() {
boutonPause.textContent = enPause ? "Reprendre" : "Pause";
}
etiquettePause();
boutonPause.addEventListener("click", () => {
enPause = !enPause;
etiquettePause();
});

const fiche = document.getElementById("fiche");
document.querySelectorAll("#noms button").forEach((bouton) => {
bouton.addEventListener("click", () => {
const planete = systeme.find((objet) => objet.nom === bouton.dataset.nom);
if (!planete) return;
const reponse = planete.estGazeuse() ? "oui" : "non";
fiche.textContent = `${planete.nom} — gazeuse : ${reponse}.`;
});
});