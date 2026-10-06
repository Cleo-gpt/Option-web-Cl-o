# Projet Memory — Multijoueur local

Un jeu de Memory (paires de cartes à retrouver) jouable
en local, seul contre un ordinateur ou à plusieurs sur
le même écran.

## Workflow avec l'agent

- À chaque fin de demande, l'agent pousse (push) les
  changements vers le dépôt distant.

- Quand [2-MODIF.md](2-MODIF.md) reçoit une nouvelle
  entrée, l'agent le signale et montre le fichier.

## Structure du projet

Préfixe numérique sur chaque fichier pour les grouper
dans l'explorateur (texte, puis JS, puis HTML/CSS).

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

Chaque dossier de thème a 28 symboles PNG + un dos.svg.

Pas de framework, pas d'outil de build : on ouvre
`5-index.html` dans le navigateur et ça fonctionne.
HTML + CSS + JavaScript "vanilla" uniquement.

## Règles du code à respecter

Ces règles gardent le projet simple et lisible.

1. Rester simple (KISS)
   Pas de framework, build tool, ni librairie externe.

2. Un fichier JS par classe, le reste dans `4-code.js`
   8 fichiers au total, pas d'autre découpage.

3. Noms en français
   Variables, fonctions, commentaires en français.

4. Un commentaire par bloc de logique
   Explique à quoi sert le code, pas comment
   JavaScript fonctionne. Voir l'exemple ci-dessous.

5. Pas de code mort ni de fonctionnalité inutilisée
   Une règle non demandée ne s'ajoute pas "au cas où".

6. État du jeu centralisé, dans des classes
   `menu` et `partieActuelle` sont chacun un seul objet
   à lire pour savoir "où on en est".

7. CSS avec variables
   Les couleurs sont définies une fois (`:root`) et
   réutilisées partout.

8. Se baser sur les ateliers du cours
   Le code n'utilise que des notions présentes dans
   les PDF "Atelier" à la racine du dépôt.

9. Classes ES6 pour un maximum de structures du jeu
   Constructeur en `this.xxx = xxx`, prédicats
   préfixés par `est`, sans héritage, getters/setters,
   champs privés ni méthode statique.

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

- Mode de jeu : contre un ordinateur, ou en
  multijoueur.

- Nombre de joueurs (si multijoueur).

- Nombre de cartes : un multiple de 4 (12, 16,
  20...), pour que les paires tombent juste.

- Difficulté du mélange : Facile, Moyen, Difficile.

### 2. Livre des règles

Affiché une fois la configuration validée :

- Chaque joueur commence avec 10 coeurs.

- Une erreur = -1 coeur ; une paire trouvée =
  +1 coeur.

- À 0 coeur, un joueur est éliminé.

- Chaque joueur a une couleur et une lumière
  qui indique à qui est le tour.

- 45 secondes par tour pour retourner deux cartes.

### 3. Partie

- Un chronomètre démarre avec la partie.

- Tour par tour : la lumière du joueur actif
  s'allume, 45 secondes pour jouer.

- Temps écoulé sans action = une erreur, puis joueur
  suivant.

## Couleurs des joueurs (lumières)

| Joueur     | Couleur |
|------------|---------|
| Joueur 1   | Bleu    |
| Joueur 2   | Vert    |
| Joueur 3   | Rose    |
| Joueur 4   | Jaune   |
| Ordinateur | Argenté |

## Apparence

- Fond du jeu : anthracite.

- Chaque joueur est identifiable par sa couleur.

## Écarts avec les ateliers

Le détail des écarts (règle 8) est suivi dans
[2-MODIF.md](2-MODIF.md), pas ici.
