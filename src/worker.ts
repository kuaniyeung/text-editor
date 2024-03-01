let size = 10;
let buffer = new Array(size);

let gap_size = 10;
let gap_left = 0;
let gap_right = gap_size - gap_left - 1;

let aBuffer;
let bBuffer;
let aLines;
let bLines;

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let canvasSize = 30;
let fontSize = 24;
let fontWidth = fontSize / (10 / 6);
let fontFamily = "monospace";
let cursorPositionX: number;
let cursorPositionY: number;
let eventKey;

// Function that is used to grow the gap when it reaches zero
const grow = (growLength: number) => {
  let a = buffer.slice(gap_left, gap_size);

  // Copy characters of buffer to a[] after gap_left
  buffer.splice(
    gap_left,
    gap_size - gap_left,
    ...Array(growLength).fill(undefined)
  );

  // Insert a gap of growLength from index gap_left & reinsert the remaining array
  buffer.splice(gap_left + growLength, 0, ...a);
  gap_size += growLength;
  gap_right += growLength;
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
  } else if (direction === "up") {
  } else if (direction === "down") {
  }
};

// Function to insert a character to the buffer at cursor
const insert = (input: string | null) => {
  // If the gap is empty, grow the size
  if (gap_right === gap_left) {
    grow(10);
  }

  // Insert the character in the gap and move the gap
  buffer[gap_left] = input;
  gap_left++;
};

// Function to remove one character at cursor
const remove = () => {
  gap_left--;
  buffer[gap_left] = undefined;
};

const splitArrayByNull = (arr: Array<string | null>) => {
  const result = [];
  let segment = [];

  // for (let i = 0; i < arr.length; i++) {
  //   if (arr[i] === null) {
  //     if (segment.length > 0) {
  //       result.push(segment.join(""));
  //       segment = [];
  //     } else {
  //       result.push("");
  //     }
  //   } else {
  //     segment.push(arr[i]);
  //   }
  // }

  // // Add the last segment if it's not empty
  // if (segment.length > 0) {
  //   result.push(segment.join(""));
  // } else if (arr[arr.length - 1] === null) {
  //   result.push("");
  // }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === null) {
      if (segment.length > 0) {
        if (segment.length <= 30) {
          result.push(segment.join("")); // Join the segment into a string
        } else {
          // Split the segment into multiple segments of maximum 30 elements each
          for (let j = 0; j < segment.length; j += 30) {
            result.push(segment.slice(j, j + 30).join(""));
          }
        }
        segment = [];
      } else {
        // If segment is already empty (i.e., consecutive nulls), add an empty string
        result.push("");
      }
    } else {
      segment.push(arr[i]);
    }
  }

  // Add the last segment if it's not empty
  if (segment.length > 0) {
    if (segment.length <= 30) {
      result.push(segment.join("")); // Join the last segment into a string
    } else {
      // Split the last segment into multiple segments of maximum 30 elements each
      for (let j = 0; j < segment.length; j += 30) {
        result.push(segment.slice(j, j + 30).join(""));
      }
    }
  } else if (arr[arr.length - 1] === null) {
    result.push("");
  }

  return result;
};

const handleLineBreak = () => {
  // line break when any lines reaches canvas size
};

const display = () => {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.width);

  // Define content divided by cursor
  aBuffer = buffer.slice(0, gap_left);
  bBuffer = buffer.slice(gap_right + 1);
  const lineHeight = fontSize;

  // console.log("aBuffer: ", aBuffer);
  // console.log("bBuffer: ", bBuffer);

  // Render value before cursor

  aLines = splitArrayByNull(aBuffer);
  let yPositionOfA = 1; // 1px padding top

  for (let i = 0; i < aLines.length; i++) {
    ctx.fillText(aLines[i], 0, yPositionOfA);
    yPositionOfA += lineHeight;
  }

  // Render cursor

  if (aLines.length > 0) {
    cursorPositionX = aLines[aLines.length - 1].length * fontWidth;
  }
  cursorPositionY = (aLines.length - 1) * 24;

  ctx.fillRect(cursorPositionX, cursorPositionY, 1, 24);

  // Render value after cursor

  bLines = splitArrayByNull(bBuffer);

  // console.log("aLines: ", aLines);
  // console.log("aLines length: ", aLines.length);
  // console.log("bLines: ", bLines);
  // console.log("bLines length: ", bLines.length);
  // console.log("cursorPositionX: ", cursorPositionX);
  // console.log("cursorPositionY: ", cursorPositionY);

  if (bBuffer.length === 0) return;
  let yPositionOfB = cursorPositionY;

  for (let i = 0; i < bLines.length; i++) {
    if (i === 0) {
      ctx.fillText(bLines[i], cursorPositionX, yPositionOfB);
    } else {
      ctx.fillText(bLines[i], 0, yPositionOfB);
    }
    yPositionOfB += lineHeight;
  }
};

// Worker messages
onmessage = (e) => {
  if (e.data[0] === "setUpCanvas") {
    // define canvas from main to offscreen
    canvas = e.data[1];
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // canvas size
    canvas.width = fontWidth * canvasSize + 2; // 2px padding
    canvas.height = fontWidth * canvasSize + 2; // 2px padding

    // font style
    ctx.font = fontSize + "px " + fontFamily;
    ctx.textBaseline = "top";
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
      case "CapsLock":
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
        insert(null);
        break;
      default:
        insert(eventKey);
    }

    // console.log(eventKey);
  }
  display();
  // console.log(buffer, gap_left, gap_right, gap_size);
};
