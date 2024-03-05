import "./style.css";
import Worker from "./worker?worker";

const worker = new Worker();
const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.id = "canvas";
const context = canvas.transferControlToOffscreen();

const showAlert = (msg: string) => {
  alert(msg);
};

worker.postMessage(["setUpCanvas", context], [context]);
addEventListener("keydown", (e) => worker.postMessage([e.type, e.key]));
worker.onmessage = (e) => {
  if (e.data[0] === "alert") {
    showAlert("Maximum character reached. Increase canvas size.");
  }
};
