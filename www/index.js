import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg.wasm";

const CELL_SIZE = 3;
const LIVE_RGBA = [
  [244, 43, 3, 255],
  [0, 95, 190, 255],
  [0, 135, 36, 255],
];
const RGBA_LEN = 4;

const getRule = () => {
  const rule_set = [
    30, 54, 60, 62, 90, 94, 102, 110, 122, 126, 150, 158, 182, 188, 220, 250,
  ];
  return rule_set[Math.floor(Math.random() * rule_set.length)];
};

const getColour = () => {
  return Math.floor(Math.random() * LIVE_RGBA.length);
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

let lookup = {};

const drawCells = () => {
  console.time("drawCells");
  const inputRow = new Uint8Array(
    memory.buffer,
    universe.last_row_ptr(),
    width
  );
  const canvasRow = new Uint8ClampedArray(
    width * CELL_SIZE * CELL_SIZE * RGBA_LEN
  );

  for (let i = 0; i < width; i++) {
    if (inputRow[i] === 1) {
      const colIndex = i % width;
      const colOffset = colIndex * CELL_SIZE * RGBA_LEN;

      if (lookup[i]) {
        canvasRow.set(lookup[i], colOffset);
        continue;
      }

      lookup[i] = Array.from({ length: CELL_SIZE }, () => [
        ...LIVE_RGBA[current_colour],
      ]).flat();
      canvasRow.set(lookup[i], colOffset);
    }
  }

  if (current_line_number === height) {
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(ctx.canvas, 0, -CELL_SIZE);
    ctx.globalCompositeOperation = "source-over";
    current_line_number--;
  }

  for (let i = 0; i < CELL_SIZE; i++) {
    ctx.putImageData(
      new ImageData(canvasRow, canvas.width, CELL_SIZE),
      0,
      CELL_SIZE * current_line_number + i
    );
  }

  current_line_number++;
  total_lines_processed++;

  if (total_lines_processed % (height * 2) === 0) {
    current_colour = getColour();
    universe.set_rule(getRule());
  }
  console.timeEnd("drawCells");
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
