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

  deleteImage(event) {
    event.stopPropagation(); // Prevent navigation or other actions
    const button = event.target;
    const imageId = button.dataset.imageId;
    const eventId = button.dataset.eventId;
    if (confirm("Are you sure you want to delete this image?")) {
      // Optionally send a request to the server to delete the image
      fetch(`${eventId}/event_images/${imageId}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": document.querySelector("[name='csrf-token']").content }
      })
        .then(response => {
          if (response.ok) {
            console.log(button)
            button.parentElement.remove(); // Remove the thumbnail
          } else {
            console.error("Failed to delete the image.");
          }
        })
        .catch(error => console.error("Error:", error));
    }
  }

}
