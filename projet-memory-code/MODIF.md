# Suivi des écarts avec les ateliers du cours

Écarts entre le code et les notions enseignées dans les ateliers (règle 8 du README.md :
`01-planetes`, `02-orbit`, `03-donnees-nues`, `06-deux-langages`, `08-json`, `One_button`, `watt`).

## ✅ Corrigés (2026-09-29)

- **12 fichiers JS → un seul `code.js`**, chargé par une seule balise `<script>`, même ordre de
  dépendance qu'avant. Le dossier `js/` a été supprimé.
- **CSS Grid → `flex-wrap`** : `#grille-cartes` revient à `display: flex; flex-wrap: wrap;`, les
  cartes reviennent à la ligne toutes seules.
- **`Math.ceil(Math.sqrt(...))` → retiré** : plus de calcul de colonnes, `flex-wrap` s'en charge.
- **`Array.from({length}, callback)` → boucle `for`** : `creerEtMelangerCartes()` construit le
  tableau de cartes avec deux boucles `for` imbriquées et `push()`.
- **Variables CSS pilotées en JS → classes CSS** : le thème "Animé" utilise 6 classes
  `accent-anime-1` à `accent-anime-6` (dans `style.css`), posées/retirées en `classList` plutôt
  que `style.setProperty("--accent", ...)`.
- **Fonction générique `gererGroupeBoutons` → handlers dupliqués** : chaque groupe de boutons a
  son propre bloc `querySelectorAll(...).forEach(...)` répété.
- **Objet de config à deux niveaux → liste plate** : `EXCEPTIONS_EXTENSION` remplacé par une
  liste plate `[{ numeroSymbole, extension }]`.
  *(Obsolète depuis : toutes les images sont maintenant en `.png`, ce système d'exceptions par
  extension a été entièrement retiré de `theme-visuel.js`.)*

## 🔴 Impossibles à corriger sans trop s'éloigner du cours

- **Dictionnaire de traduction multilingue** (`traducteur.js`, ~50 clés fr/de/en) : aucun atelier
  ne couvre l'internationalisation, pas d'alternative plus simple qui garderait la fonctionnalité.
- **Dégradés CSS** (`linear-gradient`, `background-clip: text`) : demandés explicitement pour les
  thèmes visuels ; les remplacer par des couleurs unies changerait le rendu voulu.

## ⚪ Autres

- **Note obsolète dans le README** : l'ancienne section "Écarts assumés" mentionnait un curseur
  `<input type="range">` disparu du code — déjà corrigée en pointant vers ce fichier.
- **Classes ES6 étendues (2026-09-29/30)** : à la demande du professeur, le jeu utilise au
  maximum des classes avec `constructor` (`Carte`, `Joueur`, `Partie`, `ThemeVisuel`,
  `Traducteur`, `Menu`, `LivreDesRegles`), dans le style des ateliers. C'est l'inverse d'un
  écart — ça rapproche le code du cours. L'ancien objet global `etat`/`config` est remplacé par
  une instance de `Menu` et une instance de `Partie`.

## À partir de maintenant

*(Se remplit à chaque demande qui va à contre-sens des ateliers ; signalé à l'utilisateur au
moment où l'entrée est ajoutée.)*

- **Classes séparées dans leurs propres fichiers (2026-09-30)** : demande explicite malgré la
  fusion en un seul fichier faite peu avant pour coller aux ateliers. Aucun atelier ne sépare ses
  classes dans des fichiers distincts — écart assumé, règle 2 du README mise à jour en
  conséquence.
