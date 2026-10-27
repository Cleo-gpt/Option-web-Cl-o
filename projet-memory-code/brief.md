# Brief pour la présentation — Memory Multijoueur

Le support, c'est [7-presentation.pptx](7-presentation.pptx) (21 diapos).
Compte environ 10 minutes, soit 20 à 40 secondes par diapo.
Les intercalaires (01, 02, 03) se passent en 5 secondes.

## Le projet en 30 secondes

> « Mon grand projet, c'est un Memory : on retourne deux cartes, on cherche
> les paires. On peut jouer seul, à plusieurs sur le même écran, ou contre
> l'ordinateur. Côté code, ma classe principale est `Carte`, et sa règle,
> c'est `estUnePaireAvec()` : elle répond true quand les deux cartes ont le
> même symbole. »

Si tu oublies tout le reste, garde ces trois mots du cours :
**le moule** (la classe), **l'objet** (la chose réelle), **la méthode**
(l'action qui décide).

---

## Diapo par diapo

### 1. Titre — Memory Multijoueur
« Je vous présente mon grand projet du Sas POO : un jeu de Memory en HTML,
CSS et JavaScript. Je vais montrer le jeu, puis le code avec les mots du
cours, puis ce que j'ai compris. »

### 2. Trois décisions avant le code
C'est la méthode du cours (1-COURS du grand projet).
- **Qui ouvre la page ?** 1 à 4 joueurs devant le même écran, ou une
  personne contre l'ordinateur.
- **Ma classe :** `Carte`.
- **Ma règle :** `estUnePaireAvec(autre)` retourne true quand les deux
  cartes ont le même symbole.

### 3. Intercalaire « 01 · Le jeu »
Passe vite.

### 4. Le menu
« Avant de jouer, on choisit le thème, le mode, le nombre de cartes et le
mélange. Le bouton Valider ne s'allume que quand tout est choisi. »
- Le nombre de cartes va de 12 à 56. En solo, c'est 32 au maximum.
- Mélange facile, moyen ou difficile : on mélange 1, 4 ou 10 fois.

### 5. Le livre des règles
« Après le menu, un livre fermé apparaît. On clique dessus, il demande si on
veut lire les règles. Pendant la partie, le bouton 📖 rouvre le livre :
c'est la pause. »
- Si on répond non, le livre dit « Dans ce cas, bonne chance » et la partie
  démarre toute seule.

### 6. Les règles
Lis les six cartes de la diapo sans en rajouter :
10 coeurs, paire = +1 coeur et on rejoue, erreur = −1 coeur et au suivant,
0 coeur = éliminé, 45 secondes par tour, une lumière de couleur par joueur.
- Le temps écoulé sans jouer compte comme une erreur.

### 7. Une partie en cours
Montre les 4 numéros sur la capture :
1. le temps (chrono de la partie + 45 s par tour),
2. les joueurs (lumière allumée = à toi, et tes coeurs),
3. la grille de cartes,
4. les paires trouvées, une colonne par joueur.

« Les paires des autres joueurs sont plus pâles, pour mieux voir celles du
joueur qui joue. »

### 8. Contre l'ordinateur
« L'ordinateur se souvient des cartes qu'il a vues, comme un vrai joueur. Le
niveau décide s'il se sert de sa mémoire : jamais, une fois sur deux, ou
presque toujours. »
- L'ordinateur est lui aussi un objet `Joueur` (couleur argentée).

### 9. Thèmes, couleurs et langues
« Cinq thèmes, chacun avec ses 28 images et ses couleurs. Deux boutons en
plus : 🌗 pour nuit, crépuscule ou jour, et Fr pour changer de langue. »

### 10. Fin de partie
« À la fin, on voit qui a gagné et les statistiques de chaque joueur : paires
trouvées, coeurs restants, temps moyen. À plusieurs, on peut enchaîner 2 à 4
parties, avec un bloc par partie. »
- La partie finit quand toutes les paires sont trouvées, ou quand plus
  personne n'a de coeur.

### 11. Intercalaire « 02 · Le code »
« Maintenant le code, avec les mots du cours. »

### 12. Moule, objet, méthode ⭐
C'est la diapo la plus importante : c'est le tableau du support de cours,
appliqué à ton jeu.

| Mot du cours | Exemple du cours | Mon Memory |
|---|---|---|
| Classe (le moule) | Meule | `Carte`, `Joueur` |
| Objet (la chose réelle) | cette tomme-ci | cette carte-ci, le Joueur 1 |
| Méthode (une action) | `estPret()` | `estUnePaireAvec()`, `estElimine()` |

Phrase clé : **« La règle vit avec la carte. La page ne refait pas le test,
elle demande à la carte. »**

### 13. Le moule : la classe Carte
Ne lis pas le code ligne par ligne. Montre trois choses :
- **Les données :** `id`, `numeroSymbole`, `retournee`, `trouvee`.
- **`constructor` et `this` :** à chaque `new Carte(…)`, `this` est la
  nouvelle carte qu'on remplit.
- **Les méthodes :** `estUnePaireAvec()` et `estVisible()` répondent true ou
  false.

### 14. Ma règle, dite sans lire ⭐
C'est l'exercice de l'oral du cours : dire ce qu'une méthode décide sans
lire. Apprends ces trois phrases par coeur :
- `estUnePaireAvec(autre)` → true quand les deux cartes ont le même
  `numeroSymbole`.
- `estVisible()` → true quand la carte est retournée ou déjà trouvée.
- `estElimine()` → true quand le joueur a 0 coeur.

L'encadré du bas montre **un seul objet** : `new Carte(0, 7)` est cachée
(false), on la retourne, elle devient visible (true).

### 15. D'un objet à toute la grille
« Comme dans l'atelier : d'abord un objet, puis une liste. Une boucle `for`
fabrique deux cartes par symbole : 16 cartes, c'est 16 `new Carte`. Ensuite
la page demande `carte.estVisible()` à chaque carte pour savoir quoi
afficher. La boucle reste mince, elle ne recopie pas la condition. »

### 16. Les fichiers du projet
« `5-index.html` pour la structure, `6-style.css` pour l'apparence, et une
classe par fichier JavaScript. Les principales : Carte, Joueur, Partie,
Menu. Pas de framework : on ouvre le fichier HTML dans le navigateur. »

### 17. Intercalaire « 03 · Ce que j'ai vu et compris »
Passe vite.

### 18. Des phrases qu'on peut vérifier
Le cours dit de ne pas dire « j'ai fait de la POO » mais une phrase qu'on
peut observer. Lis les quatre phrases ; ce sont tes preuves.

### 19. Les notions utilisées
Cite une notion par carte, pas toutes :
- **Classes :** `class`, `constructor`, `new`, `this`.
- **DOM :** `createElement` crée un bouton par carte, `addEventListener`
  écoute le clic.
- **Le temps :** `setInterval` pour le chrono, `clearInterval` pour la pause.
- **CSS :** variables de couleur, `flex-wrap` pour la grille.

### 20. Ce qui a été le plus difficile
- **La pause :** il fallait arrêter deux minuteurs (le chrono et le temps du
  tour), puis les relancer là où ils s'étaient arrêtés.
- **Séparer les rôles :** la carte garde ses données, la partie s'occupe de
  l'affichage.
- **Rester dans le cours :** les langues et les dégradés ne sont pas dans les
  ateliers ; c'est noté dans `2-MODIF.md`.

### 21. Merci
« Merci, avez-vous des questions ? Je peux aussi faire une démo. »

---

## Questions probables et réponses

**Quelle différence entre une classe et un objet ?**
La classe, c'est le moule (`Carte`). L'objet, c'est une vraie carte sortie du
moule avec `new Carte(0, 7)`. Dans une partie de 16 cartes, il y a une seule
classe et 16 objets.

**Pourquoi la règle est dans la classe et pas dans la page ?**
Pour qu'elle ne soit écrite qu'à un seul endroit. Si le test était copié dans
la page, il faudrait le recopier partout, et une copie finirait par être
fausse.

**C'est quoi `this` ?**
Dans la classe, `this` est l'objet actuel : la carte à qui on pose la
question.

**Comment marche le mélange ?**
On échange chaque carte avec une autre tirée au hasard (`Math.random()`). La
difficulté change seulement le nombre de mélanges : 1, 4 ou 10.

**Comment marche la pause ?**
`clearInterval` arrête le chrono et le minuteur du tour sans les remettre à
zéro. Quand on relance, on repart de la valeur où ils s'étaient arrêtés.
Pendant la pause, les clics sur les cartes sont bloqués.

**Comment l'ordinateur choisit ses cartes ?**
Il retient chaque carte retournée. S'il connaît deux cartes avec le même
symbole, il peut jouer cette paire. Selon le niveau, il le fait jamais, une
fois sur deux, ou presque toujours. Sinon il prend deux cartes au hasard.

**Quel élément est l'objet dans ton code ?**
Une carte du plateau (un objet `Carte`), ou un joueur (un objet `Joueur`
avec ses coeurs).

**Qu'est-ce qui n'est pas dans les ateliers ?**
Le changement de langue et les dégradés CSS. Ils sont listés dans
`2-MODIF.md`, avec la raison.

**Est-ce que tu as utilisé une IA ?**
Le projet a été fait avec un agent IA (le README décrit cette façon de
travailler). Réponds honnêtement, puis montre ce que tu maîtrises : tu as
choisi les règles du jeu et tu sais dire ce que fait chaque méthode, sans
lire.

---

## Pièges à éviter (repris du support de cours)

- **Ne lis pas le code à voix haute.** Le cours dit : « Si vous lisez le
  fichier à voix haute, ce n'est pas encore tenu. »
- **Ne dis pas « ça marche » ou « j'ai fait de la POO ».** Dis une phrase
  qu'on peut vérifier : « `estUnePaireAvec()` est dans la classe Carte. »
- **Ne te perds pas dans les détails** (traduction, thèmes, statistiques).
  Le coeur de l'oral, ce sont les diapos 12 à 15.

## Démo rapide (si on te la demande)

1. Ouvre `projet-memory-code/5-index.html` dans le navigateur.
2. Menu : Médiamatique, Multijoueur, 2 joueurs, 2 parties, 12 cartes,
   facile, puis Valider.
3. Clique sur le livre, puis « Oui », puis « Lancer la partie ».
4. Trouve une paire (+1 coeur, tu rejoues), puis rate-en une (−1 coeur, au
   suivant).
5. Clique sur 📖 pour montrer la pause, puis relance.
6. Clique sur « Fr » pour montrer le changement de langue.

## Juste avant de passer

- [ ] Le PowerPoint est ouvert, en mode diaporama.
- [ ] `5-index.html` est ouvert dans un onglet pour la démo.
- [ ] Tu sais dire les 3 phrases de la diapo 14 sans les lire.
- [ ] Tu sais expliquer classe / objet / méthode avec `Carte`.
