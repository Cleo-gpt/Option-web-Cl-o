# Projet Memory — Multijoueur local

Un jeu de Memory (paires de cartes à retrouver) jouable en local, seul contre un ordinateur ou à plusieurs sur le même écran.

## Workflow avec l'agent

À chaque fin de demande formulée par l'utilisateur, l'agent doit pousser (push) les changements vers le dépôt distant.

Quand [MODIF.md](MODIF.md) reçoit une nouvelle entrée, l'agent doit le signaler à l'utilisateur et lui montrer le fichier.

## Structure du projet

```
projet-memory-code/
├── README.md            (ce fichier)
├── index.html            structure de la page (menu, règles, plateau de jeu)
├── style.css              apparence (couleurs, cartes, lumières des joueurs, coeurs)
├── theme-visuel.js        classe ThemeVisuel (données par thème : symboles, images)
├── traducteur.js          classe Traducteur (dictionnaire FR/DE/EN + langue actuelle)
├── carte.js               classe Carte
├── joueur.js              classe Joueur
├── partie.js              classe Partie (cartes, joueurs, tour actuel, chrono, IA)
├── menu.js                classe Menu (configuration choisie, validation)
├── livre-des-regles.js    classe LivreDesRegles (ouverture, pause, pages)
└── code.js                reste de la logique (constantes, éléments HTML, écrans, fin de partie)
```

Pas de framework, pas d'outil de build : on ouvre `index.html` dans le navigateur et ça fonctionne. HTML + CSS + JavaScript "vanilla" uniquement.

## Règles du code à respecter

Ces règles servent à garder le projet simple et lisible, même en avançant petit à petit.

1. **Rester simple (KISS).** Pas de framework (React, Vue, ...), pas de build tool, pas de librairie externe.
2. **Un fichier JS par classe, le reste dans `code.js`.** `ThemeVisuel`, `Traducteur`, `Carte`,
   `Joueur`, `Partie`, `Menu` et `LivreDesRegles` vivent chacune dans leur propre fichier ; tout ce
   qui n'est pas une classe (constantes partagées, éléments HTML, gestion des écrans, fin de
   partie) reste dans `code.js`. Pas d'autre découpage : on ne multiplie pas les petits fichiers
   au-delà de ces 8.
3. **Noms en français.** Variables, fonctions et commentaires sont écrits en français, comme dans le reste du dépôt (ex: `joueurs`, `cartesRetournees`, `melangerCartes()`).
4. **Un commentaire par bloc de logique.** Chaque paragraphe de code un peu complexe (une fonction, une condition importante) doit avoir un court commentaire au-dessus qui explique **à quoi il sert**, pas comment JavaScript fonctionne. Voir l'exemple ci-dessous.
5. **Pas de code mort ni de fonctionnalité inutilisée.** Si une règle du jeu n'est pas demandée (ex: sauvegarde en ligne, comptes utilisateurs), on ne l'ajoute pas "au cas où".
6. **État du jeu centralisé, dans des classes.** La configuration du menu (`menu`, instance de
   `Menu`) et la partie en cours (`partieActuelle`, instance de `Partie`, ou `null` avant qu'une
   partie ne commence) sont chacune un seul objet à lire pour savoir "où on en est" — pas de
   duplication de ces informations ailleurs dans le code.
7. **CSS avec variables.** Les couleurs (dont les couleurs des joueurs et le fond anthracite) sont définies une fois via des variables CSS (`:root { --bleu: ...; }`) et réutilisées, pas recopiées partout.
8. **Se baser sur les ateliers du cours.** Avant toute modification de ce projet, parcourir les PDF "Atelier" des dossiers `01-planetes`, `02-orbit`, `03-donnees-nues`, `06-deux-langages`, `08-json`, `One_button` et `watt` (à la racine du dépôt). Le code écrit ici doit s'appuyer uniquement sur les notions, techniques et façons de faire présentes dans ces ateliers — pas de notion, de méthode ou d'API absente de ces documents, même si elle serait plus simple ou plus idiomatique autrement.
9. **Classes ES6 pour un maximum de structures du jeu.** Toute structure qui a un état propre et
   un comportement associé devient une classe avec `constructor` et méthodes, dans le style vu
   dans les ateliers (`Planete`, `Meule`, `Billet`, `Materiel`) : un constructeur qui affecte
   simplement `this.xxx = xxx` par propriété, des méthodes en camelCase français préfixées par
   `est` pour les prédicats (`estElimine`, `estVisible`, `estComplet`), pas d'héritage, pas de
   getters/setters, pas de champs privés, pas de méthode statique — rien qui ne soit pas déjà
   montré dans ces ateliers. Restent en dehors des classes : les constantes pures qui n'ont pas de
   comportement (`TRADUCTIONS`, `CLASSES_COULEUR_JOUEURS`...) et les quelques fonctions qui ne
   concernent qu'un seul écran simple (gestion des écrans, affichage de fin de partie).

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

## Écarts avec les ateliers

Le détail des écarts entre le code de ce projet et les notions/techniques enseignées dans les
ateliers du cours (règle 8 ci-dessus) est suivi dans [MODIF.md](MODIF.md), pas ici : la liste a
grandi au fil du projet et un fichier dédié reste plus facile à tenir à jour qu'une section de
README.
