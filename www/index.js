import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg.wasm";

const CELL_SIZE = 1;
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

const getColour = () => {
  return LIVE_RGB[Math.floor(Math.random() * LIVE_RGB.length)];
};

const universe = Universe.new(
  window.innerWidth / CELL_SIZE,
  window.innerHeight / CELL_SIZE,
  getRule()
);
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("wolfram-canvas");
canvas.width = width * CELL_SIZE;
canvas.height = height * CELL_SIZE;

const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(canvas.width, canvas.height);
ctx.imageSmoothingEnabled = false;
ctx.putImageData(imageData, 0, 0);

let current_line_number = 0;
let total_lines_processed = 0;
let current_colour = getColour();

const drawCells = () => {
  const row_ptr = universe.get_row(
    CELL_SIZE,
    current_colour[0],
    current_colour[1],
    current_colour[2]
  );

  const canvasRow = new Uint8ClampedArray(
    new Uint8Array(memory.buffer, row_ptr, width * CELL_SIZE * CELL_SIZE * 4)
  );

  if (current_line_number === height) {
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas, 0, -CELL_SIZE);
    ctx.globalCompositeOperation = "source-over";
    current_line_number--;
  }

  ctx.putImageData(
    new ImageData(canvasRow, canvas.width, CELL_SIZE),
    0,
    CELL_SIZE * current_line_number
  );

  current_line_number++;
  total_lines_processed++;

  if (total_lines_processed % (height * 2) === 0) {
    current_colour = getColour();
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
