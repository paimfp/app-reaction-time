import { fromEvent } from "rxjs";

const getEl = (query) => document.querySelector(query);

const DOT_RADIUS = 50;
const dot = getEl(".dot");
dot.style.width = DOT_RADIUS + "px";
dot.style.height = DOT_RADIUS + "px";

export const gameArea = getEl(".game-area");
const areaSide = gameArea.clientWidth;
const areaCenter = [gameArea.clientWidth / 2, gameArea.clientHeight / 2];

const moveDot = ([x, y]) => {
  dot.style.left = x + "px";
  dot.style.top = y + "px";
};

const centerDot = () =>
  moveDot([areaCenter[0] - DOT_RADIUS / 2, areaCenter[1] - DOT_RADIUS / 2]);

const randomCoords = () => {
  const randX = Math.random() * (areaSide - DOT_RADIUS);
  const randY = Math.random() * (areaSide - DOT_RADIUS);
  return [randX, randY];
};

export const moveRandom = () => moveDot(randomCoords());

export const setDotText = (value) => (dot.innerText = value);

export let isPlaying = true;

export const updateResults = (state) => {
  let html = `Results:<br>Average:`;
  if (state.length) {
    html = `Results: ${state.join("ms, ")}ms <br> Average: ${(
      state.reduce((x, y) => x + y) / state.length
    ).toFixed(2)}ms`;
  }
  getEl(".speed").innerHTML = html;
};

export const updateError = (err) => {
  getEl(".error").innerHTML = err;
};

export const init = () => {
  centerDot();
  updateResults([]);
  setDotText("Start");
  updateError(0);
};

export const endGame = () => {
  centerDot();
  isPlaying = false;
  dot.style.backgroundColor = "#c3c3c3";
  setDotText("Refresh");
  fromEvent(dot, "click").subscribe(() => window.location.reload());
};
