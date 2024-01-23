import { Universe } from "wasm-wolfram";
import { memory } from "wasm-wolfram/wolfram_rust_bg.wasm";
import "./styles.css";

const LIVE_RGB = [
  [244, 43, 3],
  [0, 95, 190],
  [0, 135, 36],
];
const rule_set = [30, 54, 60, 62, 90, 102, 110, 126, 150, 158, 182, 188, 220];
const background_images = [1, 2, 3, 4, 5, 6, 7, 8];
const w = window.innerWidth;
const h = window.innerHeight;

const canvas = document.getElementById("wolfram-canvas");
const container = document.getElementById("container");
const animation_switch = document.getElementById("doAnimate");

background_images.forEach((i) => {
  const img = new Image();
  img.src = `assets/${i}.png`;
});

animation_switch.addEventListener("change", function () {
  doAnimate = animation_switch.checked;
  if (doAnimate) {
    container.style.backgroundImage = "none";
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    current_line_number = 0;
    total_lines_processed = 0;
    container.style.backgroundImage = changeBackgroundImage();
  }
});

window.addEventListener("resize", () => {
  container.style.backgroundSize = "cover";
});

const getRule = () => {
  return rule_set[Math.floor(Math.random() * rule_set.length)];
};

const universe = Universe.new(w, getRule());

const ctx = canvas.getContext("2d");
canvas.width = w;
canvas.height = h;
ctx.imageSmoothingEnabled = false;

const changeColour = () => {
  const c = LIVE_RGB[Math.floor(Math.random() * LIVE_RGB.length)];
  ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
};

const changeBackgroundImage = () => {
  const image_num =
    background_images[Math.floor(Math.random() * background_images.length)];
  container.style.backgroundImage = `url("assets/${image_num}.png")`;
};

let current_line_number = 0;
let total_lines_processed = 0;
let doAnimate = false;

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

const scrollBackground = () => {
  if (doAnimate) {
    universe.tick();
    drawCells();
  }
  requestAnimationFrame(scrollBackground);
};

changeColour();
requestAnimationFrame(scrollBackground);

const fadeIn = () => {
  container.classList.remove("fadeOut");
  container.classList.add("fadeIn");
};

const fadeOut = () => {
  container.classList.remove("fadeIn");
  container.classList.add("fadeOut");
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const swapBackgroundImage = async () => {
  if (!doAnimate) {
    fadeOut();
    await delay(500);
    changeBackgroundImage();
    fadeIn();
    await delay(400);
  }
  setTimeout(() => {
    requestAnimationFrame(swapBackgroundImage);
  }, 8000);
};

requestAnimationFrame(swapBackgroundImage);
