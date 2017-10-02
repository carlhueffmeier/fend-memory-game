'use strict';

import { shuffle, flowRight as compose, curryRight, map } from 'lodash';
import { getCards } from './CardTypes';
import { TimelineLite } from 'gsap';

// Globals
const deckNode = document.getElementsByClassName('deck')[0];
const restartNode = document.getElementsByClassName('restart')[0];
const movesNode = document.getElementsByClassName('moves')[0];
const starsNode = document.getElementsByClassName('stars')[0];
var deck, score;

// DOM helper methods
const addClass = (el, ...classNames) => {
  el.className += ` ${classNames.join(' ')}`;
};

// Functional helper methods
const curriedMap = curryRight(map);

//
// Card
//

class Card {
  constructor(type, onOpen) {
    this.type = type;
    this.onOpen = onOpen;
    this.state = 'CLOSED';
    this.timeline = new TimelineLite();
  }

  create() {
    this.element = document.createElement('li');
    this.element.innerHTML = `<i class="fa fa-${this.type}"></i>`;
    this.element.className = 'card';
    this.element.addEventListener('click', this.onClick.bind(this));
    return this;
  }

  append(parent) {
    console.log(parent);
    parent.appendChild(this.element);
    return this;
  }

  setClass(...classList) {
    this.element.className = `card ${classList.join(' ')}`;
  }

  open() {
    console.log(`Opening ${this.type}`);
    this.setState('OPEN');
    this.setClass('open');
    this.timeline.to(this.element, 1, {
      backgroundColor: '#02b3e4',
      rotationY: 0,
      color: '#fff',
    });
  }

  matched() {
    console.log(`Matching ${this.type}`);
    this.setState('MATCH');
    this.setClass('match');
    this.timeline
      .to(this.element, 0.3, {
        backgroundColor: '#abfff7',
        scaleX: 1.4,
        scaleY: 1.4,
      })
      .to(this.element, 0.7, {
        backgroundColor: '#02ccba',
        scaleX: 1,
        scaleY: 1,
      })
      .to(
        this.element,
        1,
        {
          color: '#fff',
        },
        '-=1',
      );
  }

  close() {
    console.log(`Closing ${this.type}`);
    this.setState('CLOSED');
    this.timeline
      .to(this.element, 1, {
        color: '#2e3d49',
        backgroundColor: '#2e3d49',
        rotationY: 180,
      })
      .call(() => this.setClass(''));
  }

  animationEnd() {
    return new Promise(resolve => this.timeline.done(resolve()));
  }

  isMatch(card) {
    return card.type === this.type;
  }

  getState(state) {
    return this.state;
  }

  // Private

  setState(state) {
    this.state = state;
  }

  isClickable() {
    return this.state === 'CLOSED';
  }

  onClick() {
    if (this.isClickable()) {
      this.onOpen(this);
    }
  }
}

//
// Deck
//

class Deck {
  constructor(incrementMoves, gameOver) {
    this.incrementMoves = incrementMoves;
    this.gameOver = gameOver;
    const duplicateItems = array => array.concat(array);
    const makeCard = type => new Card(type, this.handleOpen.bind(this));
    const makeShuffledDeck = compose([
      curriedMap(makeCard),
      shuffle,
      duplicateItems,
    ]);
    const renderCard = card => {
      card.create().append(deckNode);
    };

    this.deck = makeShuffledDeck(getCards(8));
    this.openCards = [];
    this.isAnimating = false;

    this.reset();
    map(this.deck, renderCard);
  }

  reset() {
    deckNode.innerHTML = '';
  }

  handleOpen(card) {
    card.open();
    this.openCards.push(card);
    if (this.openCards.length === 2) {
      this.checkForMatch();
    }
  }

  checkForMatch() {
    console.log('Checking for match: ', this.openCards);
    const openCardsMatch = () => this.openCards[0].isMatch(this.openCards[1]);
    const setMatched = () => {
      Promise.all([
        this.openCards[0].animationEnd(),
        this.openCards[1].animationEnd(),
      ]).then(this.openCards.forEach(card => card.matched()));
    };
    const closeCards = () => {
      Promise.all([
        this.openCards[0].animationEnd(),
        this.openCards[1].animationEnd(),
      ]).then(this.openCards.forEach(card => card.close()));
    };
    if (openCardsMatch()) {
      setMatched();
    } else {
      closeCards();
    }
    this.openCards = [];
    this.incrementMoves();
    this.checkGameOver();
  }

  checkGameOver() {
    console.log(this.deck);
    if (this.deck.every(card => card.getState() === 'MATCH')) {
      this.gameOver();
    }
  }
}

//
// Score
//

class Score {
  constructor() {
    this.moves = 0;
    this.render();
  }

  incrementMoves() {
    this.moves += 1;
    this.render();
  }

  render() {
    this.renderMoves();
    this.renderRating();
  }

  renderMoves() {
    movesNode.innerHTML = this.moves;
  }

  renderRating() {
    starsNode.innerHTML = this.stars();
  }

  rating() {
    if (this.moves < 12) {
      return 3;
    } else if (this.moves < 16) {
      return 2;
    } else {
      return 1;
    }
  }

  stars() {
    const star = '<li><i class="fa fa-star"></i></li>';
    const rating = this.rating();
    return star.repeat(rating);
  }
}

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
    this.deck = new Deck(incrementMoves, this.gameOver.bind(this));
  }
}

const game = new Game();
game.start();

// function game() {
//   const openCards = [];
//   // Game loop
//   while (true) {
//     while (openCards < 2) {
//       awaitInput();
//     }
//     // Check whether the open cards are a match
//     if (cardsMatch) {
//       // Apply match styles
//       makeMatched();
//     } else {
//       // Close the cards again (after a short delay)
//       closeCards();
//     }
//     // Increase move counter
//     moves += 1;
//     // Reset open cards
//     openCards = [];
//     // Check gameover condition
//   }
// }

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
