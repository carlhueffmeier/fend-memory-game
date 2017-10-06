// Modal
//
// Modal window to display the game-over message
// The callback passed in the constructor is bound to the big call-to-action button
class Modal {
  constructor(callback) {
    this.modal = document.getElementsByClassName('modal')[0];
    this.content = document.getElementsByClassName('modal-content')[0];
    const closeBtn = document.getElementsByClassName('close-btn')[0];
    const modalBtn = document.getElementsByClassName('modal-btn')[0];
    closeBtn.addEventListener('click', this.close.bind(this));
    modalBtn.addEventListener('click', () => {
      this.close();
      callback();
    });
  }

  open() {
    this.modal.style.display = 'block';
  }

  close() {
    this.modal.style.display = 'none';
  }

  // Receive object with moves, rating, time and set content accordingly
  formatMessage({ moves, rating, time }) {
    const content = `<table class="modal-message">
      <tr>
        <td>Moves:</td>
        <td>${moves}</td>
      </tr>
      <tr>
        <td>Rating:</td>
        <td>${rating}</td>
      </tr>
      <tr>
        <td>Time:</td>
        <td>${time}</td>
      </tr>
    </table>`;
    this.setContent(content);
  }

  setContent(content) {
    this.content.innerHTML = content;
  }
}

export default Modal;
