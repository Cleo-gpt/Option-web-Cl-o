# Suivi des écarts avec les ateliers du cours

Écarts entre le code et les notions enseignées dans les ateliers (règle 8 du README.md :
`01-planetes`, `02-orbit`, `03-donnees-nues`, `06-deux-langages`, `08-json`, `One_button`, `watt`).

## ✅ Corrigés (2026-09-29)

- **12 fichiers JS → un seul `code.js`**, chargé par une seule balise `<script>`, dans le même
  ordre de dépendance qu'avant. Le dossier `js/` a été supprimé.
- **CSS Grid → `flex-wrap`** : `#grille-cartes` revient à `display: flex; flex-wrap: wrap;` (déjà
  utilisé ailleurs dans le CSS), les cartes reviennent à la ligne toutes seules.
- **`Math.ceil(Math.sqrt(...))` → retiré** : plus de calcul de colonnes du tout, `flex-wrap` s'en
  charge naturellement.
- **`Array.from({length}, callback)` → boucle `for`** : `creerEtMelangerCartes()` construit
  maintenant le tableau de cartes avec deux boucles `for` imbriquées et `push()`.
- **Variables CSS pilotées en JS → classes CSS** : le thème "Animé" utilise 6 classes
  `accent-anime-1` à `accent-anime-6` (définies dans `style.css`), posées/retirées en `classList`
  plutôt que `style.setProperty("--accent", ...)`.
- **Fonction générique `gererGroupeBoutons` → handlers dupliqués** : chaque groupe de boutons
  (thème, mode, joueurs, difficulté ordi, cartes, difficulté) a maintenant son propre bloc
  `querySelectorAll(...).forEach(...)` répété.
- **Objet de config à deux niveaux → liste plate** : `EXCEPTIONS_EXTENSION` est remplacé par
  `EXTENSIONS_SYMBOLES_MEDIAMATIQUE`, une liste plate `[{ numeroSymbole, extension }]`.

## 🔴 Impossibles à corriger sans trop s'éloigner du cours

- **Dictionnaire de traduction multilingue** (`traductions.js`, ~50 clés fr/de/en) — aucun atelier
  ne couvre l'internationalisation ; pas d'alternative plus simple qui garderait la fonctionnalité.
- **Dégradés CSS** (`linear-gradient`, `background-clip: text`) — demandés explicitement pour les
  thèmes visuels (Communauté engagée, titres colorés) ; aucun atelier ne les couvre, mais les
  remplacer par des couleurs unies changerait le rendu voulu.

## ⚪ Autres

- **Note obsolète dans le README** : l'ancienne section "Écarts assumés" mentionnait un curseur
  `<input type="range">` qui n'existe plus dans le code (remplacé par des boutons fixes) — déjà
  corrigée en pointant vers ce fichier à la place.

## À partir de maintenant

*(Se remplit à chaque demande ou idée qui va à contre-sens des ateliers ; chaque entrée est
notifiée à l'utilisateur au moment où elle est ajoutée.)*

Rien à signaler pour l'instant.
