import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const UseEffect = () => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const key = setInterval(() => {
      setCounter((count) => count + 1);
    }, 1000);
    return () => {
      clearInterval(key);
    };
  }, []);

  const minutes = Math.floor(counter / 60);
  const seconds = counter % 60;
  return (
    <div>
      <p>
        {minutes}:{seconds}
      </p>
    </div>
  );
};

export default UseEffect;
