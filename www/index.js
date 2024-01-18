import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg.wasm";
import "./styles.css";

const LIVE_RGB = [
  [244, 43, 3],
  [0, 95, 190],
  [0, 135, 36],
];

const getRule = () => {
  const rule_set = [30, 54, 60, 62, 90, 102, 110, 126, 150, 158, 182, 188, 220];
  return rule_set[Math.floor(Math.random() * rule_set.length)];
};

const w = window.innerWidth;
const h = window.innerHeight;

const universe = Universe.new(w, h, getRule());

const canvas = document.getElementById("wolfram-canvas");
const ctx = canvas.getContext("2d");
canvas.width = w;
canvas.height = h;
ctx.imageSmoothingEnabled = false;

const changeColour = () => {
  const c = LIVE_RGB[Math.floor(Math.random() * LIVE_RGB.length)];
  ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
};

const drawGrid = () => {
  const grid = new Uint8Array(memory.buffer, universe.grid_ptr(), w * h);

  for (let y = 0; y < h; y++) {
    const row = grid.slice(y * w, y * w + w);

    for (let x = 0; x < w; x++) {
      if (row[x] === 1) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
};

const container = document.getElementById("container");

const fadeIn = () => {
  container.classList.remove("fadeOut");
  container.classList.add("fadeIn");
};

const fadeOut = () => {
  container.classList.remove("fadeIn");
  container.classList.add("fadeOut");
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const renderLoop = async () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  changeColour();
  drawGrid();
  fadeIn();
  await delay(11000);
  universe.set_rule(getRule());
  universe.generate_grid();
  fadeOut();
  await delay(1000);
  requestAnimationFrame(renderLoop);
};

universe.set_rule(getRule());
universe.generate_grid();
changeColour();
requestAnimationFrame(renderLoop);
