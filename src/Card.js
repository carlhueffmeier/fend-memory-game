'use strict';

import { TimelineLite } from 'gsap';
import { CLOSED, OPEN, MATCH } from './CardState';

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
    this.state = CLOSED;
    this.timeline = new TimelineLite();
  }

  // Create DOM element
  create() {
    // Create <li> with font awesome icon
    this.element = document.createElement('li');
    this.element.innerHTML = `<i class="fa fa-${this.type}"></i>`;
    // Set default styles
    this.css('');
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
    this.setState(OPEN);
    this.showIcon(true);
    // Add animation to timeline
    this.timeline.to(this.element, 1, {
      backgroundColor: '#02b3e4',
      rotationY: 0,
      color: '#fff',
    });
  }

  // Make card matched and play animation
  matched() {
    this.setState(MATCH);
    this.showIcon(true);
    // Add animation to timeline
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
      .call(this.onNewMatch); // Finally tell parent we got a new match
  }

  // Returns card to closed state
  close() {
    this.setState(CLOSED);
    // Add animation to timeline
    this.timeline
      .to(this.element, 1, {
        color: '#2e3d49',
        backgroundColor: '#2e3d49',
        rotationY: 180,
      })
      .call(() => this.showIcon(false)); // Finally hide icon
  }

  // Returns promise that resolves once any running animation finishes
  animationEnd() {
    return new Promise(
      resolve =>
        this.timeline
          .call(() => {
            resolve();
          })
          .play(), // Need to start timeline in case animation already finished
    );
  }

  // Check whether 'card' is a match
  isMatch(card) {
    return card.type === this.type;
  }

  // Returns current state: CLOSED, OPEN, MATCH
  getState(state) {
    return this.state;
  }

  //////////////////////
  // Internal methods
  //////////////////////

  setState(state) {
    this.state = state;
  }

  // Show or hide the cards icon
  showIcon(isShown) {
    // Add css class if parameter is true
    this.css(`${isShown ? `show` : ``}`);
  }

  // Sets CSS class of DOM element
  css(...classList) {
    this.element.className = `card ${classList.join(' ')}`;
  }

  isClickable() {
    // Only closed calls can be clicked
    return this.state === CLOSED;
  }

  onClick() {
    if (this.isClickable()) {
      this.onOpen(this);
    }
  }
}

export default Card;
