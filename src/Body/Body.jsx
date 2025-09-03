import { useEffect, useRef, useState } from "react";
import "./Body.css";

function Body() {
  // Snake & Direction
  const snakeRef = useRef([
    { y: 10, x: 19 },
    { y: 10, x: 20 },
    { y: 10, x: 21 },
  ]);
  const directionRef = useRef("RIGHT");
  const intervalRef = useRef(null);
  const foodRef = useRef({ y: 5, x: 5 });

  // ✅ States
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Board Draw
  function draw_row() {
    let board = document.getElementById("board");
    if (!board) return;
    board.innerHTML = "";

    for (let rowIndex = 0; rowIndex < 20; rowIndex++) {
      const row = document.createElement("div");
      row.id = `row_${rowIndex + 1}`;
      row.className = "row";

      for (let colIndex = 0; colIndex < 40; colIndex++) {
        const main_box = document.createElement("div");
        main_box.id = `box_${rowIndex + 1}_${colIndex + 1}`;
        main_box.className = "main_box";
        row.appendChild(main_box);
      }

      board.appendChild(row);
    }
  }

  // Food Generator
  function food_generator() {
    let y = Math.floor(Math.random() * 20) + 1;
    let x = Math.floor(Math.random() * 40) + 1;

    let snake = snakeRef.current;
    if (snake.some((part) => part.x === x && part.y === y)) {
      food_generator();
      return;
    }

    foodRef.current = { y, x };
    document.getElementById(`box_${y}_${x}`).style.backgroundColor = "red";
  }

  // Snake Draw
  function Snake_Drawer() {
    let snake = snakeRef.current;
    for (let i = 0; i < snake.length; i++) {
      document.getElementById(
        `box_${snake[i].y}_${snake[i].x}`
      ).style.backgroundColor = "green";
    }
  }

  // Snake Move
  function Coordinate_changer() {
    let snake = [...snakeRef.current];
    let head = { ...snake[snake.length - 1] };

    // Movement
    if (directionRef.current === "RIGHT") head.x += 1;
    else if (directionRef.current === "LEFT") head.x -= 1;
    else if (directionRef.current === "UP") head.y -= 1;
    else if (directionRef.current === "DOWN") head.y += 1;

    // Wall hit -> Game Over
    if (head.x < 1 || head.x > 40 || head.y < 1 || head.y > 20) {
      clearInterval(intervalRef.current);
      setGameOver(true);

      document.getElementById("board").style.display = "none";
      document.getElementById("Start").style.display = "none";
      document.getElementById("Restart").style.display = "flex";
      document.getElementById("OVER").style.display = "flex";


      return;
    }

    // Self hit -> Game Over
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        clearInterval(intervalRef.current);
        setGameOver(true);

      document.getElementById("board").style.display = "none";
      document.getElementById("Start").style.display = "none";
      document.getElementById("Restart").style.display = "flex";
      document.getElementById("OVER").style.display = "flex";



        return;
      }
    }

    // Food eaten
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      snake.push(head);
      snakeRef.current = snake;
      setScore((prev) => prev + 1); // ✅ increase score
      Snake_Drawer();
      food_generator();
      return;
    }

    // Normal move
    let tail = snake.shift();
    document.getElementById(
      `box_${tail.y}_${tail.x}`
    ).style.backgroundColor = "transparent";
    snake.push(head);

    snakeRef.current = snake;
    Snake_Drawer();
  }

  // Start Game
  function Starter() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setScore(0);
    setGameOver(false);
    snakeRef.current = [
      { y: 10, x: 19 },
      { y: 10, x: 20 },
      { y: 10, x: 21 },
    ];
    directionRef.current = "RIGHT";
    draw_row();
    food_generator();
    Snake_Drawer();
    intervalRef.current = setInterval(Coordinate_changer, 200);
  }

  // Restart Game
  function ReStarter() {

      document.getElementById("board").style.display = "flex";
      document.getElementById("Start").style.display = "flex";
      document.getElementById("Restart").style.display = "none";
      document.getElementById("OVER").style.display = "none";
    Starter();


  }

  // Keyboard Controls
  function handleKeyDown(e) {
    if (e.key === "ArrowUp" && directionRef.current !== "DOWN")
      directionRef.current = "UP";
    else if (e.key === "ArrowDown" && directionRef.current !== "UP")
      directionRef.current = "DOWN";
    else if (e.key === "ArrowLeft" && directionRef.current !== "RIGHT")
      directionRef.current = "LEFT";
    else if (e.key === "ArrowRight" && directionRef.current !== "LEFT")
      directionRef.current = "RIGHT";
  }

  useEffect(() => {
    draw_row();
    food_generator();
    Snake_Drawer();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div id="Body">
     
     
      <div id="body_upper">
      
      
         
            <div id="board"></div>

      
        {/* ⚠️ Error for Mobile */}

        <div id="ERROR">
          <div id="ERROR_MSG">⚠️ This application</div>
          <div id="ERROR_MSG">is optimized for</div>
          <div id="ERROR_MSG">desktop devices only.</div>
        </div>

      
        {/* GAME OVER */}

          <div id="OVER">
            <div id="GAME_OVER">GAME OVER</div>
            <div id="SCORE">Your Score is :- {score}</div>
          </div>   
     

      </div>

      <div id="body_lower">
        <button id="Start" onClick={Starter}>
          START
        </button>
        <button id="Restart" onClick={ReStarter}>
          RESTART
        </button>
      </div>
    </div>
  );
}

export default Body;
