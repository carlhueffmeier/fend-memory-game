'use strict';

import Deck from './Deck';
import Score from './Score';

// Global
const restartNode = document.getElementsByClassName('restart')[0];

//
// Game
//
class Game {
  constructor() {
    restartNode.addEventListener('click', this.start.bind(this));
  }

  gameOver() {
    const notification = () =>
      alert(
        `Congratulations! You made ${this.score
          .moves} moves. Your rating is ${'⭐️'.repeat(this.score.rating())}.`,
      );
    setTimeout(notification, 1000);
  }

  start() {
    // TODO: Garbage collection, remove event listener
    this.score = new Score();
    const incrementMoves = () => this.score.incrementMoves();
    const deckProps = {
      onMoveFinished: () => this.score.incrementMoves(),
      onGameOver: this.gameOver.bind(this),
    };
    this.deck = new Deck(deckProps);
  }
}

export default Game;
