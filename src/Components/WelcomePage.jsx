import React, { useEffect, useRef } from "react";
import "./WelcomePage.css";
import Theme from "../audio/theme.mp3";
import BattleMusic from "../audio/battle.mp3";
import { Link, useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const audioRef = useRef(null);
  const battleRef = useRef(null);
  const navigate = useNavigate();

  // Function to handle play button click for battle audio
  const playBattleAudio = () => {
    if (battleRef.current) {
      battleRef.current.play();
      setTimeout(() => {
        navigate("/play");
      }, 3000);
    }
  };

  // Auto play background theme when the component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.log("Error playing the audio:", error));
    }
  }, []);

  // Use the useEffect hook to add event listener for handling the background theme interaction
  useEffect(() => {
    const welcome = document.getElementById("welcome-page");
    welcome.addEventListener(
      "click",
      () => audioRef.current && audioRef.current.play()
    );
    return () => {
      welcome.removeEventListener(
        "click",
        () => audioRef.current && audioRef.current.play()
      );
    };
  }, []);

  return (
    <div id="welcome-page">
      {/* Audio element for background music */}
      <audio ref={audioRef} loop>
        <source src={Theme} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <audio ref={battleRef} loop>
        <source src={BattleMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Image and play button */}
      <div id="welcome-container">
        <img
          id="welcome-image"
          alt="welcome"
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjViOTBzMno2ZzFwcGZ4cGwxZnRxY2wya2w2OHJ6eHJnZzh1Z3l1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mWUeBpAE5YxKnOrbBv/giphy.gif"
        />

        <div id="enter">
          <Link id="play-button" type="button" onClick={playBattleAudio}>
            <i className="fa-solid fa-play" id="play-icon"></i> Play
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
