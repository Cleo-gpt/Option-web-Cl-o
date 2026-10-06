# Lexique du code

Vocabulaire technique utilisé dans le projet, expliqué en
une phrase simple. Pas les noms propres au jeu
(`partieActuelle`...), juste le vocabulaire JS et CSS.

## JavaScript

### Déclarer et structurer

- **class** : modèle pour créer des objets qui partagent
  les mêmes propriétés et méthodes.
- **constructor** : méthode exécutée à chaque création
  d'un objet avec `new`.
- **new** : crée un nouvel objet à partir d'une classe.
- **this** : dans une classe, désigne l'objet actuel.
- **const** : variable qui ne change plus après création.
- **let** : variable dont la valeur peut changer ensuite.
- **function** : déclare une fonction réutilisable.

### Contrôler le déroulement

- **if / else** : exécute un bloc si une condition est
  vraie, sinon un autre bloc.
- **for** : répète un bloc un nombre de fois défini.
- **while** : répète un bloc tant qu'une condition reste
  vraie.
- **do...while** : comme `while`, mais exécute le bloc au
  moins une fois.
- **return** : termine une fonction, renvoie une valeur.
- **true / false** : les deux valeurs d'un booléen.
- **null** : valeur qui signifie "rien", volontairement
  vide.
- **typeof** : donne le type d'une valeur.
- **in** : parcourt les clés d'un objet dans un `for`.
- **of** : parcourt les valeurs d'un tableau dans un `for`.

### Tableaux

- **.forEach()** : exécute une action sur chaque élément.
- **.map()** : transforme chaque élément en un nouveau
  tableau.
- **.filter()** : garde les éléments qui remplissent une
  condition.
- **.find()** : renvoie le premier élément qui remplit
  une condition.
- **.every()** : vérifie si tous les éléments remplissent
  une condition.
- **.includes()** : vérifie si une valeur est dans le
  tableau.
- **.indexOf()** : position d'une valeur (-1 si absente).
- **.push()** : ajoute un élément à la fin du tableau.
- **.slice()** : copie une partie d'un tableau.

### Texte et nombres

- **.padStart()** : complète un texte au début jusqu'à
  une longueur donnée (ex: "7" → "07").
- **.toFixed()** : arrondit un nombre à N décimales.
- **.toString()** : transforme une valeur en texte.
- **.toLowerCase()** : transforme un texte en minuscules.

### Objets

- **Object.keys()** : liste des clés d'un objet.

### Nombres aléatoires et calculs

- **Math.random()** : nombre décimal aléatoire entre 0
  et 1.
- **Math.floor()** : arrondit à l'entier inférieur.
- **Math.round()** : arrondit à l'entier le plus proche.
- **Math.max()** : renvoie la plus grande valeur donnée.

### Temps

- **Date.now()** : instant actuel, en millisecondes.
- **setTimeout()** : exécute une action une fois, après
  un délai.
- **setInterval()** : exécute une action en boucle, à
  intervalle régulier.
- **clearInterval()** : arrête une boucle `setInterval()`.

### Page web (DOM)

- **document** : l'objet qui représente toute la page.
- **document.getElementById()** : récupère un élément
  via son `id`.
- **document.querySelector()** : premier élément
  correspondant à un sélecteur CSS.
- **document.querySelectorAll()** : tous les éléments
  correspondant à un sélecteur CSS.
- **document.createElement()** : crée un élément HTML,
  pas encore affiché.
- **.appendChild()** : ajoute un élément comme enfant
  d'un autre.
- **.addEventListener()** : déclenche une fonction à un
  événement (clic...).
- **.classList** : les classes CSS d'un élément,
  modifiables en JS.
- **.classList.toggle()** : ajoute une classe si absente,
  la retire si présente.

## CSS

### Mise en page (Flexbox)

- **display: flex** : conteneur flexible pour ses
  enfants.
- **flex-direction** : sens de rangement (ligne/colonne).
- **flex-wrap** : passe à la ligne suivante si besoin.
- **flex-grow** : à quel point un élément peut s'agrandir.
- **flex-shrink** : à quel point un élément peut rétrécir.
- **justify-content** : aligne sur l'axe principal.
- **align-items** : aligne sur l'axe secondaire.
- **gap** : espace entre les enfants d'un conteneur flex.

### Positionnement

- **position** : comment un élément est positionné.
- **top / right / bottom / left** : décalage par rapport
  à un bord de référence.
- **inset** : raccourci pour les 4 côtés à la fois.
- **z-index** : quel élément s'affiche par-dessus.

### Dimensions et espacement

- **width / height** : largeur et hauteur d'un élément.
- **min-width / min-height** : largeur/hauteur minimales.
- **max-width / max-height** : largeur/hauteur maximales.
- **margin** : espace extérieur, entre un élément et ses
  voisins.
- **padding** : espace intérieur, entre le bord et le
  contenu.
- **box-sizing** : si largeur/hauteur incluent bordures
  et padding.

### Couleurs et fonds

- **color** : couleur du texte.
- **background / background-color** : couleur de fond.
- **background-image** : image de fond d'un élément.
- **background-position** : position de l'image de fond.
- **background-size** : taille de l'image de fond.
- **background-clip** : jusqu'où s'étend le fond.
- **linear-gradient()** : dégradé entre plusieurs
  couleurs.
- **opacity** : transparence globale (0 = invisible).

### Bordures et formes

- **border** : bordure d'un élément.
- **border-top / -right / -bottom / -left** : bordure
  d'un seul côté.
- **border-color** : couleur d'une bordure.
- **border-radius** : arrondit les coins d'un élément.
- **border-image** : remplace une bordure par une image.
- **box-shadow** : ombre portée autour d'un élément.
- **text-shadow** : ombre portée derrière du texte.

### Texte

- **font-family** : la ou les polices utilisées.
- **font-size** : taille du texte.
- **font-weight** : graisse du texte (normal, gras...).
- **font-variant-numeric** : affichage des chiffres.
- **text-align** : alignement horizontal du texte.

### Variables CSS

- **:root** : racine du document, pour les variables
  globales.
- **variable CSS (`--nom`)** : valeur nommée, réutilisable
  avec `var(--nom)`.
- **var()** : récupère la valeur d'une variable CSS.

### Sélecteurs et pseudo-classes

- **:hover** : cible un élément au survol de la souris.
- **:disabled** : cible un élément désactivé.
- **:nth-child()** : cible un élément selon sa position.
- **::before / ::after** : contenu généré avant/après un
  élément.
- **[attribut]** : cible un élément avec un attribut HTML
  précis.

### Autres propriétés

- **cursor** : apparence du curseur au survol.
- **pointer-events** : si un élément réagit aux clics.
- **overflow-x** : quoi faire si le contenu déborde.
- **object-fit** : comment une image remplit son cadre.
- **transform** : rotation, déplacement visuel...
- **transition** : anime en douceur un changement.
- **user-select** : si le texte peut être sélectionné.
- **content** : contenu généré par `::before`/`::after`.

### Unités

- **px** : pixel, une unité fixe à l'écran.
- **rem** : relative à la taille de police de base.
- **vh** : relative à la hauteur de la fenêtre.
- **%** : pourcentage, relatif au conteneur parent.
- **deg** : degré, unité d'angle.
- **s** : seconde, unité de durée.
