import Worker from "./worker?worker";

// Set up worker and canvas
const worker = new Worker();
const canvasBox = document.getElementById("canvas-box");
const canvas = document.createElement("canvas");
canvasBox?.appendChild(canvas);
canvas.id = "canvas";
const canvasStyle = document.getElementById("canvas");
const context = canvas.transferControlToOffscreen();

// Set up form
const form = document.querySelector("form");
const canvasSizeInput = document.getElementById(
  "canvas-size"
) as HTMLInputElement;
const fontSizeInput = document.getElementById("font-size") as HTMLInputElement;
const canvasColorInput = document.getElementById("color") as HTMLInputElement;
const submitButton = document.getElementById("submit") as HTMLButtonElement;
const icon = document.querySelector(".icon") as HTMLBodyElement;
const info = document.querySelector(".info") as HTMLBodyElement;

worker.postMessage(["setUpCanvas", context], [context]);
worker.onmessage = (e) => {
  if (e.data === "alert") {
    alert("Maximum character reached. Increase canvas size.");
  }
};
addEventListener("keydown", (e) => worker.postMessage([e.type, e.key]));

form?.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  if (canvasSizeInput && fontSizeInput && canvasColorInput) {
    const canvasSize = parseInt(canvasSizeInput.value);
    const fontSize = parseInt(fontSizeInput.value);
    const canvasColor = canvasColorInput.value;
    worker.postMessage(["submit", canvasSize, fontSize, canvasColor]);
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
  }
});

icon.addEventListener("mouseenter", () => {
  info.style.display = "block";
});

icon.addEventListener("mouseleave", () => {
  info.style.display = "none";
});
