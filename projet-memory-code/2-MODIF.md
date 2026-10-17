# Suivi des écarts avec les ateliers du cours

Écarts entre le code et les notions des ateliers
(règle 8 du 1-README.md).

## ✅ Corrigés (2026-09-29)

- 12 fichiers JS → un seul `4-code.js`
  Chargé par une seule balise `<script>`.

- CSS Grid → `flex-wrap`
  `#grille-cartes` revient à flex + flex-wrap.

- `Math.ceil(Math.sqrt(...))` → retiré
  `flex-wrap` gère seul la mise en ligne.

- `Array.from(...)` → boucle `for`
  Deux boucles `for` imbriquées à la place.

- Variables CSS pilotées en JS → classes CSS
  Le thème "Animé" utilise 6 classes CSS.

- Fonction générique → handlers dupliqués
  Chaque groupe de boutons a son propre `forEach`.

- Objet de config à deux niveaux → liste plate
  Une liste plate `[{ numeroSymbole, extension }]`.
  *(Obsolète : tout est en `.png` maintenant.)*

## 🔴 Impossibles sans trop s'éloigner du cours

- Dictionnaire multilingue (`4-traducteur.js`)
  Aucun atelier ne couvre l'internationalisation.

- Dégradés CSS (`linear-gradient`...)
  Demandés pour l'apparence des thèmes visuels.

## ⚪ Autres

- Note obsolète dans le README
  Un ancien curseur mentionné à tort ; corrigé.

- Classes ES6 étendues (2026-09-29/30)
  Classes `constructor` au maximum — pas un écart.

## À partir de maintenant

*(Se remplit à chaque demande qui va à contre-sens
des ateliers.)*

- Classes séparées dans leurs propres fichiers (2026-09-30)
  Demande explicite, écart assumé.

- Classes sans vrai état propre (2026-10-17)
  Pour maximiser le pourcentage de code en POO (besoin
  pour une présentation), des regroupements de
  fonctions sans état fort (écrans, luminosité, fin de
  partie, écoutes de boutons) deviennent des classes
  avec une seule méthode ou presque. Aucun atelier ne
  crée de classe juste pour en avoir une : demande
  explicite, écart assumé, règle 9 mise à jour.
