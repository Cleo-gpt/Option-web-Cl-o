# Lexique du code

Chaque mot de vocabulaire technique utilisé dans les fichiers du projet, expliqué en une phrase simple. Pas les noms propres au jeu (`partieActuelle`, `.arene`...), juste le vocabulaire JavaScript et CSS en lui-même.

## JavaScript

### Déclarer et structurer

- **class** : modèle pour créer des objets qui partagent les mêmes propriétés et méthodes.
- **constructor** : la méthode spéciale d'une classe, exécutée à chaque création d'un objet avec `new`.
- **new** : crée un nouvel objet à partir d'une classe.
- **this** : à l'intérieur d'une classe, désigne l'objet actuel (celui sur lequel la méthode a été appelée).
- **const** : déclare une variable dont la valeur ne peut plus changer après sa création.
- **let** : déclare une variable dont la valeur peut changer ensuite.
- **function** : déclare une fonction, un bloc de code réutilisable.

### Contrôler le déroulement

- **if / else** : exécute un bloc de code seulement si une condition est vraie, sinon un autre bloc.
- **for** : répète un bloc de code un nombre de fois défini, avec un compteur.
- **while** : répète un bloc de code tant qu'une condition reste vraie.
- **do...while** : comme `while`, mais exécute le bloc au moins une fois avant de vérifier la condition.
- **return** : termine une fonction et lui fait renvoyer une valeur.
- **true / false** : les deux seules valeurs possibles d'un booléen (vrai / faux).
- **null** : valeur qui signifie "rien", volontairement vide.
- **typeof** : donne le type d'une valeur (texte, nombre, booléen...).
- **in** : parcourt les clés d'un objet dans une boucle `for`.
- **of** : parcourt les valeurs d'un tableau dans une boucle `for`.

### Tableaux

- **.forEach()** : exécute une action sur chaque élément d'un tableau, sans rien renvoyer.
- **.map()** : crée un nouveau tableau en transformant chaque élément d'un tableau existant.
- **.filter()** : crée un nouveau tableau ne gardant que les éléments qui remplissent une condition.
- **.find()** : renvoie le premier élément d'un tableau qui remplit une condition.
- **.every()** : vérifie si tous les éléments d'un tableau remplissent une condition.
- **.includes()** : vérifie si une valeur précise se trouve dans un tableau.
- **.indexOf()** : donne la position d'une valeur dans un tableau (ou -1 si absente).
- **.push()** : ajoute un élément à la fin d'un tableau.
- **.slice()** : copie une partie (ou la totalité) d'un tableau dans un nouveau tableau.

### Texte et nombres

- **.padStart()** : complète un texte avec des caractères au début jusqu'à une longueur donnée (ex: "7" → "07").
- **.toFixed()** : arrondit un nombre à un nombre de décimales choisi, sous forme de texte.
- **.toString()** : transforme une valeur en texte.
- **.toLowerCase()** : transforme un texte en minuscules.

### Objets

- **Object.keys()** : donne la liste des clés (noms de propriétés) d'un objet.

### Nombres aléatoires et calculs

- **Math.random()** : donne un nombre décimal aléatoire entre 0 (inclus) et 1 (exclu).
- **Math.floor()** : arrondit un nombre à l'entier inférieur.
- **Math.round()** : arrondit un nombre à l'entier le plus proche.
- **Math.max()** : renvoie la plus grande valeur parmi celles données.

### Temps

- **Date.now()** : donne l'instant actuel, en millisecondes.
- **setTimeout()** : exécute une action une seule fois, après un délai donné.
- **setInterval()** : exécute une action en boucle, à intervalle de temps régulier.
- **clearInterval()** : arrête une boucle démarrée par `setInterval()`.

### Page web (DOM)

- **document** : l'objet qui représente toute la page web, point de départ pour y accéder.
- **document.getElementById()** : récupère un élément précis de la page grâce à son `id`.
- **document.querySelector()** : récupère le premier élément de la page qui correspond à un sélecteur CSS.
- **document.querySelectorAll()** : récupère tous les éléments de la page qui correspondent à un sélecteur CSS.
- **document.createElement()** : crée un nouvel élément HTML, pas encore affiché sur la page.
- **.appendChild()** : ajoute un élément comme enfant d'un autre, dans la page.
- **.addEventListener()** : déclenche une fonction quand un événement précis se produit (clic, etc.).
- **.classList** : l'ensemble des classes CSS d'un élément, modifiable en JavaScript.
- **.classList.toggle()** : ajoute une classe CSS si elle est absente, la retire si elle est présente.

## CSS

### Mise en page (Flexbox)

- **display: flex** : transforme un élément en conteneur flexible, qui range ses enfants en ligne ou en colonne.
- **flex-direction** : choisit le sens de rangement des enfants d'un conteneur flex (ligne ou colonne).
- **flex-wrap** : autorise les enfants d'un conteneur flex à passer à la ligne suivante si la place manque.
- **flex-grow** : indique à quel point un élément peut s'agrandir pour occuper l'espace restant.
- **flex-shrink** : indique à quel point un élément peut rétrécir si la place manque.
- **justify-content** : aligne les enfants d'un conteneur flex sur son axe principal (ex: centré, espacés).
- **align-items** : aligne les enfants d'un conteneur flex sur son axe secondaire.
- **gap** : définit l'espace entre les enfants d'un conteneur flex.

### Positionnement

- **position** : choisit comment un élément est positionné (normal, fixe, relatif...).
- **top / right / bottom / left** : décalent un élément positionné par rapport à un bord de référence.
- **inset** : raccourci pour fixer en une fois `top`, `right`, `bottom` et `left`.
- **z-index** : décide quel élément s'affiche par-dessus les autres quand ils se chevauchent.

### Dimensions et espacement

- **width / height** : largeur et hauteur d'un élément.
- **min-width / min-height** : largeur et hauteur minimales qu'un élément ne peut pas franchir vers le bas.
- **max-width / max-height** : largeur et hauteur maximales qu'un élément ne peut pas dépasser.
- **margin** : espace extérieur autour d'un élément, entre lui et ses voisins.
- **padding** : espace intérieur entre le bord d'un élément et son contenu.
- **box-sizing** : décide si `width`/`height` incluent ou non les bordures et le padding.

### Couleurs et fonds

- **color** : couleur du texte.
- **background / background-color** : couleur de fond d'un élément.
- **background-image** : image de fond d'un élément.
- **background-position** : position de l'image de fond à l'intérieur de l'élément.
- **background-size** : taille de l'image de fond à l'intérieur de l'élément.
- **background-clip** : décide jusqu'où s'étend le fond (jusqu'au texte, au padding, etc.).
- **linear-gradient()** : dégradé progressif entre plusieurs couleurs, en ligne droite.
- **opacity** : transparence globale d'un élément (0 = invisible, 1 = normal).

### Bordures et formes

- **border** : bordure d'un élément (épaisseur, style, couleur).
- **border-top / border-right / border-bottom / border-left** : bordure d'un seul côté d'un élément.
- **border-color** : couleur d'une bordure.
- **border-radius** : arrondit les coins d'un élément.
- **border-image** : remplace une bordure classique par une image.
- **box-shadow** : ombre portée autour d'un élément.
- **text-shadow** : ombre portée derrière du texte.

### Texte

- **font-family** : la ou les polices de caractères utilisées.
- **font-size** : taille du texte.
- **font-weight** : graisse du texte (normal, gras...).
- **font-variant-numeric** : ajuste l'affichage des chiffres (ex: largeur identique pour chaque chiffre).
- **text-align** : alignement horizontal du texte (gauche, centré, droite).

### Variables CSS

- **:root** : sélecteur qui cible la racine du document, utilisé pour déclarer des variables globales.
- **variable CSS (`--nom`)** : une valeur nommée, déclarée une fois et réutilisable partout avec `var(--nom)`.
- **var()** : récupère la valeur d'une variable CSS déclarée ailleurs.

### Sélecteurs et pseudo-classes

- **:hover** : cible un élément quand la souris passe dessus.
- **:disabled** : cible un élément désactivé (ex: un bouton `disabled`).
- **:nth-child()** : cible un élément selon sa position parmi ses frères et sœurs.
- **::before / ::after** : insèrent un contenu généré juste avant ou juste après le contenu réel d'un élément.
- **[attribut]** : cible un élément qui possède un attribut HTML précis (ex: `[hidden]`).

### Autres propriétés

- **cursor** : apparence du curseur de la souris au survol (ex: une main pour un bouton).
- **pointer-events** : décide si un élément peut réagir aux clics et au survol de la souris.
- **overflow-x** : décide quoi faire si le contenu dépasse horizontalement (scroll, caché...).
- **object-fit** : décide comment une image remplit son cadre (ex: recadrée pour le couvrir entièrement).
- **transform** : applique une transformation visuelle à un élément (rotation, déplacement...).
- **transition** : anime en douceur le changement d'une propriété CSS, plutôt qu'un changement brutal.
- **user-select** : décide si le texte d'un élément peut être sélectionné à la souris.
- **content** : définit le contenu généré par `::before` ou `::after`.

### Unités

- **px** : pixel, une unité fixe à l'écran.
- **rem** : unité relative à la taille de police de base de la page.
- **vh** : unité relative à la hauteur totale de la fenêtre (1vh = 1% de la hauteur visible).
- **%** : pourcentage, relatif à la taille du conteneur parent.
- **deg** : degré, unité d'angle pour les dégradés ou rotations.
- **s** : seconde, unité de durée pour les transitions.
