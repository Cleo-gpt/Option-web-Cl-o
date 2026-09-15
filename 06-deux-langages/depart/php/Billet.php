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
        if ($this->places === 0) {
            return true;
        } else {
            return false;
        }
    }

    public function prixFinal(): float
    {
        /* à vous : règle tarif de dernière minute */
        $prixFinal = $this->prix;
        if ($this->places < 3) {
            $prixFinal *= 0.9; 
        }
        return $prixFinal;
    }
}

