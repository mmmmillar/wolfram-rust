import "./styles.css";

const background_images = [1, 2, 3, 4, 5, 6, 7, 8];

background_images.forEach((i) => {
  const img = new Image();
  img.src = `assets/${i}.png`;
});

const container = document.getElementById("container");

const changeBackgroundImage = () => {
  const image_num =
    background_images[Math.floor(Math.random() * background_images.length)];
  container.style.backgroundImage = `url("assets/${image_num}.png")`;
};

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
  fadeOut();
  await delay(450);
  changeBackgroundImage();
  fadeIn();
  await delay(350);
  setTimeout(() => {
    requestAnimationFrame(swapBackgroundImage);
  }, 8000);
};

requestAnimationFrame(swapBackgroundImage);

let scale = 1;
let inc = 0.001;

const zoom = async () => {
  scale += inc;
  container.style.transform = `scale(${scale})`;
  if (scale > 1.5 || scale < 1) {
    inc *= -1;
  }
  setTimeout(() => {
    requestAnimationFrame(zoom);
  }, 50);
};

requestAnimationFrame(zoom);
