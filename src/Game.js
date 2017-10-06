import Deck from './Deck';
import Score from './Score';
import Modal from './Modal';
import Timer from './Timer';

// DOM elements
const restartNode = document.getElementsByClassName('restart')[0];
const timerNode = document.getElementsByClassName('time')[0];

// Game
//
// Handles starting / restarting as well as display of game-over message
// The actual game logic can be found in the 'Deck' class
class Game {
  constructor() {
    // Restart game when button is clicked
    restartNode.addEventListener('click', this.start.bind(this));
    // Modal displays game-over message
    this.modal = new Modal(this.start.bind(this));
    // Displays and stores the number of moves and score
    this.score = new Score();
    // Displays the game timer
    this.timer = new Timer(timerNode);
  }

  gameOver() {
    this.timer.stop();
    // Set game-over message
    this.modal.formatMessage({
      moves: this.score.moves,
      rating: `<ul class="stars">${this.score.stars()}</ul>`,
      time: this.timer.formatTime(),
    });
    this.modal.open();
  }

  start() {
    this.timer.reset();
    if (!this.timer.isRunning()) {
      this.timer.start();
    }
    this.score.reset();
    this.shuffleCards();
  }

  // Get a new deck of cards and display them
  shuffleCards() {
    const incrementMoves = () => this.score.incrementMoves();
    const deckProps = {
      onMoveFinished: () => this.score.incrementMoves(),
      onGameOver: this.gameOver.bind(this),
    };
    this.deck = new Deck(deckProps);
  }
}

export default Game;
