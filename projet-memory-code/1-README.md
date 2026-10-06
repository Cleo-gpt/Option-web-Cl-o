# Projet Memory — Multijoueur local

Un jeu de Memory (paires de cartes à retrouver) jouable en local, seul contre un ordinateur ou à plusieurs sur le même écran.

## Workflow avec l'agent

- À chaque fin de demande, l'agent pousse (push) les changements vers le dépôt distant.
- Quand [2-MODIF.md](2-MODIF.md) reçoit une nouvelle entrée, l'agent le signale à l'utilisateur et lui montre le fichier.

## Structure du projet

Les fichiers portent un préfixe numérique pour se grouper dans cet ordre dans l'explorateur de
fichiers (texte, puis JS, puis HTML/CSS), l'explorateur triant toujours par ordre alphabétique.

```
projet-memory-code/
│
├── Documentation
│   ├── 1-README.md            ce fichier : règles du projet, déroulement du jeu
│   ├── 2-MODIF.md             suivi des écarts avec les ateliers du cours
│   └── 3-LEXIQUE.md           vocabulaire JS et CSS utilisé, expliqué simplement
│
├── Classes du jeu (une par fichier)
│   ├── 4-theme-visuel.js      ThemeVisuel : données par thème (symboles, images)
│   ├── 4-traducteur.js        Traducteur : dictionnaire FR/DE/EN + langue actuelle
│   ├── 4-carte.js             Carte
│   ├── 4-joueur.js            Joueur
│   ├── 4-menu.js              Menu : configuration choisie, validation
│   ├── 4-partie.js            Partie : cartes, joueurs, tour actuel, chrono, IA
│   └── 4-livre-des-regles.js  LivreDesRegles : ouverture, pause, pages
│
├── 4-code.js                  reste de la logique (constantes, éléments HTML, écrans, fin de partie)
│
├── Page et apparence
│   ├── 5-index.html           structure de la page (menu, règles, plateau de jeu)
│   └── 6-style.css            apparence (couleurs, cartes, lumières des joueurs, coeurs)
│
└── images/themes/             images de cartes, un dossier par thème visuel
    ├── anime/                   28 symboles (symbole-01.png à symbole-28.png) + dos.svg
    ├── communaute/
    ├── japon/
    ├── mediamatique/
    └── youtube/
```

Pas de framework, pas d'outil de build : on ouvre `5-index.html` dans le navigateur et ça fonctionne. HTML + CSS + JavaScript "vanilla" uniquement.

## Règles du code à respecter

Ces règles gardent le projet simple et lisible, même en avançant petit à petit.

1. **Rester simple (KISS).** Pas de framework, pas de build tool, pas de librairie externe.
2. **Un fichier JS par classe, le reste dans `4-code.js`.** `ThemeVisuel`, `Traducteur`, `Carte`, `Joueur`, `Partie`, `Menu` et `LivreDesRegles` ont chacune leur fichier ; le reste va dans `4-code.js`. Pas d'autre découpage au-delà de ces 8 fichiers.
3. **Noms en français.** Variables, fonctions et commentaires en français (`joueurs`, `melangerCartes()`...).
4. **Un commentaire par bloc de logique.** Chaque fonction ou condition un peu complexe a un court commentaire au-dessus qui explique **à quoi elle sert**. Voir l'exemple ci-dessous.
5. **Pas de code mort ni de fonctionnalité inutilisée.** Une règle du jeu non demandée ne s'ajoute pas "au cas où".
6. **État du jeu centralisé, dans des classes.** `menu` et `partieActuelle` (ou `null` avant le début d'une partie) sont chacun un seul objet à lire pour savoir "où on en est".
7. **CSS avec variables.** Les couleurs sont définies une fois via des variables CSS (`:root { --bleu: ...; }`) et réutilisées.
8. **Se baser sur les ateliers du cours.** Le code ne doit utiliser que des notions présentes dans les PDF "Atelier" à la racine du dépôt (`01-planetes`, `02-orbit`, `03-donnees-nues`, `06-deux-langages`, `08-json`, `One_button`, `watt`, `02-sas-poo/projets` et ses sous-dossiers) — même si une autre approche serait plus simple.
9. **Classes ES6 pour un maximum de structures du jeu.** Constructeur en `this.xxx = xxx`, méthodes en camelCase français préfixées par `est` pour les prédicats (`estElimine`...), sans héritage, getters/setters, champs privés ni méthode statique — dans le style des ateliers (`Planete`, `Meule`...).

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

- **Mode de jeu** : contre un ordinateur, ou en multijoueur.
- **Nombre de joueurs** (si multijoueur).
- **Nombre de cartes** : un multiple de 4 (12, 16, 20...), pour que les paires tombent juste.
- **Difficulté du mélange** : Facile, Moyen, Difficile — plus c'est difficile, plus le mélange est poussé.

### 2. Livre des règles

Affiché une fois la configuration validée, avant de démarrer la partie :

- Chaque joueur commence avec **10 coeurs**.
- Une erreur (les 2 cartes ne correspondent pas) = **-1 coeur** ; une paire trouvée = **+1 coeur**.
- À **0 coeur**, un joueur est éliminé. Le but : rester en vie jusqu'à la fin de la partie.
- Chaque joueur a une **couleur** ; une **lumière** indique à qui est le tour.
- **45 secondes** par tour pour retourner deux cartes.

### 3. Partie

- Un **chronomètre** démarre avec la partie et s'arrête à la victoire ou quand il ne reste plus qu'un joueur en vie (ou zéro).
- **Tour par tour** : la lumière du joueur actif s'allume, 45 secondes pour retourner 2 cartes.
- Temps écoulé sans action = une erreur (perte d'un coeur), puis joueur suivant.

## Couleurs des joueurs (lumières)

| Joueur     | Couleur |
|------------|---------|
| Joueur 1   | Bleu    |
| Joueur 2   | Vert    |
| Joueur 3   | Rose    |
| Joueur 4   | Jaune   |
| ...        | (autres couleurs à définir si plus de 4 joueurs) |
| Ordinateur | Argenté |

## Apparence

- Fond du jeu : **anthracite**.
- Chaque joueur est identifiable par sa couleur (lumière + éventuellement bordure de son tour).

## Écarts avec les ateliers

Le détail des écarts entre le code et les ateliers (règle 8) est suivi dans [2-MODIF.md](2-MODIF.md), pas ici.
