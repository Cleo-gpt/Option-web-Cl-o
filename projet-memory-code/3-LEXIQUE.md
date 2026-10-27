# Lexique du code

Vocabulaire technique du projet, en une phrase simple.
Pas les noms propres au jeu, juste le JS et le CSS.

## JavaScript — POO et mots les plus utilisés

### La POO

- class : modèle pour créer des objets.
  Où : `class Carte` (4-carte.js).

- objet : un exemplaire créé à partir d'une classe.
  Où : `catalogueThemes` (4-theme-visuel.js).

- new : crée un objet à partir d'une classe.
  Où : `new Carte(...)` (4-partie.js).

- constructor : remplit l'objet à sa création.
  Où : début de chaque classe.

- this : l'objet actuel.
  Où : `this.retournee` (4-carte.js).

- propriété : une donnée de l'objet.
  Où : `this.coeurs` (4-joueur.js).

- méthode : une action de l'objet.
  Où : `retourner()` (4-carte.js).

- paramètre : valeur donnée à une méthode.
  Où : `estUnePaireAvec(autreCarte)` (4-carte.js).

- return : renvoie le résultat d'une méthode.
  Où : `estVisible()` (4-carte.js).

### Variables et valeurs

- const : variable qui ne change plus.
  Où : `const nbPaires` (4-partie.js).

- let : variable qui peut changer.
  Où : `let cartes` (4-partie.js).

- tableau `[]` : liste de valeurs.
  Où : `this.cartesRetournees` (4-partie.js).

- objet `{}` : ensemble clé : valeur.
  Où : `this.memoireRobot` (4-partie.js).

- true / false : vrai ou faux.
  Où : `this.trouvee` (4-carte.js).

- null : valeur "rien", volontairement vide.
  Où : `this.joueurTrouveurIndex` (4-carte.js).

### Conditions et boucles

- if / else : exécute un bloc selon une condition.
  Où : `if (this.mode === "ordinateur")` (4-partie.js).

- === : vérifie que deux valeurs sont égales.
  Où : `estUnePaireAvec()` (4-carte.js).

- ? : : un if / else court, sur une ligne.
  Où : `nomAffiche()` (4-joueur.js).

- for : répète un bloc un nombre de fois défini.
  Où : `creerJoueurs()` (4-partie.js).

- for...of : parcourt les valeurs d'un tableau.
  Où : `gagnantPartie()` (4-serie-parties.js).

### Tableaux

- .push() : ajoute un élément à la fin.
  Où : `creerJoueurs()` (4-partie.js).

- .forEach() : une action sur chaque élément.
  Où : `afficherCartes()` (4-partie.js).

- .filter() : garde ceux qui conviennent.
  Où : `afficherPairesTrouvees()` (4-partie.js).

- .find() : renvoie le premier qui convient.
  Où : `choisirCarte()` (4-partie.js).

- .length : nombre d'éléments.
  Où : `this.cartesRetournees.length` (4-partie.js).

### Fonctions et temps

- => : fonction écrite en raccourci.
  Où : clics des boutons (4-menu.js).

- setTimeout() : exécute une action une fois, après
  un délai.
  Où : `verifierPaire()` (4-partie.js).

- setInterval() : exécute une action en boucle.
  Où : `lancerMinuteurTour()` (4-partie.js).

- Date.now() : instant actuel, en millisecondes.
  Où : `choisirCarte()` (4-partie.js).

### Page web (DOM)

- document.getElementById() : récupère un élément
  via son `id`.
  Où : `rafraichirCarte()` (4-partie.js).

- document.createElement() : crée un élément HTML.
  Où : `afficherCartes()` (4-partie.js).

- .addEventListener() : réagit à un événement
  (clic...).
  Où : `afficherCartes()` (4-partie.js).

- .classList.toggle() : ajoute ou retire une classe.
  Où : `rafraichirCarte()` (4-partie.js).

## JavaScript — détail par thème

### Déclarer et structurer

- class : modèle pour créer des objets.

- constructor : exécuté à chaque création d'un
  objet avec `new`.

- new : crée un objet à partir d'une classe.

- this : dans une classe, l'objet actuel.

- const : variable qui ne change plus.

- let : variable qui peut changer.

- function : déclare une fonction réutilisable.

### Contrôler le déroulement

- if / else : exécute un bloc selon une condition.

- for : répète un bloc un nombre de fois défini.

- while : répète tant qu'une condition est vraie.

- do...while : comme `while`, mais joue le bloc au
  moins une fois.

- return : termine une fonction, renvoie une valeur.

- true / false : les deux valeurs d'un booléen.

- null : valeur "rien", volontairement vide.

- typeof : donne le type d'une valeur.

- in : parcourt les clés d'un objet.

- of : parcourt les valeurs d'un tableau.

### Tableaux

- .forEach() : exécute une action sur chaque élément.

- .map() : transforme chaque élément en un nouveau
  tableau.

- .filter() : garde les éléments qui remplissent
  une condition.

- .find() : renvoie le premier élément qui convient.

- .every() : vérifie si tous les éléments
  conviennent.

- .includes() : vérifie si une valeur est présente.

- .indexOf() : position d'une valeur (-1 si absente).

- .push() : ajoute un élément à la fin.

- .slice() : copie une partie d'un tableau.

### Texte et nombres

- .padStart() : complète un texte au début
  (ex: "7" → "07").

- .toFixed() : arrondit à N décimales, en texte.

- .toString() : transforme une valeur en texte.

- .toLowerCase() : passe un texte en minuscules.

### Objets

- Object.keys() : liste des clés d'un objet.

### Nombres aléatoires et calculs

- Math.random() : nombre aléatoire entre 0 et 1.

- Math.floor() : arrondit à l'entier inférieur.

- Math.round() : arrondit à l'entier le plus proche.

- Math.max() : la plus grande valeur donnée.

### Temps

- Date.now() : instant actuel, en millisecondes.

- setTimeout() : exécute une action une fois, après
  un délai.

- setInterval() : exécute une action en boucle.

- clearInterval() : arrête un `setInterval()`.

### Page web (DOM)

- document : représente toute la page web.

- document.getElementById() : récupère un élément
  via son `id`.

- document.querySelector() : premier élément
  correspondant à un sélecteur.

- document.querySelectorAll() : tous les éléments
  correspondants.

- document.createElement() : crée un élément HTML.

- .appendChild() : ajoute un élément enfant.

- .addEventListener() : réagit à un événement
  (clic...).

- .classList : les classes CSS d'un élément.

- .classList.toggle() : ajoute ou retire une classe.

## CSS

### Mise en page (Flexbox)

- display: flex : conteneur flexible.

- flex-direction : sens de rangement des enfants.

- flex-wrap : passe à la ligne si besoin.

- flex-grow : capacité à s'agrandir.

- flex-shrink : capacité à rétrécir.

- justify-content : alignement sur l'axe principal.

- align-items : alignement sur l'axe secondaire.

- gap : espace entre les enfants.

### Positionnement

- position : comment un élément est positionné.

- top / right / bottom / left : décalage depuis
  un bord.

- inset : raccourci pour les 4 côtés à la fois.

- z-index : ordre d'empilement des éléments.

### Dimensions et espacement

- width / height : largeur et hauteur.

- min-width / min-height : tailles minimales.

- max-width / max-height : tailles maximales.

- margin : espace extérieur d'un élément.

- padding : espace intérieur d'un élément.

- box-sizing : si bordures/padding comptent dans
  la taille.

### Couleurs et fonds

- color : couleur du texte.

- background / background-color : couleur de fond.

- background-image : image de fond.

- background-position : position de l'image de fond.

- background-size : taille de l'image de fond.

- background-clip : jusqu'où s'étend le fond.

- linear-gradient() : dégradé entre couleurs.

- opacity : transparence globale.

### Bordures et formes

- border : bordure d'un élément.

- border-top / -right / -bottom / -left : bordure
  d'un seul côté.

- border-color : couleur d'une bordure.

- border-radius : arrondit les coins.

- border-image : bordure remplacée par une image.

- box-shadow : ombre autour d'un élément.

- text-shadow : ombre derrière du texte.

### Texte

- font-family : police de caractères.

- font-size : taille du texte.

- font-weight : graisse du texte.

- font-variant-numeric : affichage des chiffres.

- text-align : alignement horizontal du texte.

### Variables CSS

- :root : racine du document, pour les variables
  globales.

- variable CSS (`--nom`) : valeur nommée
  réutilisable.

- var() : récupère une variable CSS.

### Sélecteurs et pseudo-classes

- :hover : au survol de la souris.

- :disabled : élément désactivé.

- :nth-child() : selon la position de l'élément.

- ::before / ::after : contenu généré avant/après.

- [attribut] : élément avec un attribut HTML précis.

### Autres propriétés

- cursor : apparence du curseur au survol.

- pointer-events : réaction aux clics ou non.

- overflow-x : quoi faire si le contenu déborde.

- object-fit : comment une image remplit son cadre.

- transform : rotation, déplacement visuel...

- transition : anime un changement en douceur.

- user-select : texte sélectionnable ou non.

- content : contenu généré par `::before`/`::after`.

### Unités

- px : pixel, unité fixe à l'écran.

- rem : relative à la police de base.

- vh : relative à la hauteur de la fenêtre.

- % : relatif au conteneur parent.

- deg : degré, unité d'angle.

- s : seconde, unité de durée.
