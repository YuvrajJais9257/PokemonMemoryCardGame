import React, { useState, useEffect } from "react";
import axios from "axios";

import "./pokemonCard.css";

const PokemonCard = ({ pokemonId }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then((response) => {
        setPokemonData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [pokemonId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  console.log(pokemonData);
  return (
    <div className="pokemon-card-container">
      <img
        className="pokemon-card"
        variant="top"
        src={pokemonData.sprites.front_default}
        alt={pokemonData.name}
      />
    </div>
  );
};

export default PokemonCard;
