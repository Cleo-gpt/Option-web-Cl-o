# Suivi des écarts avec les ateliers du cours

Écarts entre le code et les notions enseignées dans les ateliers (règle 8 du 1-README.md : `01-planetes`, `02-orbit`, `03-donnees-nues`, `06-deux-langages`, `08-json`, `One_button`, `watt`).

## ✅ Corrigés (2026-09-29)

- **12 fichiers JS → un seul `4-code.js`**, chargé par une seule balise `<script>`, même ordre de dépendance qu'avant.
- **CSS Grid → `flex-wrap`** : `#grille-cartes` revient à `display: flex; flex-wrap: wrap;`.
- **`Math.ceil(Math.sqrt(...))` → retiré** : plus de calcul de colonnes, `flex-wrap` s'en charge.
- **`Array.from({length}, callback)` → boucle `for`** : `creerEtMelangerCartes()` construit le tableau avec deux boucles `for` imbriquées.
- **Variables CSS pilotées en JS → classes CSS** : le thème "Animé" utilise 6 classes `accent-anime-1` à `accent-anime-6`, posées/retirées en `classList`.
- **Fonction générique `gererGroupeBoutons` → handlers dupliqués** : chaque groupe de boutons a son propre bloc `forEach` répété.
- **Objet de config à deux niveaux → liste plate** : `EXCEPTIONS_EXTENSION` remplacé par une liste plate `[{ numeroSymbole, extension }]`.
  *(Obsolète depuis : toutes les images sont en `.png`, ce système a été entièrement retiré de `4-theme-visuel.js`.)*

## 🔴 Impossibles à corriger sans trop s'éloigner du cours

- **Dictionnaire de traduction multilingue** (`4-traducteur.js`, ~50 clés fr/de/en) : aucun atelier ne couvre l'internationalisation.
- **Dégradés CSS** (`linear-gradient`, `background-clip: text`) : demandés explicitement pour les thèmes visuels.

## ⚪ Autres

- **Note obsolète dans le README** : l'ancienne section "Écarts assumés" mentionnait un curseur `<input type="range">` disparu du code — déjà corrigée.
- **Classes ES6 étendues (2026-09-29/30)** : à la demande du professeur, le jeu utilise au maximum des classes `constructor`, dans le style des ateliers — l'inverse d'un écart.

## À partir de maintenant

*(Se remplit à chaque demande qui va à contre-sens des ateliers.)*

- **Classes séparées dans leurs propres fichiers (2026-09-30)** : demande explicite, écart assumé (aucun atelier ne sépare ses classes dans des fichiers distincts).
