# Suivi des écarts avec les ateliers du cours

Écarts entre le code et les notions des ateliers
(règle 8 du 1-README.md).

## ✅ Corrigés (2026-09-29)

- **12 fichiers JS → un seul `4-code.js`**, chargé par
  une seule balise `<script>`.
- **CSS Grid → `flex-wrap`** : `#grille-cartes` revient
  à flex + flex-wrap.
- **`Math.ceil(Math.sqrt(...))` → retiré** : `flex-wrap`
  gère seul la mise en ligne.
- **`Array.from(...)` → boucle `for`** :
  `creerEtMelangerCartes()` utilise deux `for` imbriqués.
- **Variables CSS pilotées en JS → classes CSS** : le
  thème "Animé" utilise 6 classes `accent-anime-1` à
  `accent-anime-6`.
- **Fonction générique `gererGroupeBoutons` → handlers
  dupliqués** : chaque groupe de boutons a son propre
  bloc `forEach`.
- **Objet de config à deux niveaux → liste plate** :
  `EXCEPTIONS_EXTENSION` remplacé par une liste plate
  `[{ numeroSymbole, extension }]`.
  *(Obsolète : tout est en `.png`, ce système a été
  retiré de `4-theme-visuel.js`.)*

## 🔴 Impossibles sans trop s'éloigner du cours

- **Dictionnaire multilingue** (`4-traducteur.js`) :
  aucun atelier ne couvre l'internationalisation.
- **Dégradés CSS** (`linear-gradient`...) : demandés
  explicitement pour les thèmes visuels.

## ⚪ Autres

- **Note obsolète dans le README** : un ancien curseur
  `<input type="range">` était mentionné à tort ; déjà
  corrigé.
- **Classes ES6 étendues (2026-09-29/30)** : le jeu
  utilise au maximum des classes `constructor` —
  l'inverse d'un écart.

## À partir de maintenant

*(Se remplit à chaque demande qui va à contre-sens des
ateliers.)*

- **Classes séparées dans leurs propres fichiers
  (2026-09-30)** : demande explicite, écart assumé
  (aucun atelier ne sépare ses classes en fichiers
  distincts).
