// let buffer = new Array(50).fill("_");
// let gap_size = 10;
// let gap_left = 0;
// let gap_right = gap_size - gap_left - 1;
// let size = 10;
let ctx;
let canvas;

// Worker messages
onmessage = (e) => {
  if (e.data[0] === "keydown") {
  }

  if (e.data[0] === "setUpCanvas") {
    const viewport = e.data[2];
    console.log(viewport);

    // define canvas from main to offscreen
    canvas = e.data[1];
    ctx = canvas.getContext("2d");

    canvas.width = viewport[0] * viewport[2];
    canvas.height = viewport[1] * viewport[2];
    console.log(canvas.width, canvas.height);
    ctx.scale(viewport[2], viewport[2]);
    ctx.textBaseline = "top";

    ctx.fillText("a", 10, 10);
  }
};

// Function that is used to grow the gap at index position and return the array
// function grow(k: number, position: number) {
//   let a = buffer.slice(position, size);
//   // Copy characters of buffer to a[] after position
//   buffer.splice(position, size - position, ..."_".repeat(k));
//   // Insert a gap of k from index position
//   // gap is being represented by '_'
//   // Reinsert the remaining array
//   buffer.splice(position + k, 0, ...a);
//   size += k;
//   gap_right += k;
// }

// // Function that is used to move the gap left in the array
// function left(position: number) {
//   // Move the gap left character by character and the buffers
//   while (position < gap_left) {
//     gap_left--;
//     gap_right--;
//     buffer[gap_right + 1] = buffer[gap_left];
//     buffer[gap_left] = "_";
//   }
// }
// // Function that is used to move the gap right in the array
// function right(position: number) {
//   // Move the gap right character by character and the buffers
//   while (position > gap_left) {
//     gap_left++;
//     gap_right++;
//     buffer[gap_left - 1] = buffer[gap_right];
//     buffer[gap_right] = "_";
//   }
// }

// // Function to control the movement of gap by checking its position to the point of insertion
// // It checks whether the specified position is to the left or right of the current position of the gap, and then adjusts the gap accordingly.
// function move_cursor(position: number) {
//   if (position < gap_left) {
//     left(position);
//   } else {
//     right(position);
//   }
// }

// // Function to insert the string to the buffer at point position
// function insertion(input: string, position: number) {
//   let inputLength = input.length;
//   let i = 0;
//   // If the point is not the gap, check and move the cursor to that point
//   if (position !== gap_left) {
//     move_cursor(position);
//   }

//   // Insert characters one by one
//   while (i < inputLength) {
//     // If the gap is empty grow the size
//     if (gap_right === gap_left) {
//       let k = 10;
//       grow(k, position);
//     }
//     // Insert the character in the gap and move the gap
//     buffer[gap_left] = input.charAt(i);
//     gap_left++;
//     i++;
//     position++;
//   }
// }

// function deletion(position: number) {
//   // Deleting a character at a given position
//   if (position + 1 !== gap_left) move_cursor(position + 1);

//   gap_left--;
//   buffer[gap_left] = "_";
// }
