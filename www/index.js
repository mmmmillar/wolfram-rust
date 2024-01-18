import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg.wasm";

const LIVE_RGB = [
  [244, 43, 3],
  [0, 95, 190],
  [0, 135, 36],
];

const getRule = () => {
  const rule_set = [
    30, 54, 60, 62, 90, 94, 102, 110, 122, 126, 150, 158, 182, 188, 220, 250,
  ];
  return rule_set[Math.floor(Math.random() * rule_set.length)];
};

const w = window.innerWidth;
const h = window.innerHeight;

const universe = Universe.new(w, h, getRule());
const canvas = document.getElementById("wolfram-canvas");
canvas.width = w;
canvas.height = h;

const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const changeColour = () => {
  const c = LIVE_RGB[Math.floor(Math.random() * LIVE_RGB.length)];
  ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
};
changeColour();

let current_line_number = 0;
let total_lines_processed = 0;

const drawCells = () => {
  if (current_line_number === h) {
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas, 0, -1);
    ctx.globalCompositeOperation = "source-over";
    current_line_number--;
  }

  const row = new Uint8Array(memory.buffer, universe.last_row_ptr(), w);

  for (let x = 0; x < w; x++) {
    if (row[x] === 1) {
      ctx.fillRect(x, current_line_number, 1, 1);
    }
  }

  current_line_number++;

  if (++total_lines_processed % (h * 2) === 0) {
    changeColour();
    universe.set_rule(getRule());
  }
};

const container = document.getElementById("container");
let scale = 1;
let inc = 0.0003;

const zoom = () => {
  scale += inc;
  container.style.transform = `scale(${scale})`;
  if (scale > 1.5 || scale < 1) {
    inc *= -1;
  }
};

const renderLoop = () => {
  universe.tick();
  drawCells();
  zoom();
  requestAnimationFrame(renderLoop);
};

requestAnimationFrame(renderLoop);
