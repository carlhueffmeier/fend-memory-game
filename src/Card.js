'use strict';

import { TimelineLite } from 'gsap';

//
// Card
//
// Requires the following properties:
// type: this corresponds to a font-awesome icon
// onOpen: call when closed card gets clicked
// onNewMatch: call when a card gets matched (to check game over condition)
class Card {
  constructor({ type, onOpen, onNewMatch }) {
    this.type = type;
    this.onOpen = onOpen;
    this.onNewMatch = onNewMatch;
    this.state = 'CLOSED';
    this.timeline = new TimelineLite();
  }

  // Create DOM element
  create() {
    this.element = document.createElement('li');
    this.element.innerHTML = `<i class="fa fa-${this.type}"></i>`;
    this.element.className = 'card';
    this.element.addEventListener('click', this.onClick.bind(this));
    return this;
  }

  // Append card to DOM element
  append(parent) {
    parent.appendChild(this.element);
    return this;
  }

  // Reveal card and play animation
  open() {
    this.setState('OPEN');
    this.css('open');
    this.timeline.to(this.element, 1, {
      backgroundColor: '#02b3e4',
      rotationY: 0,
      color: '#fff',
    });
  }

  // Make card matched and play animation
  matched() {
    this.setState('MATCH');
    this.css('match');
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
      )
      .call(this.onNewMatch);
  }

  // Returns card to closed state
  close() {
    this.setState('CLOSED');
    this.timeline
      .to(this.element, 1, {
        color: '#2e3d49',
        backgroundColor: '#2e3d49',
        rotationY: 180,
      })
      .call(() => this.css(''));
  }

  // Returns promise that resolves once any running animation finishes
  animationEnd() {
    return new Promise(resolve =>
      this.timeline
        .call(() => {
          console.log(`Resolving ${this.type}`);
          resolve();
        })
        .play(),
    );
  }

  // Check whether 'card' is a match
  isMatch(card) {
    return card.type === this.type;
  }

  // Returns current state: 'CLOSED', 'OPEN', 'MATCH'
  getState(state) {
    return this.state;
  }

  //////////////////////
  // Internal methods
  //////////////////////

  setState(state) {
    this.state = state;
  }

  // Sets CSS class of DOM element
  css(...classList) {
    this.element.className = `card ${classList.join(' ')}`;
  }

  isClickable() {
    // Only closed calls can be clicked
    return this.state === 'CLOSED';
  }

  onClick() {
    if (this.isClickable()) {
      this.onOpen(this);
    }
  }
}

export default Card;
