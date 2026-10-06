# Lexique du code

Vocabulaire technique utilisé dans le projet,
expliqué en une phrase simple. Pas les noms
propres au jeu (`partieActuelle`...), juste le
vocabulaire JS et CSS en lui-même.

## JavaScript

### Déclarer et structurer

- **class**
  Modèle pour créer des objets qui partagent les
  mêmes propriétés et méthodes.
- **constructor**
  Méthode spéciale exécutée à chaque création
  d'un objet avec `new`.
- **new**
  Crée un nouvel objet à partir d'une classe.
- **this**
  Dans une classe, désigne l'objet actuel.
- **const**
  Déclare une variable qui ne change plus après
  sa création.
- **let**
  Déclare une variable dont la valeur peut
  changer ensuite.
- **function**
  Déclare une fonction, un bloc de code
  réutilisable.

### Contrôler le déroulement

- **if / else**
  Exécute un bloc si une condition est vraie,
  sinon un autre bloc.
- **for**
  Répète un bloc un nombre de fois défini, avec
  un compteur.
- **while**
  Répète un bloc tant qu'une condition reste
  vraie.
- **do...while**
  Comme `while`, mais exécute le bloc au moins
  une fois avant de vérifier la condition.
- **return**
  Termine une fonction et lui fait renvoyer une
  valeur.
- **true / false**
  Les deux seules valeurs d'un booléen.
- **null**
  Valeur qui signifie "rien", volontairement
  vide.
- **typeof**
  Donne le type d'une valeur.
- **in**
  Parcourt les clés d'un objet dans un `for`.
- **of**
  Parcourt les valeurs d'un tableau dans un `for`.

### Tableaux

- **.forEach()**
  Exécute une action sur chaque élément d'un
  tableau.
- **.map()**
  Crée un nouveau tableau en transformant
  chaque élément.
- **.filter()**
  Garde seulement les éléments qui remplissent
  une condition.
- **.find()**
  Renvoie le premier élément qui remplit une
  condition.
- **.every()**
  Vérifie si tous les éléments remplissent une
  condition.
- **.includes()**
  Vérifie si une valeur se trouve dans un
  tableau.
- **.indexOf()**
  Donne la position d'une valeur (-1 si absente).
- **.push()**
  Ajoute un élément à la fin d'un tableau.
- **.slice()**
  Copie une partie d'un tableau dans un nouveau.

### Texte et nombres

- **.padStart()**
  Complète un texte au début jusqu'à une
  longueur donnée (ex: "7" → "07").
- **.toFixed()**
  Arrondit un nombre à N décimales, en texte.
- **.toString()**
  Transforme une valeur en texte.
- **.toLowerCase()**
  Transforme un texte en minuscules.

### Objets

- **Object.keys()**
  Donne la liste des clés d'un objet.

### Nombres aléatoires et calculs

- **Math.random()**
  Nombre décimal aléatoire entre 0 et 1.
- **Math.floor()**
  Arrondit à l'entier inférieur.
- **Math.round()**
  Arrondit à l'entier le plus proche.
- **Math.max()**
  Renvoie la plus grande valeur donnée.

### Temps

- **Date.now()**
  Donne l'instant actuel, en millisecondes.
- **setTimeout()**
  Exécute une action une fois, après un délai.
- **setInterval()**
  Exécute une action en boucle, à intervalle
  régulier.
- **clearInterval()**
  Arrête une boucle démarrée par `setInterval()`.

### Page web (DOM)

- **document**
  L'objet qui représente toute la page web.
- **document.getElementById()**
  Récupère un élément via son `id`.
- **document.querySelector()**
  Récupère le premier élément correspondant à
  un sélecteur CSS.
- **document.querySelectorAll()**
  Récupère tous les éléments correspondant à
  un sélecteur CSS.
- **document.createElement()**
  Crée un élément HTML, pas encore affiché.
- **.appendChild()**
  Ajoute un élément comme enfant d'un autre.
- **.addEventListener()**
  Déclenche une fonction à un événement (clic...).
- **.classList**
  Les classes CSS d'un élément, modifiables en JS.
- **.classList.toggle()**
  Ajoute une classe si absente, la retire si
  présente.

## CSS

### Mise en page (Flexbox)

- **display: flex**
  Transforme un élément en conteneur flexible.
- **flex-direction**
  Sens de rangement des enfants (ligne/colonne).
- **flex-wrap**
  Autorise les enfants à passer à la ligne
  suivante si besoin.
- **flex-grow**
  À quel point un élément peut s'agrandir.
- **flex-shrink**
  À quel point un élément peut rétrécir.
- **justify-content**
  Aligne les enfants sur l'axe principal.
- **align-items**
  Aligne les enfants sur l'axe secondaire.
- **gap**
  Espace entre les enfants d'un conteneur flex.

### Positionnement

- **position**
  Comment un élément est positionné.
- **top / right / bottom / left**
  Décalage par rapport à un bord de référence.
- **inset**
  Raccourci pour `top`/`right`/`bottom`/`left`.
- **z-index**
  Quel élément s'affiche par-dessus les autres.

### Dimensions et espacement

- **width / height**
  Largeur et hauteur d'un élément.
- **min-width / min-height**
  Largeur et hauteur minimales.
- **max-width / max-height**
  Largeur et hauteur maximales.
- **margin**
  Espace extérieur, entre un élément et ses
  voisins.
- **padding**
  Espace intérieur, entre le bord et le contenu.
- **box-sizing**
  Si `width`/`height` incluent bordures et
  padding.

### Couleurs et fonds

- **color**
  Couleur du texte.
- **background / background-color**
  Couleur de fond d'un élément.
- **background-image**
  Image de fond d'un élément.
- **background-position**
  Position de l'image de fond dans l'élément.
- **background-size**
  Taille de l'image de fond dans l'élément.
- **background-clip**
  Jusqu'où s'étend le fond (texte, padding...).
- **linear-gradient()**
  Dégradé progressif entre plusieurs couleurs.
- **opacity**
  Transparence globale (0 = invisible).

### Bordures et formes

- **border**
  Bordure d'un élément (épaisseur, style,
  couleur).
- **border-top / -right / -bottom / -left**
  Bordure d'un seul côté d'un élément.
- **border-color**
  Couleur d'une bordure.
- **border-radius**
  Arrondit les coins d'un élément.
- **border-image**
  Remplace une bordure par une image.
- **box-shadow**
  Ombre portée autour d'un élément.
- **text-shadow**
  Ombre portée derrière du texte.

### Texte

- **font-family**
  La ou les polices de caractères utilisées.
- **font-size**
  Taille du texte.
- **font-weight**
  Graisse du texte (normal, gras...).
- **font-variant-numeric**
  Ajuste l'affichage des chiffres.
- **text-align**
  Alignement horizontal du texte.

### Variables CSS

- **:root**
  Cible la racine du document, pour déclarer
  des variables globales.
- **variable CSS (`--nom`)**
  Valeur nommée, réutilisable avec `var(--nom)`.
- **var()**
  Récupère la valeur d'une variable CSS.

### Sélecteurs et pseudo-classes

- **:hover**
  Cible un élément au survol de la souris.
- **:disabled**
  Cible un élément désactivé.
- **:nth-child()**
  Cible un élément selon sa position parmi ses
  frères et sœurs.
- **::before / ::after**
  Insèrent un contenu généré avant/après un
  élément.
- **[attribut]**
  Cible un élément qui possède un attribut HTML
  précis.

### Autres propriétés

- **cursor**
  Apparence du curseur au survol.
- **pointer-events**
  Si un élément réagit aux clics et au survol.
- **overflow-x**
  Quoi faire si le contenu dépasse
  horizontalement.
- **object-fit**
  Comment une image remplit son cadre.
- **transform**
  Transformation visuelle (rotation,
  déplacement...).
- **transition**
  Anime en douceur un changement de propriété.
- **user-select**
  Si le texte peut être sélectionné à la souris.
- **content**
  Contenu généré par `::before` ou `::after`.

### Unités

- **px**
  Pixel, une unité fixe à l'écran.
- **rem**
  Relative à la taille de police de base.
- **vh**
  Relative à la hauteur de la fenêtre (1% par vh).
- **%**
  Pourcentage, relatif au conteneur parent.
- **deg**
  Degré, unité d'angle.
- **s**
  Seconde, unité de durée.
