'use strict';

// Globals
const movesNode = document.getElementsByClassName('moves')[0];
const starsNode = document.getElementsByClassName('stars')[0];

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

export default Score;
