// Turn a single or two digit number into a zero padded two digit number
// eg. 5 -> 05, 23 -> 23
const padWithZeros = num => `00${num}`.slice(-2);

// Timer
//
// Receives a DOM element, that gets updated with the current time
// You can start(), stop(), reset() the timer as well as
// get the current time as string with formatTime()
class Timer {
  constructor(element) {
    this.element = element;
    this.time = 0;
    this.interval = null;
  }

  start() {
    if (this.isRunning()) {
      console.warn(
        `Timer is still running! ` +
          `Make sure you call stop() or use reset() to restart the counter.`,
      );
    } else {
      this.interval = setInterval(this.update.bind(this), 1000); // Call update() every second
    }
  }

  stop() {
    if (this.isRunning()) {
      clearInterval(this.interval); // Stop counting
    }
    this.interval = null;
  }

  isRunning() {
    return this.interval ? true : false; // Timer is not running when interval is 'null'
  }

  update() {
    this.time += 1; // One second passed
    this.element.innerHTML = this.formatTime(); // Update the DOM
  }

  // Return the formatted time eg. 03:54
  formatTime() {
    const minutes = parseInt(this.time / 60, 10); // Minutes = seconds / 60
    const seconds = parseInt(this.time % 60, 10); // Seconds = the rest of the divison
    return `${padWithZeros(minutes)}:${padWithZeros(seconds)}`;
  }

  reset() {
    this.time = 0;
  }
}

export default Timer;
