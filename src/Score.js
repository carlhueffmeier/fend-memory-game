'use strict';

// DOM elements
const movesNode = document.getElementsByClassName('moves')[0];
const starsNode = document.getElementsByClassName('stars')[0];

//
// Score
//
// Keeps record of the number of moves and display
// score and move counter in interface
class Score {
  constructor() {
    this.moves = 0;
    this.render();
  }

  incrementMoves() {
    this.moves += 1;
    this.render();
  }

  reset() {
    this.moves = 0;
    this.render();
  }

  // Returns the rating as number
  rating() {
    if (this.moves < 14) {
      return 3;
    } else if (this.moves < 18) {
      return 2;
    } else {
      return 1;
    }
  }

  // Returns html string with the right amount of stars
  stars() {
    const star = `<li><i class="fa fa-star"></i></li>`;
    const rating = this.rating();
    return star.repeat(rating);
  }

  //////////////////////
  // Internal methods
  //////////////////////

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
}

export default Score;
