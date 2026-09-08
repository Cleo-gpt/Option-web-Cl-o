<?php

class Billet
{
    public string $titre;
    public float $prix;
    public int $places;

    public function __construct(string $titre, float $prix, int $places)
    {
        $this->titre = $titre;
        $this->prix = $prix;
        $this->places = $places;
    }

    public function estComplet(): bool
    {
        /* à vous : règle billet complet */
    }

    public function prixFinal(): float
    {
        /* à vous : règle tarif de dernière minute */
    }
}
