# Brief express — Memory Multijoueur

Support : [7-presentation.pptx](7-presentation.pptx), 21 diapos, environ 10 minutes.

---

## Ta phrase d'ouverture

« Mon grand projet, c'est un Memory.
On retourne deux cartes, on cherche les paires.
On joue seul, à plusieurs, ou contre l'ordinateur.
Ma classe principale, c'est **Carte**.
Sa règle, c'est **estUnePaireAvec()** : elle répond true quand les deux cartes ont le même symbole. »

---

## Le déroulé en 3 parties

**1. Le jeu** (diapos 3 à 10)
Montre les captures, ne t'attarde pas.
Menu → livre des règles → partie → fin.
10 coeurs au départ. Paire = +1 coeur. Erreur = −1 coeur. 0 coeur = éliminé.

**2. Le code** (diapos 11 à 16) ⭐ le plus important
Moule, objet, méthode, appliqués à ta classe Carte.

**3. Ce que tu as compris** (diapos 17 à 21)
Lis les phrases de la diapo 18 : ce sont tes preuves.

---

## Les mots de la POO

**Classe**
C'est le moule.
📍 `class Carte` dans [4-carte.js](4-carte.js), `class Joueur` dans [4-joueur.js](4-joueur.js).
Pourquoi : on écrit une seule fois ce qu'est une carte, et on en fabrique autant qu'on veut.

**Objet**
C'est une vraie chose sortie du moule.
📍 Une carte précise du plateau, ou le Joueur 1 (bleu).
Pourquoi : 16 cartes sur le plateau = 16 objets, et une seule classe.

**new**
Fabrique un objet à partir de la classe.
📍 `new Carte(...)` dans [4-partie.js](4-partie.js), dans la boucle qui crée les paires.
Pourquoi : chaque carte du plateau naît avec `new`.

**constructor**
Ce qui s'exécute quand on fait `new`. Il remplit les données de départ.
📍 En haut de chaque classe, par exemple dans [4-carte.js](4-carte.js).
Pourquoi : chaque carte commence cachée, et chaque joueur commence avec 10 coeurs.

**this**
Dans la classe, `this`, c'est l'objet en cours : la carte à qui on parle.
📍 `this.numeroSymbole`, `this.coeurs`...
Pourquoi : chaque carte garde ses propres valeurs, sans se mélanger avec les autres.

**Propriétés (les données)**
Ce que l'objet sait.
📍 Carte : `id`, `numeroSymbole`, `retournee`, `trouvee`.
📍 Joueur : `coeurs`, `classeCouleur`, `pairesTrouvees`.
Pourquoi : les infos d'une carte restent avec la carte.

**Méthode**
Une action, rangée dans la classe.
📍 `retourner()`, `cacher()` dans Carte. `gagnerCoeur()`, `perdreCoeur()` dans Joueur.
Pourquoi : la règle vit avec l'objet, pas éparpillée dans la page.

**Méthode en « est… »**
Une méthode qui répond true ou false. Ta règle métier.
📍 `estUnePaireAvec()` et `estVisible()` dans Carte, `estElimine()` dans Joueur.
Pourquoi : c'est ce que le cours demande de savoir dire sans lire.

**Composition**
Un objet qui contient d'autres objets.
📍 La classe `Partie` ([4-partie.js](4-partie.js)) contient une liste de Cartes et une liste de Joueurs.
Pourquoi : la Partie organise le jeu, mais elle demande la règle à la carte.

**Une seule instance**
Une classe dont on ne crée qu'un seul objet, utilisé partout.
📍 `etatPartie`, `gestionnaireEcrans`... dans [4-code.js](4-code.js), `menu` dans [4-menu.js](4-menu.js).
Pourquoi : un seul endroit à lire pour savoir où en est le jeu.

---

## Tes 3 phrases à dire sans lire (diapo 14)

**estUnePaireAvec(autre)** → true quand les deux cartes ont le même symbole.

**estVisible()** → true quand la carte est retournée ou déjà trouvée.

**estElimine()** → true quand le joueur a 0 coeur.

---

## Si on te pose une question

**Classe ou objet ?**
La classe, c'est le moule `Carte`. L'objet, c'est une carte du plateau.

**Pourquoi la règle est dans la classe ?**
Pour l'écrire une seule fois. La page demande à la carte, elle ne refait pas le test.

**C'est quoi this ?**
L'objet en cours, la carte à qui on pose la question.

**Comment marche la pause ?**
`clearInterval` arrête le chrono sans le remettre à zéro. On relance depuis la même valeur.

**Qu'est-ce qui n'est pas dans le cours ?**
Les langues et les dégradés CSS. C'est noté dans [2-MODIF.md](2-MODIF.md).

---

## À éviter

Ne lis pas le code à voix haute.
Ne dis pas « j'ai fait de la POO ». Dis une phrase qu'on peut vérifier :
« estUnePaireAvec() est dans la classe Carte, pas dans la page. »
