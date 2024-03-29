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
const canvasWidthInput = document.getElementById(
  "canvas-width"
) as HTMLInputElement;
const canvasHeightInput = document.getElementById(
  "canvas-height"
) as HTMLInputElement;
const fontSizeInput = document.getElementById("font-size") as HTMLInputElement;
const canvasColorInput = document.getElementById("color") as HTMLInputElement;
const backgroundColorInput = document.getElementById(
  "background-color"
) as HTMLInputElement;
const canvasBackgroundColorInput = document.getElementById(
  "canvas-background-color"
) as HTMLInputElement;
const submitButton = document.getElementById("submit") as HTMLButtonElement;
const inputs = document.querySelectorAll("input");
let isAnyInputFocused = false;
let windowWidth: number;
let maxCanvasWidth: number;

// Set up form
form?.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  if (
    canvasWidthInput &&
    canvasHeightInput &&
    fontSizeInput &&
    canvasColorInput &&
    backgroundColorInput &&
    canvasBackgroundColorInput
  ) {
    const canvasWidth = parseInt(canvasWidthInput.value);
    const canvasHeight = parseInt(canvasHeightInput.value);
    const fontSize = parseInt(fontSizeInput.value);
    const canvasColor = canvasColorInput.value;
    const backgroundColor = backgroundColorInput.value;
    const canvasBackgroundColor = canvasBackgroundColorInput.value;

    if (
      canvasWidthInput &&
      fontSizeInput &&
      canvasColorInput &&
      backgroundColorInput &&
      canvasBackgroundColorInput &&
      canvasStyle &&
      submitButton
    ) {
      document.body.style.color = canvasColor;
      document.body.style.backgroundColor = backgroundColor;
      canvasWidthInput.style.borderColor = canvasColor;
      canvasHeightInput.style.borderColor = canvasColor;
      fontSizeInput.style.borderColor = canvasColor;
      canvasColorInput.style.borderColor = canvasColor;
      canvasStyle.style.borderColor = canvasColor;
      submitButton.style.borderColor = canvasColor;
      submitButton.style.backgroundColor = canvasColor;
    }

    worker.postMessage([
      "submit",
      canvasWidth,
      canvasHeight,
      fontSize,
      canvasColor,
      canvasBackgroundColor,
    ]);
  }
});

const updateMaxSizes = () => {
  windowWidth = window.innerWidth;
  maxCanvasWidth = Math.floor(windowWidth - 40);

  // Update max attributes of input field
  canvasWidthInput.setAttribute("max", maxCanvasWidth.toString());
};

const updateInputValues = () => {
  const currentCanvasWidth = canvasWidthInput.value;
  const currentFontSize = fontSizeInput.value;

  // Update the input values
  canvasWidthInput.value = currentCanvasWidth;
  fontSizeInput.value = currentFontSize;

  updateMaxSizes();
};

updateInputValues();

canvasWidthInput.addEventListener("input", updateInputValues);
canvasHeightInput.addEventListener("input", updateInputValues);
fontSizeInput.addEventListener("input", updateInputValues);

inputs.forEach((e) => {
  e.addEventListener("focusin", () => (isAnyInputFocused = true));
  e.addEventListener("focusout", () => (isAnyInputFocused = false));
});
addEventListener("keydown", () => console.log(isAnyInputFocused));

// Prevent spacebar from moving screen downward
addEventListener("keydown", (e) => {
  if (e.key === " ") e.preventDefault();
});

// Set up worker and canvas
worker.postMessage(["setUpCanvas", context], [context]);
worker.onmessage = (e) => {
  if (e.data === "alert") {
    alert("Maximum character reached. Increase canvas size.");
  }
};

addEventListener("keydown", (e) => {
  if (!isAnyInputFocused) worker.postMessage([e.type, e.key]);
});
