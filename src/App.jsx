import { useState } from "react";
import useInterval from "@use-it/interval";
import "./App.css";

/*Possible todos
-If block goes to the edge make it appear on the other side or infinite grid



*/
function App() {
  const neighbourPositions = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [-1, 0],
    [1, 0],
  ];

  const numRows = 32;
  const numCol = 32;

  const [grid, setGrid] = useState(
    Array.from({ length: numRows }, () =>
      Array.from({ length: numCol }, () => 0)
    )
  );

  const [isRunning, setIsRunning] = useState(false);
  const [rangeval, setRangeval] = useState(1000);

  const gridClickHandler = (i, k) => {
    let newState = JSON.parse(JSON.stringify(grid));
    if (newState[i][k] === 1) {
      newState[i][k] = 0;
    } else {
      newState[i][k] = 1;
    }
    setGrid(newState);
  };

  const runSimulation = () => {
    let newState = JSON.parse(JSON.stringify(grid));
    grid.map((rows, i) =>
      rows.map((col, j) => {
        let neighbors = 0;
        neighbourPositions.forEach(([x, y]) => {
          const newI = i + x;
          const newK = j + y;
          if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCol) {
            neighbors += grid[newI][newK]; //Since the grid either contains 0 or 1 we can add that to the neighbors var
          }
        });
        if (neighbors < 2 || neighbors > 3) {
          newState[i][j] = 0;
        } else if (newState[i][j] === 0 && neighbors === 3) {
          newState[i][j] = 1;
        }
      })
    );
    return newState;
  };

  useInterval(() => {
    if (!isRunning) {
      return;
    } else {
      setGrid(() => runSimulation());
    }
  }, rangeval);

  return (
    <>
      <h1 className="title">Game Of Life</h1>
      <div className="content-container">
        <div className="controls">
          <button
            onClick={() => {
              setIsRunning(() => !isRunning);
            }}
          >
            {isRunning ? "Stop" : "Run"}
          </button>
          <button
            onClick={() =>
              grid.map((rows, i) =>
                rows.map((col, k) => {
                  const newGridState = [...grid];
                  newGridState[i][k] = Math.random() > 0.7 ? 1 : 0;
                  setGrid(newGridState);
                })
              )
            }
          >
            Random
          </button>
          <button
            onClick={() =>
              grid.map((rows, i) =>
                rows.map((col, k) => {
                  const newGridState = [...grid];
                  newGridState[i][k] = 0;
                  setGrid(newGridState);
                })
              )
            }
          >
            Clear
          </button>
          <div className="range">
            <input
              type="range"
              min="100"
              value={rangeval}
              max="4000"
              onChange={(event) => setRangeval(event.target.value)}
            />
            <h4>{rangeval}</h4>
          </div>
        </div>
        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numRows},22px)`,
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                onClick={() => gridClickHandler(i, k)}
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: grid[i][k] ? "black" : "#8B8C8C",
                  border: "solid 1px black",
                }}
              ></div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
