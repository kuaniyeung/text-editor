import "./style.css";
import Worker from "./worker?worker";

const worker = new Worker();
const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.id = "canvas";
const context = canvas.transferControlToOffscreen();
const fontFile = new FontFace(
  "jetbrains-mono",
  "url(https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap)"
);


fontFile.loaded.then(
  () => {
    document.fonts.add(fontFile);
    worker.postMessage(["setUpCanvas", context], [context]);
    addEventListener("keydown", (e) => worker.postMessage([e.type, e.key]));
  },
  (err) => {
    console.error(err);
  }
);
