let size = 10;
let buffer = new Array(size);

let gap_size = 10;
let gap_left = 0;
let gap_right = gap_size - gap_left - 1;

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let cursorPosition;
let eventKey;
let value;

// Function that is used to grow the gap at index position and return the array
const grow = (k: number, position: number) => {
  let a = buffer.slice(position, gap_size);
  // Copy characters of buffer to a[] after position
  buffer.splice(position, gap_size - position, ...Array(k).fill(undefined));
  // Insert a gap of k from index position
  // Reinsert the remaining array
  buffer.splice(position + k, 0, ...a);
  gap_size += k;
  gap_right += k;
};

// Function that is used to move the gap left and right in the array
const moveGap = (direction: string) => {
  if (direction === "left") {
    gap_left--;
    gap_right--;
    buffer[gap_right + 1] = buffer[gap_left];
    buffer[gap_left] = undefined;
  } else if (direction === "right") {
    gap_left++;
    gap_right++;
    buffer[gap_left - 1] = buffer[gap_right];
    buffer[gap_right] = undefined;
  }
};

// Function to insert the string to the buffer at point position
const insert = (input: string) => {
  // If the gap is empty grow the size
  if (gap_right === gap_left) {
    let k = 10;
    grow(k, gap_left);
  }

  // Insert the character in the gap and move the gap
  buffer[gap_left] = input;
  gap_left++;
};

const remove = () => {
  gap_left--;
  buffer[gap_left] = undefined;
};

const display = () => {
  const span = 24 / (10 / 6);
  ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.width);

  const aBuffer = buffer.slice(0, gap_left).join("");
  const bBuffer = buffer.slice(gap_right).join("");

  // render value before cursor
  ctx.fillText(aBuffer, 0, 0);

  // render cursor
  ctx.fillRect((cursorPosition = span * aBuffer.length - 1), 0, 1, 24);

  // render value after cursor
  ctx.fillText(bBuffer, span * aBuffer.length, 0);
};

// Worker messages
onmessage = (e) => {
  if (e.data[0] === "setUpCanvas") {
    // define canvas from main to offscreen
    canvas = e.data[1];
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // canvas size
    canvas.width = 500;
    canvas.height = 500;

    // font style
    ctx.font = "24px jetbrains-mono";
    ctx.textBaseline = "top";

    // ctx.fillText("abcde", 0, 0);
  }

  if (e.data[0] === "keydown") {
    eventKey = e.data[1];

    switch (eventKey) {
      case "Shift":
      case "Control":
      case "Alt":
      case "Meta":
      case "Tab":
      case "Fn":
      case "ArrowUp":
      case "ArrowDown":
        break;
      case "ArrowLeft":
        moveGap("left");
        break;
      case "ArrowRight":
        moveGap("right");
        break;
      case "Backspace":
        remove();
        break;
      case "Enter":
        value = "\n";
        insert(value);
        break;
      default:
        insert(eventKey);
    }

    // console.log(eventKey);
  }
  display();
  console.log(buffer, gap_left, gap_right, gap_size);
};
