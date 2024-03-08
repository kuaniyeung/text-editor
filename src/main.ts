import Worker from "./worker?worker";

// Declare worker and canvas
const worker = new Worker();
const canvasBox = document.getElementById("canvas-box");
const canvas = document.createElement("canvas");
canvasBox?.appendChild(canvas);
canvas.id = "canvas";
const canvasStyle = document.getElementById("canvas");
const context = canvas.transferControlToOffscreen();

// Declare form
const form = document.querySelector("form");
const canvasSizeInput = document.getElementById(
  "canvas-size"
) as HTMLInputElement;
const fontSizeInput = document.getElementById("font-size") as HTMLInputElement;
const canvasColorInput = document.getElementById("color") as HTMLInputElement;
const submitButton = document.getElementById("submit") as HTMLButtonElement;
const icon = document.querySelector(".icon") as HTMLBodyElement;
const info = document.querySelector(".info") as HTMLBodyElement;
let fontWidth: number;
let windowWidth: number;
let maxCanvasSize: number;
let maxFontSize: number;

// Set up worker and canvas
worker.postMessage(["setUpCanvas", context], [context]);
worker.onmessage = (e) => {
  if (e.data === "alert") {
    alert("Maximum character reached. Increase canvas size.");
  }
};
addEventListener("keydown", (e) => worker.postMessage([e.type, e.key]));

// Set up form
form?.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  if (canvasSizeInput && fontSizeInput && canvasColorInput) {
    const canvasSize = parseInt(canvasSizeInput.value);
    const fontSize = parseInt(fontSizeInput.value);
    const canvasColor = canvasColorInput.value;

    if (
      canvasSizeInput &&
      fontSizeInput &&
      canvasColorInput &&
      canvasStyle &&
      submitButton
    ) {
      document.body.style.color = canvasColor;
      canvasSizeInput.style.borderColor = canvasColor;
      fontSizeInput.style.borderColor = canvasColor;
      canvasColorInput.style.borderColor = canvasColor;
      canvasStyle.style.borderColor = canvasColor;
      submitButton.style.borderColor = canvasColor;
      submitButton.style.backgroundColor = canvasColor;
    }
    console.log(123);
    worker.postMessage(["submit", canvasSize, fontSize, canvasColor]);
  }
});

icon.addEventListener("mouseenter", () => {
  info.style.display = "block";
});

icon.addEventListener("mouseleave", () => {
  info.style.display = "none";
});

const updateMaxSizes = () => {
  fontWidth = parseInt(fontSizeInput.value) / (10 / 6);
  windowWidth = window.innerWidth;
  maxCanvasSize = Math.floor((windowWidth - 40) / fontWidth);
  maxFontSize = Math.floor(
    ((windowWidth - 40) / parseInt(canvasSizeInput.value)) * (10 / 6)
  );

  // Update max attributes of input fields
  canvasSizeInput.setAttribute("max", maxCanvasSize.toString());
  fontSizeInput.setAttribute("max", maxFontSize.toString());
};

const updateInputValues = () => {
  const currentCanvasSize = canvasSizeInput.value;
  const currentFontSize = fontSizeInput.value;
  const currentFontWidth = parseInt(fontSizeInput.value) / (10 / 6);

  // Update the input values
  canvasSizeInput.value = currentCanvasSize;
  fontSizeInput.value = currentFontSize;
  fontWidth = currentFontWidth;

  updateMaxSizes();
};

updateInputValues();

canvasSizeInput.addEventListener("input", updateInputValues);
fontSizeInput.addEventListener("input", updateInputValues);

// Limit maximum canvas and font size

canvasSizeInput.addEventListener("input", () => {
  const currentSize = parseInt(canvasSizeInput.value);

  if (canvasSizeInput.value !== "") {
    if (currentSize > maxCanvasSize) {
      alert(
        `Maximum canvas size ${maxCanvasSize} reached. Please choose a smaller number.`
      );

      canvasSizeInput.value = canvasSizeInput.value.slice(0, -1);
    }
  }
});

canvasSizeInput.addEventListener("change", () => {
  const currentSize = parseInt(canvasSizeInput.value);

  if (canvasSizeInput.value !== "") {
    if (currentSize % 2 !== 0) {
      alert("Please enter an even number for canvas size.");

      canvasSizeInput.value = canvasSizeInput.value.slice(0, -1);
    }
  }
});

fontSizeInput.addEventListener("input", () => {
  const currentSize = parseInt(fontSizeInput.value);

  if (fontSizeInput.value !== "") {
    if (currentSize > maxFontSize) {
      alert(
        `Maximum font size ${maxFontSize} reached. Please choose a smaller number.`
      );

      fontSizeInput.value = fontSizeInput.value.slice(0, -1);
    }
  }
});

form?.addEventListener("submit", () => {
  console.log(
    "windowWidth: ",
    windowWidth,
    ", canvasSize value: ",
    canvasSizeInput.value,
    ", maxCanvasSize: ",
    maxCanvasSize,
    ", fontSize value: ",
    fontSizeInput.value,
    ", maxFontSize: ",
    maxFontSize
  );
});
