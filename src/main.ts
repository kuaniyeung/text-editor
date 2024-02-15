import "./style.css";
import Worker from "./worker?worker";

const worker = new Worker();
const viewport = Int16Array.from([innerWidth, innerHeight, devicePixelRatio]);
const canvas = document.body.appendChild(document.createElement("canvas"));
const context = canvas.transferControlToOffscreen();

worker.postMessage(["setUpCanvas", context, viewport], [context]);

addEventListener("keydown", (e) => worker.postMessage([e.type, e.key, e.code]));
