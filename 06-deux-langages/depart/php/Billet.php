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
        return $this->places < 0;
    }

    public function prixFinal(): float
    {
       $prixFinal = $this->prix;
         if ($this->places < 3) {
                $prixFinal *= 0.9;
            }   
        return $prixFinal;
    }
}

$paleo = new Billet("Paléo, grande scène — samedi", 45, 0);