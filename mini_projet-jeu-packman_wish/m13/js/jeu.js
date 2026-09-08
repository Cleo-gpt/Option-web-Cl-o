const scene = document.getElementById("scene");
const personnage = document.getElementById("personnage");
const scoreEl = document.getElementById("score");
const victoireEl = document.getElementById("victoire");

const LARGEUR_SCENE = scene.clientWidth;
const LARGEUR_PERSO = 40;
const LARGEUR_LUMIERE = 20;
const VITESSE = 6;
const DUREE_VIE_MS = 5000;
const NB_LUMIERES_SIMULTANEES = 2;
const NB_LUMIERES_TOTAL = 10;

const centreMin = LARGEUR_PERSO / 2;
const centreMax = LARGEUR_SCENE - LARGEUR_PERSO / 2;

let position = 0;
let direction = 1; // 1 = regarde à droite, -1 = regarde à gauche
let score = 0;
const touches = {};
const lumieresActives = [];

function positionAleatoireDansLeDos() {
  // "dans le dos" = côté opposé à la direction du regard du personnage
  const centrePerso = position + LARGEUR_PERSO / 2;
  let min, max;
  if (direction === 1) {
    // regarde à droite -> dos à gauche
    min = centreMin;
    max = Math.max(centreMin, centrePerso - LARGEUR_PERSO);
  } else {
    // regarde à gauche -> dos à droite
    min = Math.min(centreMax, centrePerso + LARGEUR_PERSO);
    max = centreMax;
  }
  if (max <= min) {
    return Math.round((centreMin + centreMax) / 2);
  }
  return Math.round(min + Math.random() * (max - min));
}

function creerLumiere() {
  const el = document.createElement("div");
  el.className = "lumiere";
  const x = positionAleatoireDansLeDos();
  el.style.left = x + "px";
  scene.appendChild(el);

  const lumiere = { el, x };
  lumiere.minuteur = setTimeout(() => faireDisparaitre(lumiere), DUREE_VIE_MS);
  lumieresActives.push(lumiere);
}

function faireDisparaitre(lumiere) {
  const index = lumieresActives.indexOf(lumiere);
  if (index === -1) return;
  lumieresActives.splice(index, 1);
  lumiere.el.classList.add("disparition");
  lumiere.el.addEventListener("animationend", () => lumiere.el.remove(), { once: true });
  remplacerLumiere();
}

function remplacerLumiere() {
  if (score < NB_LUMIERES_TOTAL) {
    creerLumiere();
  }
}

function majScore() {
  scoreEl.textContent = `Lumières : ${score} / ${NB_LUMIERES_TOTAL}`;
  if (score === NB_LUMIERES_TOTAL) {
    victoireEl.classList.remove("cachee");
  }
}

function verifierCollisions() {
  for (const lumiere of lumieresActives.slice()) {
    const distance = Math.abs(position + LARGEUR_PERSO / 2 - lumiere.x);
    if (distance < (LARGEUR_PERSO + LARGEUR_LUMIERE) / 2) {
      clearTimeout(lumiere.minuteur);
      lumiere.el.remove();
      const index = lumieresActives.indexOf(lumiere);
      if (index !== -1) lumieresActives.splice(index, 1);
      score++;
      majScore();
      if (score < NB_LUMIERES_TOTAL) {
        remplacerLumiere();
      }
    }
  }
}

function boucle() {
  if (touches["ArrowRight"]) {
    position += VITESSE;
    direction = 1;
  }
  if (touches["ArrowLeft"]) {
    position -= VITESSE;
    direction = -1;
  }
  position = Math.max(0, Math.min(LARGEUR_SCENE - LARGEUR_PERSO, position));
  personnage.style.left = position + "px";
  personnage.classList.toggle("regarde-gauche", direction === -1);

  verifierCollisions();

  if (score < NB_LUMIERES_TOTAL) {
    requestAnimationFrame(boucle);
  }
}

window.addEventListener("keydown", (e) => {
  touches[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  touches[e.key] = false;
});

for (let i = 0; i < NB_LUMIERES_SIMULTANEES; i++) {
  creerLumiere();
}
majScore();
boucle();
