import "./style.css";
import Worker from "./worker?worker";

const worker = new Worker();
const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.id = "canvas"
const context = canvas.transferControlToOffscreen();

worker.postMessage(["setUpCanvas", context, null], [context]);

addEventListener("keydown", (e) => worker.postMessage([e.type, e.key, e.code]));
