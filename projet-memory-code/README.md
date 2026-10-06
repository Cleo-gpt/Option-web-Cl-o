# Projet Memory — Multijoueur local

Un jeu de Memory (paires de cartes à retrouver) jouable en local, seul contre un ordinateur ou à plusieurs sur le même écran.

## Workflow avec l'agent

- À chaque fin de demande, l'agent pousse (push) les changements vers le dépôt distant.
- Quand [MODIF.md](MODIF.md) reçoit une nouvelle entrée, l'agent le signale à l'utilisateur et lui montre le fichier.

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

Ces règles gardent le projet simple et lisible, même en avançant petit à petit.

1. **Rester simple (KISS).**
   Pas de framework, pas de build tool, pas de librairie externe.

2. **Un fichier JS par classe, le reste dans `code.js`.**
   `ThemeVisuel`, `Traducteur`, `Carte`, `Joueur`, `Partie`, `Menu` et `LivreDesRegles` vivent
   chacune dans leur propre fichier. Le reste (constantes, éléments HTML, écrans, fin de partie)
   va dans `code.js`. Pas d'autre découpage au-delà de ces 8 fichiers.

3. **Noms en français.**
   Variables, fonctions et commentaires en français (`joueurs`, `cartesRetournees`,
   `melangerCartes()`...).

4. **Un commentaire par bloc de logique.**
   Chaque fonction ou condition un peu complexe a un court commentaire au-dessus qui explique
   **à quoi elle sert**, pas comment JavaScript fonctionne. Voir l'exemple ci-dessous.

5. **Pas de code mort ni de fonctionnalité inutilisée.**
   Une règle du jeu non demandée (sauvegarde en ligne, comptes utilisateurs...) ne s'ajoute pas
   "au cas où".

6. **État du jeu centralisé, dans des classes.**
   `menu` (instance de `Menu`) et `partieActuelle` (instance de `Partie`, ou `null` avant le
   début d'une partie) sont chacun un seul objet à lire pour savoir "où on en est" — pas de
   duplication ailleurs dans le code.

7. **CSS avec variables.**
   Les couleurs (joueurs, fond anthracite...) sont définies une fois via des variables CSS
   (`:root { --bleu: ...; }`) et réutilisées, pas recopiées partout.

8. **Se baser sur les ateliers du cours.**
   Avant toute modification, parcourir les PDF "Atelier" des dossiers suivants, à la racine du
   dépôt : `01-planetes`, `02-orbit`, `03-donnees-nues`, `06-deux-langages`, `08-json`,
   `One_button`, `watt`, et `02-sas-poo/projets` avec tous ses sous-dossiers (`02-orbites`,
   `05-commande`, `06-deux-langages`, `07-catalogue`, `08-json`, `02-sas-poo/support`).
   Le code ne doit utiliser que des notions, techniques et façons de faire présentes dans ces
   ateliers — même si une autre approche serait plus simple ou plus idiomatique.

9. **Classes ES6 pour un maximum de structures du jeu.**
   Toute structure avec un état propre et un comportement devient une classe, dans le style des
   ateliers (`Planete`, `Meule`, `Billet`, `Materiel`) : constructeur en `this.xxx = xxx`,
   méthodes en camelCase français préfixées par `est` pour les prédicats (`estElimine`,
   `estVisible`, `estComplet`), sans héritage, getters/setters, champs privés ni méthode
   statique. Restent hors classe : les constantes pures (`TRADUCTIONS`,
   `CLASSES_COULEUR_JOUEURS`...) et les fonctions d'un seul écran simple (gestion des écrans,
   affichage de fin de partie).

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
- **Difficulté du mélange** : Facile, Moyen, Difficile — plus c'est difficile, plus le mélange
  est poussé.

### 2. Livre des règles

Affiché une fois la configuration validée, avant de démarrer la partie :

- Chaque joueur commence avec **10 coeurs**.
- Une erreur (les 2 cartes ne correspondent pas) = **-1 coeur** ; une paire trouvée = **+1 coeur**.
- À **0 coeur**, un joueur est éliminé. Le but : rester en vie jusqu'à la fin de la partie.
- Chaque joueur a une **couleur** ; une **lumière** indique à qui est le tour.
- **45 secondes** par tour pour retourner deux cartes.

### 3. Partie

- Un **chronomètre** démarre avec la partie et s'arrête à la victoire ou quand il ne reste plus
  qu'un joueur en vie (ou zéro).
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

Le détail des écarts entre le code et les ateliers (règle 8) est suivi dans
[MODIF.md](MODIF.md), pas ici.
