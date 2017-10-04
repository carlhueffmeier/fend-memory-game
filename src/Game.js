'use strict';

import Deck from './Deck';
import Score from './Score';

// DOM elements
const restartNode = document.getElementsByClassName('restart')[0];

//
// Game
//
class Game {
  constructor() {
    restartNode.addEventListener('click', this.start.bind(this));
    this.score = new Score();
  }

  gameOver() {
    alert(
      `Congratulations! You made ${this.score
        .moves} moves. Your rating is ${'⭐️'.repeat(this.score.rating())}.`,
    );
  }

  start() {
    this.score.reset();
    const incrementMoves = () => this.score.incrementMoves();
    const deckProps = {
      onMoveFinished: () => this.score.incrementMoves(),
      onGameOver: this.gameOver.bind(this),
    };
    this.deck = new Deck(deckProps);
  }
}

export default Game;
