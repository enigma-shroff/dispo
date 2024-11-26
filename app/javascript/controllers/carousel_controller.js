import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["slidesContainer", "slide"];
  static values = { totalPages: Number };

  initialize() {
    this.currentPage = 0;
  }

  next() {
    this.currentPage = (this.currentPage + 1) % this.totalPagesValue;
    this.updateSlidePosition();
  }

  previous() {
    this.currentPage = 
      (this.currentPage - 1 + this.totalPagesValue) % this.totalPagesValue;
    this.updateSlidePosition();
  }

  updateSlidePosition() {
    const offset = this.currentPage * this.slidesContainerTarget.offsetWidth;
    this.slidesContainerTarget.style.transform = `translateX(-${offset}px)`;
  }
}
