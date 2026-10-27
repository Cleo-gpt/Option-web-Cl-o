# Brief — Memory Multijoueur

Support : [7-presentation.pptx](7-presentation.pptx)
21 diapos, environ 10 minutes.

---

## Pour commencer

« Mon grand projet, c'est un Memory.
On retourne deux cartes et on cherche les paires.
On joue seul, à plusieurs ou contre l'ordinateur.

Ma classe principale, c'est **Carte**.
Sa règle, c'est **estUnePaireAvec()** :
elle répond true quand les deux cartes ont le même symbole. »

---

## Le déroulé

**1. Le jeu** · diapos 3 à 10
Montre les captures, va vite.
10 coeurs au départ.
Une paire = +1 coeur. Une erreur = −1 coeur.
À 0 coeur, le joueur est éliminé.

**2. Le code** · diapos 11 à 16 ⭐
C'est la partie la plus importante.
Moule, objet, méthode, avec ta classe Carte.

**3. Ce que tu as compris** · diapos 17 à 21
Dis les phrases de la diapo 18 : ce sont tes preuves.

---

## Les mots de la POO

**Classe**
Le moule.
Où : `class Carte` dans [4-carte.js](4-carte.js), `class Joueur` dans [4-joueur.js](4-joueur.js).
Pourquoi : on décrit une carte une seule fois, puis on en fabrique autant qu'on veut.

**Objet**
Une vraie chose sortie du moule.
Où : chaque carte du plateau, le Joueur 1 (bleu).
Pourquoi : 16 cartes à l'écran = 16 objets, mais une seule classe.

**new**
Fabrique un objet à partir de la classe.
Où : `new Carte(...)` dans [4-partie.js](4-partie.js), dans la boucle qui crée les paires.
Pourquoi : chaque carte du plateau naît avec `new`.

**constructor**
Ce qui s'exécute au moment du `new`. Il remplit les données de départ.
Où : en haut de chaque classe.
Pourquoi : une carte commence cachée, un joueur commence avec 10 coeurs.

**this**
L'objet en cours, celui à qui on parle.
Où : `this.numeroSymbole` dans Carte, `this.coeurs` dans Joueur.
Pourquoi : chaque carte garde ses propres valeurs.

**Propriétés**
Ce que l'objet sait.
Où : Carte a `numeroSymbole`, `retournee`, `trouvee`. Joueur a `coeurs`.
Pourquoi : les infos d'une carte restent avec la carte.

**Méthode**
Une action rangée dans la classe.
Où : `retourner()` et `cacher()` dans Carte, `perdreCoeur()` dans Joueur.
Pourquoi : la règle vit avec l'objet, pas éparpillée dans la page.

**Méthode « est… »**
Une méthode qui répond true ou false. C'est ta règle.
Où : `estUnePaireAvec()` et `estVisible()` dans Carte, `estElimine()` dans Joueur.
Pourquoi : le cours demande de savoir la dire sans lire.

**Composition**
Un objet qui contient d'autres objets.
Où : `Partie` dans [4-partie.js](4-partie.js) contient les Cartes et les Joueurs.
Pourquoi : la Partie organise le jeu, mais demande la règle à la carte.

---

## Tes 3 règles, sans lire

**estUnePaireAvec(autre)** → true si les deux cartes ont le même symbole.

**estVisible()** → true si la carte est retournée ou déjà trouvée.

**estElimine()** → true si le joueur a 0 coeur.

---

## Si on te pose une question

**Classe ou objet ?**
La classe, c'est le moule Carte.
L'objet, c'est une carte du plateau.

**Pourquoi la règle est dans la classe ?**
Pour l'écrire une seule fois.
La page demande à la carte, elle ne refait pas le test.

**Comment marche la pause ?**
`clearInterval` arrête le chrono sans le remettre à zéro.
Ensuite on le relance depuis la même valeur.

**Qu'est-ce qui n'est pas dans le cours ?**
Les langues et les dégradés CSS.
C'est noté dans [2-MODIF.md](2-MODIF.md).

---

## À retenir

Ne lis pas le code à voix haute.

Ne dis pas « j'ai fait de la POO ».
Dis plutôt : « estUnePaireAvec() est dans la classe Carte, pas dans la page. »

Bonne présentation 💪
