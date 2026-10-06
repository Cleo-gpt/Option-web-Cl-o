# Projet Memory — Multijoueur local

Un jeu de Memory (paires de cartes à retrouver)
jouable en local, seul contre un ordinateur ou
à plusieurs sur le même écran.

## Workflow avec l'agent

- À chaque fin de demande, l'agent pousse (push)
  les changements vers le dépôt distant.
- Quand [2-MODIF.md](2-MODIF.md) reçoit une
  nouvelle entrée, l'agent le signale et montre
  le fichier.

## Structure du projet

Préfixe numérique sur chaque fichier pour les
grouper dans l'explorateur (texte, puis JS,
puis HTML/CSS), qui trie par ordre alphabétique.

```
projet-memory-code/
│
├── Documentation
│   ├── 1-README.md          ce fichier
│   ├── 2-MODIF.md           écarts avec le cours
│   └── 3-LEXIQUE.md         vocabulaire JS/CSS
│
├── Classes du jeu (une par fichier)
│   ├── 4-theme-visuel.js    ThemeVisuel
│   ├── 4-traducteur.js      Traducteur
│   ├── 4-carte.js           Carte
│   ├── 4-joueur.js          Joueur
│   ├── 4-menu.js            Menu
│   ├── 4-partie.js          Partie
│   └── 4-livre-des-regles.js LivreDesRegles
│
├── 4-code.js                reste de la logique
│
├── Page et apparence
│   ├── 5-index.html         structure de la page
│   └── 6-style.css          apparence
│
└── images/themes/           images par thème
    ├── anime/
    ├── communaute/
    ├── japon/
    ├── mediamatique/
    └── youtube/
```

Chaque dossier de thème a 28 symboles PNG
(symbole-01.png à symbole-28.png) + un dos.svg.

Pas de framework, pas d'outil de build : on ouvre
`5-index.html` dans le navigateur et ça fonctionne.
HTML + CSS + JavaScript "vanilla" uniquement.

## Règles du code à respecter

Ces règles gardent le projet simple et lisible,
même en avançant petit à petit.

1. **Rester simple (KISS).**
   Pas de framework, pas de build tool, pas de
   librairie externe.

2. **Un fichier JS par classe, le reste dans `4-code.js`.**
   `ThemeVisuel`, `Traducteur`, `Carte`, `Joueur`,
   `Partie`, `Menu` et `LivreDesRegles` ont chacune
   leur fichier. Pas d'autre découpage au-delà de
   ces 8 fichiers.

3. **Noms en français.**
   Variables, fonctions et commentaires en français
   (`joueurs`, `melangerCartes()`...).

4. **Un commentaire par bloc de logique.**
   Chaque fonction ou condition un peu complexe a
   un court commentaire qui explique **à quoi elle
   sert**. Voir l'exemple ci-dessous.

5. **Pas de code mort ni de fonctionnalité inutilisée.**
   Une règle du jeu non demandée ne s'ajoute pas
   "au cas où".

6. **État du jeu centralisé, dans des classes.**
   `menu` et `partieActuelle` (ou `null` avant le
   début d'une partie) sont chacun un seul objet
   à lire pour savoir "où on en est".

7. **CSS avec variables.**
   Les couleurs sont définies une fois via des
   variables CSS (`:root { --bleu: ...; }`) et
   réutilisées.

8. **Se baser sur les ateliers du cours.**
   Le code ne doit utiliser que des notions
   présentes dans les PDF "Atelier" à la racine
   du dépôt (`01-planetes`, `02-orbit`,
   `03-donnees-nues`, `06-deux-langages`,
   `08-json`, `One_button`, `watt`,
   `02-sas-poo/projets` et ses sous-dossiers).

9. **Classes ES6 pour un maximum de structures du jeu.**
   Constructeur en `this.xxx = xxx`, méthodes en
   camelCase français préfixées par `est` pour
   les prédicats (`estElimine`...), sans héritage,
   getters/setters, champs privés ni méthode
   statique — dans le style des ateliers
   (`Planete`, `Meule`...).

### Exemple de commentaire attendu

```js
// Vérifie si les deux cartes retournées forment une paire.
// Si oui : le joueur gagne un coeur. Si non : il en perd un.
function verifierPaire(carteA, carteB) {
  if (carteA.valeur === carteB.valeur) {
    gagnerCoeur(etat.joueurActuel);
  } else {
    perdreCoeur(etat.joueurActuel);
  }
}
```

## Déroulement du jeu

### 1. Menu de configuration

- **Mode de jeu** : contre un ordinateur, ou en
  multijoueur.
- **Nombre de joueurs** (si multijoueur).
- **Nombre de cartes** : un multiple de 4 (12,
  16, 20...), pour que les paires tombent juste.
- **Difficulté du mélange** : Facile, Moyen,
  Difficile — plus c'est difficile, plus le
  mélange est poussé.

### 2. Livre des règles

Affiché une fois la configuration validée,
avant de démarrer la partie :

- Chaque joueur commence avec **10 coeurs**.
- Une erreur = **-1 coeur** ; une paire trouvée
  = **+1 coeur**.
- À **0 coeur**, un joueur est éliminé. Le but :
  rester en vie jusqu'à la fin de la partie.
- Chaque joueur a une **couleur** ; une
  **lumière** indique à qui est le tour.
- **45 secondes** par tour pour retourner deux
  cartes.

### 3. Partie

- Un **chronomètre** démarre avec la partie et
  s'arrête à la victoire ou quand il ne reste
  plus qu'un joueur en vie (ou zéro).
- **Tour par tour** : la lumière du joueur actif
  s'allume, 45 secondes pour retourner 2 cartes.
- Temps écoulé sans action = une erreur, puis
  joueur suivant.

## Couleurs des joueurs (lumières)

| Joueur     | Couleur |
|------------|---------|
| Joueur 1   | Bleu    |
| Joueur 2   | Vert    |
| Joueur 3   | Rose    |
| Joueur 4   | Jaune   |
| Ordinateur | Argenté |

(Autres couleurs à définir si plus de 4 joueurs.)

## Apparence

- Fond du jeu : **anthracite**.
- Chaque joueur est identifiable par sa couleur
  (lumière + éventuellement bordure de son tour).

## Écarts avec les ateliers

Le détail des écarts (règle 8) est suivi dans
[2-MODIF.md](2-MODIF.md), pas ici.
