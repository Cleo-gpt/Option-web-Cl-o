# Projet Memory — Multijoueur local

Un jeu de Memory (paires de cartes à retrouver) jouable en local, seul contre un ordinateur ou à plusieurs sur le même écran.

## Structure du projet

```
projet-memory-code/
├── README.md        (ce fichier)
├── index.html        structure de la page (menu, règles, plateau de jeu)
├── style.css          apparence (couleurs, cartes, lumières des joueurs, coeurs)
└── code.js            logique du jeu (menu, mélange, tour par tour, vies, chrono)
```

Pas de framework, pas d'outil de build : on ouvre `index.html` dans le navigateur et ça fonctionne. HTML + CSS + JavaScript "vanilla" uniquement.

## Règles du code à respecter

Ces règles servent à garder le projet simple et lisible, même en avançant petit à petit.

1. **Rester simple (KISS).** Pas de framework (React, Vue, ...), pas de build tool, pas de librairie externe. Trois fichiers suffisent : `index.html`, `style.css`, `code.js`.
2. **Un seul fichier JS.** Toute la logique reste dans `code.js`. Pas de multiplication de petits fichiers pour un projet de cette taille.
3. **Noms en français.** Variables, fonctions et commentaires sont écrits en français, comme dans le reste du dépôt (ex: `joueurs`, `cartesRetournees`, `melangerCartes()`).
4. **Un commentaire par bloc de logique.** Chaque paragraphe de code un peu complexe (une fonction, une condition importante) doit avoir un court commentaire au-dessus qui explique **à quoi il sert**, pas comment JavaScript fonctionne. Voir l'exemple ci-dessous.
5. **Pas de code mort ni de fonctionnalité inutilisée.** Si une règle du jeu n'est pas demandée (ex: sauvegarde en ligne, comptes utilisateurs), on ne l'ajoute pas "au cas où".
6. **État du jeu centralisé.** Une seule structure (`etat`) contient l'état courant (scène active, joueurs, cartes, tour actuel...) pour toujours savoir "où on en est" en lisant un seul endroit.
7. **CSS avec variables.** Les couleurs (dont les couleurs des joueurs et le fond anthracite) sont définies une fois via des variables CSS (`:root { --bleu: ...; }`) et réutilisées, pas recopiées partout.

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

Avant de commencer une partie, un menu permet de choisir :

- **Mode de jeu** : contre un ordinateur, ou en multijoueur.
- **Nombre de joueurs** (si multijoueur est choisi).
- **Nombre de cartes** : uniquement des multiples de 4 (ex: 12, 16, 20, 24...), pour que le nombre de paires tombe juste avec la grille.
- **Difficulté du mélange** : Facile, Moyen, Difficile. Plus la difficulté augmente, plus le mélange des cartes est "brouillé" (ex: temps d'observation initial plus court, ou mélange plus poussé).

### 2. Livre des règles

Une fois la configuration validée, un livre de règles s'affiche avant de démarrer la partie. Il rappelle :

- Chaque joueur commence avec **10 coeurs**.
- Une erreur (les deux cartes retournées ne correspondent pas) = **-1 coeur**.
- Une paire trouvée = **+1 coeur**.
- Un joueur qui atteint **0 coeur** est éliminé.
- Le but est de rester en vie jusqu'à la fin de la partie (toutes les paires trouvées).
- Chaque joueur a une **couleur** qui lui est propre. Une **lumière** s'allume à côté du plateau pour indiquer à qui est le tour.
- Chaque joueur a **45 secondes** pour retourner deux cartes lors de son tour.

### 3. Partie

- Un **chronomètre** (minutes : secondes) démarre avec la partie et s'arrête quand toutes les paires sont trouvées, ou qu'il ne reste plus qu'un joueur en vie (ou zéro).
- Un **tour par tour** : à chaque tour, la lumière du joueur actif s'allume, le joueur a 45 secondes pour retourner deux cartes.
- Si le temps est écoulé sans action, cela compte comme une erreur (perte d'un coeur) et on passe au joueur suivant.

## Couleurs des joueurs (lumières)

| Joueur     | Couleur          |
|------------|------------------|
| Joueur 1   | Bleu             |
| Joueur 2   | Vert             |
| Joueur 3   | Rose             |
| Joueur 4   | Jaune            |
| ...        | (autres couleurs à définir si plus de 4 joueurs) |
| Ordinateur | Argenté          |

## Apparence

- Fond du jeu : **anthracite**.
- Chaque joueur est identifiable par sa couleur (lumière + éventuellement bordure de son tour).
