import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";
import "./board.css";
import { Link } from "react-router-dom";
import BGM from "../audio/bgm.mp3";
import Victory from "../audio/victory.mp3";

const gridSize = 6; // Size of the grid (6x6)
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

const PokemonMemoryGame = () => {
  const bgmRef = useRef(null);
  const victoryRef = useRef(null);

  // State variables
  const [grid, setGrid] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [finalTime, setFinalTime] = useState(null); // Final time when game is won
  const baseScore = 1000; // Base score constant
  const [bgmStarted, setBgmStarted] = useState(false);

  const playBgm = () => {
    if (bgmRef.current && !bgmStarted) {
      const playPromise = bgmRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setBgmStarted(true); // Handle successful playback
          })
          .catch((error) => {
            console.log("Playback failed", error); // Handle failed playback
          });
      }
    }
  };

  useEffect(() => {
    let intervalId;
    if (!isGameWon) {
      intervalId = setInterval(() => {
        setTimeTaken((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isGameWon]);

  useEffect(() => {
    // Check if the game is won and play victory music
    if (isGameWon) {
      if (victoryRef.current) {
        victoryRef.current.play();
      }
      setFinalTime(timeTaken); // Store final time when the game is won
    }
  }, [isGameWon, timeTaken]);

  const initializeGrid = async () => {
    try {
      const cardPairs = [];
      for (let i = 1; i <= (gridSize * gridSize) / 2; i++) {
        const response = await axios.get(`${apiUrl}${i}`);
        const pokemonData = response.data;
        cardPairs.push({ ...pokemonData, id: i }, { ...pokemonData, id: i });
      }
      const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
      setGrid(shuffledCards);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeGrid();
    playBgm();
  }, []);

  const handleCellClick = (index) => {
    if (!bgmStarted) {
      playBgm();
      setBgmStarted(true);
    }
    if (flippedCards.includes(index) || matchedCards.includes(index)) return;
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    if (newFlippedCards.length === 2) {
      const matchCheck = newFlippedCards.map((i) => grid[i].id);
      if (matchCheck[0] === matchCheck[1]) {
        setMatchedCards([...matchedCards, ...newFlippedCards]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <audio ref={bgmRef} loop>
        <source src={BGM} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div id="grid-container" className="container-fluid">
        <audio ref={victoryRef} loop>
          <source src={Victory} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        {isGameWon && (
          <div id="score-board">
            <p>Congratulations!</p>
            <p>Your score: {baseScore / finalTime}</p>
          </div>
        )}
        <div className="grid">
          {grid.map((card, index) => (
            <div
              key={index}
              className={`grid-cell ${
                flippedCards.includes(index) || matchedCards.includes(index)
                  ? "flipped"
                  : ""
              }`}
              onClick={() => handleCellClick(index)}
            >
              {(flippedCards.includes(index) ||
                matchedCards.includes(index)) && (
                <PokemonCard pokemonId={card.id} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div id="reset">
        <Link style={{ marginBottom: "15px" }} to="/" id="reset-btn">
          Play Again
        </Link>
      </div>
    </>
  );
};

export default PokemonMemoryGame;
