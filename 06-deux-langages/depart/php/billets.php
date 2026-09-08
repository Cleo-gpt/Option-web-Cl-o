<?php
require __DIR__ . '/Billet.php';

/* OBJETS PHP
   Étape 4 : créez d’abord seulement $paleo.
   Étape 5 : remplacez-le par le tableau $affiche des trois billets.
*/
?>
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Trois billets — même classe en PHP</title>
    <link rel="stylesheet" href="../css/style.css" />
  </head>
  <body>
    <header>
      <p class="brand">Guichet de la salle</p>
    </header>
    <main>
      <section id="accueil">
        <div class="container">
          <p class="kicker">Sas · deux langages · PHP</p>
          <h1>Trois billets, la même classe.</h1>
          <p class="chapo">Mêmes propriétés, mêmes règles. Seule la syntaxe change.</p>
        </div>
      </section>
      <section id="liste">
        <div class="container">
          <h2>Ce soir au guichet</h2>
          <div class="liste">
            <?php $billet->titre
                  $billet->place
                  $billet->prixFinal()
                  $billet->estComplet() ?>
          </div>
        </div>
      </section>
      <section id="methode">
        <div class="container">
          <h2>Ce que l’objet sait</h2>
          <p><?php foreach ($affiche as $billet): ?>
<article class="fiche">
<h3><?= htmlspecialchars($billet->titre, ENT_QUOTES, 'UTF-8') ?></h3>
<p>
<?= $billet->places ?> places ·
<?= number_format($billet->prixFinal(), 2, ',', ' ') ?> francs
</p>
<p class="badge">
<?= $billet->estComplet() ? 'Complet' : 'Ouvert' ?>
</p>
</article>
<?php endforeach; ?></p>
        </div>
      </section>
    </main>
    <footer>
      <p>(votre prénom) · classe Billet · PHP</p>
    </footer>
  </body>
</html>
