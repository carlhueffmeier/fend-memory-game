'use strict';

import { shuffle, flowRight as compose, curryRight, map } from 'lodash';
import { getCards } from './CardTypes';
import Card from './Card';

// Functional helper
const curriedMap = curryRight(map);

// DOM elements
const deckNode = document.getElementsByClassName('deck')[0];

//
// Deck
//
// Requires the following properties:
// onMoveFinished: call when move is over (to keep score in parent)
// onGameOver: call when all cards are matched
class Deck {
  constructor({ onMoveFinished, onGameOver }) {
    this.moveFinished = onMoveFinished;
    this.gameOver = onGameOver;
    this.isGameOver = false;
    // Duplicate all items (would be a frustating matching game otherwise)
    const duplicateItems = array => array.concat(array);
    const cardProps = {
      onOpen: this.handleOpen.bind(this),
      onNewMatch: this.checkGameOver.bind(this),
    };
    const makeCard = type => new Card({ type, ...cardProps });
    const makeShuffledDeck = compose([
      curriedMap(makeCard),
      shuffle,
      duplicateItems,
    ]);
    // Create element and append to the DOM
    const renderCard = card => {
      card.create().append(deckNode);
    };

    // Create deck of 8 random cards
    this.deck = makeShuffledDeck(getCards(8));
    // The opened cards (maximum of two)
    this.openCards = [];

    // Reset DOM
    this.reset();
    // Render the whole deck
    map(this.deck, renderCard);
  }

  //////////////////////
  // Internal methods
  //////////////////////

  // Callback reveals card and keeps record of opened cards
  handleOpen(card) {
    // Start animation
    card.open();
    this.openCards.push(card);
    // Once the second card is opened..
    if (this.openCards.length === 2) {
      // Close or match them
      this.checkForMatch(...this.openCards);
      this.openCards = [];
      // Let parent take care of score keeping
      this.moveFinished();
      this.checkGameOver();
    }
  }

  setMatched(cards) {
    // Synchronize animation
    const promises = cards.map(card => card.animationEnd());
    Promise.all(promises).then(() => cards.forEach(card => card.matched()));
  }

  closeCards(cards) {
    const promises = cards.map(card => card.animationEnd());
    Promise.all(promises).then(() => cards.forEach(card => card.close()));
  }

  checkForMatch(cardA, cardB) {
    if (cardA.isMatch(cardB)) {
      this.setMatched([cardA, cardB]);
    } else {
      this.closeCards([cardA, cardB]);
    }
  }

  checkGameOver() {
    if (
      !this.isGameOver &&
      this.deck.every(card => card.getState() === 'MATCH')
    ) {
      // Make sure we don't call gameOver() twice
      this.isGameOver = true;
      this.gameOver();
    }
  }

  // Reset DOM
  reset() {
    deckNode.innerHTML = '';
  }
}

export default Deck;
