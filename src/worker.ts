let size = 10;
let buffer = new Array(size);

let gap_size = 10;
let gap_left = 0;
let gap_right = gap_size - gap_left - 1;

let aBuffer: Array<string | null | undefined>;
let bBuffer: Array<string | null | undefined>;
let aLines: Array<string>;
let bLines: Array<string>;

let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;
let canvasSize = 30;
let canvasPadding = 1;
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
  // --- LEFT --- //
  if (direction === "left") {
    if (gap_left === 0) return;

    gap_left--;
    gap_right--;
    buffer[gap_right + 1] = buffer[gap_left];
    buffer[gap_left] = undefined;

    // --- RIGHT --- //
  } else if (direction === "right") {
    if (gap_right === gap_size) return;

    gap_left++;
    gap_right++;
    buffer[gap_left - 1] = buffer[gap_right];
    buffer[gap_right] = undefined;

    // --- UP --- //
  } else if (direction === "up") {
    if (aLines.length === 1 && gap_left < canvasSize) return;
    let move;

    const lastALine = aLines[aLines.length - 1];
    const secondLastALine = aLines[aLines.length - 2];
    const lengthOfSecondLastMinusLast =
      secondLastALine.length - lastALine.length;

    // Check if gap is in a new line
    if (secondLastALine.length < canvasSize) {
      // If last line is longer than current line
      if (lengthOfSecondLastMinusLast > 0) {
        gap_left -= lastALine.length + 1 + lengthOfSecondLastMinusLast;
        gap_right -= lastALine.length + 1 + lengthOfSecondLastMinusLast;

        move = buffer.slice(
          gap_left,
          gap_left + lastALine.length + 1 + lengthOfSecondLastMinusLast
        );
        console.log(move);

        buffer.splice(
          gap_left,
          lastALine.length + 1 + lengthOfSecondLastMinusLast
        );
        buffer.splice(gap_right + 1, 0, ...move);
      }

      // If last line is shorter than current line
      else {
        gap_left -= lastALine.length + 1;
        gap_right -= lastALine.length + 1;

        move = buffer.slice(gap_left, gap_left + lastALine.length + 1);
        console.log(move);

        buffer.splice(gap_left, lastALine.length + 1);
        buffer.splice(gap_right + 1, 0, ...move);
      }
    } else {
      gap_left -= canvasSize;
      gap_right -= canvasSize;

      move = buffer.slice(gap_left, gap_left + canvasSize);
      console.log(move);

      buffer.splice(gap_left, canvasSize);
      buffer.splice(gap_right + 1, 0, ...move);
    }

    // --- DOWN --- //
  } else if (direction === "down") {
    if (gap_right - 1 === gap_size || bLines.length < 2) return;

    let move;
    const lastALine = aLines[aLines.length - 1];
    const firstBLine = bLines[0];
    const secondBLine = bLines[1];
    const firstBLineContainsNull = bBuffer
      .slice(0, canvasSize - lastALine.length)
      .includes(null);
    console.log(firstBLineContainsNull);

    // Check if next line is a new line or continuous of current line
    if (firstBLineContainsNull) {
      console.log("true");

      // If next line length is longer than current cursor position
      if (secondBLine.length > lastALine.length) {
        console.log("true again");
        move = buffer.slice(
          gap_right + 1,
          gap_right + 1 + firstBLine.length + 1 + lastALine.length
        );

        buffer.splice(gap_right + 1, firstBLine.length + 1 + lastALine.length);
        buffer.splice(gap_left, 0, ...move);

        gap_left += firstBLine.length + 1 + lastALine.length;
        gap_right += firstBLine.length + 1 + lastALine.length;
      }

      // If next line length is shorter than current cursor position
      else {
        console.log("false again");
        move = buffer.slice(
          gap_right + 1,
          gap_right + 1 + firstBLine.length + 1 + secondBLine.length
        );

        buffer.splice(
          gap_right + 1,
          firstBLine.length + 1 + secondBLine.length
        );
        buffer.splice(gap_left, 0, ...move);

        gap_left += firstBLine.length + 1 + secondBLine.length;
        gap_right += firstBLine.length + 1 + secondBLine.length;
      }
    } else {
      console.log("false");
      move = buffer.slice(gap_right + 1, gap_right + 1 + canvasSize);

      buffer.splice(gap_right + 1, canvasSize);
      buffer.splice(gap_left, 0, ...move);

      gap_left += canvasSize;
      gap_right += canvasSize;
    }
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

const handleLineBreak = (arr: Array<string | null | undefined>) => {
  const result = [];
  let segment = [];

  for (let i = 0; i < arr.length; i++) {
    // null represent new line entry by "Enter"
    if (arr[i] === null) {
      if (segment.length > 0) {
        // If segment does not exceed canavas size, join the segment into a string
        if (segment.length <= canvasSize) {
          result.push(segment.join(""));
        } else {
          // If segment longer than canvas size, handle line break for text wrapping by spliting the segment into multiple segments of maximum canvas size elements each
          for (let j = 0; j < segment.length; j += canvasSize) {
            result.push(segment.slice(j, j + canvasSize).join(""));
          }
        }

        // Reset segment after pushing to result
        segment = [];
      } else {
        // If segment is already empty (i.e., consecutive nulls), add an empty string for new line
        result.push("");
      }
    } else {
      segment.push(arr[i]);
    }
  }

  // Add the last segment if it's not empty
  if (segment.length > 0) {
    // If last segment shorter than canvas size, join segment into string
    if (segment.length <= canvasSize) {
      result.push(segment.join(""));
    } else {
      // Split the last segment into multiple segments of maximum 30 elements each
      for (let j = 0; j < segment.length; j += canvasSize) {
        result.push(segment.slice(j, j + canvasSize).join(""));
      }
    }
  }

  // If the last element of the result is null, add an empty string
  if (arr[arr.length - 1] === null && result.length > 0) {
    result.push("");
  }

  // If the last segment in the result is exactly 30 characters long, add an empty string
  if (result.length > 0 && result[result.length - 1].length === canvasSize) {
    result.push("");
  }

  return result;
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

  aLines = handleLineBreak(aBuffer);
  const lastALine = aLines[aLines.length - 1];
  let yPositionOfA = canvasPadding;

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

  if (bBuffer.length === 0) {
    bLines = [];
    return;
  }

  // Account for first B line's length according to last A line

  // If first line is not a new line and is longer than the segment until next new line
  if (
    bBuffer.slice(0, bBuffer.indexOf(null)).length >
      canvasSize - lastALine.length &&
    bBuffer[0] !== null
  ) {
    const firstBLine = bBuffer
      .map((e, i) => {
        if (i < canvasSize - lastALine.length) {
          return e;
        }
      })
      .join("");

    bLines = handleLineBreak(bBuffer.slice(canvasSize - lastALine.length));
    bLines.unshift(firstBLine);
  } else {
    bLines = handleLineBreak(bBuffer);
  }

  // Modify first b line to only fit rest of canavas size after last a line

  // console.log("aLines: ", aLines);
  // console.log("aLines length: ", aLines.length);
  // console.log("Last aLine: ", lastALine);
  // console.log("bLines: ", bLines);
  // console.log("bLines length: ", bLines.length);
  // console.log("cursorPositionX: ", cursorPositionX);
  // console.log("cursorPositionY: ", cursorPositionY);

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
    canvas.width = fontWidth * canvasSize + canvasPadding * 2;
    canvas.height = fontWidth * canvasSize + canvasPadding * 2;

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
      case "Delete":
      case "End":
      case "Home":
      case "Escape":
      case "PageUp":
      case "PageDown":
        break;
      case "ArrowUp":
        moveGap("up");
        break;
      case "ArrowDown":
        moveGap("down");
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
  console.log(buffer, gap_left, gap_right, gap_size);
  console.log("bBuffer: ", bBuffer);
  console.log("aLines: ", aLines);
  console.log("bLines: ", bLines);
};

// let test: Array<string | undefined> = [
//   "d",
//   "s",
//   undefined,
//   undefined,
//   undefined,
//   "f",
//   "s",
//   "a",
//   "j",
// ];
// console.log("test: ", test);

// let move = test.slice(2, 6);
// console.log("move: ", move);

// test.splice(2, 4);
// test.splice(5, 0, ...move);
// console.log(test, move);
