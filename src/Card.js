'use strict';

import { TimelineLite } from 'gsap';

//
// Card
//

class Card {
  constructor({ type, onOpen, onNewMatch }) {
    this.type = type;
    this.onOpen = onOpen;
    this.onNewMatch = onNewMatch;
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
    parent.appendChild(this.element);
    return this;
  }

  setClass(...classList) {
    this.element.className = `card ${classList.join(' ')}`;
  }

  open() {
    this.setState('OPEN');
    this.setClass('open');
    this.timeline.to(this.element, 1, {
      backgroundColor: '#02b3e4',
      rotationY: 0,
      color: '#fff',
    });
  }

  matched() {
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
      )
      .call(this.onNewMatch);
  }

  close() {
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
    return new Promise(resolve =>
      this.timeline
        .call(() => {
          console.log(`Resolving ${this.type}`);
          resolve();
        })
        .play(),
    );
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

export default Card;
