'use strict';

import { shuffle, flowRight as compose, curryRight, map } from 'lodash';
import { getCards } from './CardTypes';
import Card from './Card';

// Functional helper
const curriedMap = curryRight(map);

// Global
const deckNode = document.getElementsByClassName('deck')[0];

//
// Deck
//
class Deck {
  constructor({ onMoveFinished, onGameOver }) {
    this.moveFinished = onMoveFinished;
    this.gameOver = onGameOver;
    this.isGameOver = false;
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
    console.log(
      `Opening ${card.type}, all open cards: ${this.openCards.map(
        c => `${c.type} `,
      )}`,
    );
    if (this.openCards.length === 2) {
      this.checkForMatch(...this.openCards);
      this.openCards = [];
      this.moveFinished();
      this.checkGameOver();
    }
  }

  setMatched(cards) {
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
    console.log(`Checking game over: `);
    if (
      !this.isGameOver &&
      this.deck.every(card => card.getState() === 'MATCH')
    ) {
      this.isGameOver = true;
      this.gameOver();
    }
  }
}

export default Deck;
