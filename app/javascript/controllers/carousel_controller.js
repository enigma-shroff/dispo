import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["slidesContainer", "slide"];
  static values = {
    current: { type: Number, default: 0 },  // Current page/slide
    totalPages: { type: Number }           // Total number of pages from pagination
  }

  connect() {
    // Ensure slidesContainer width matches total slides and total images
    this.totalSlides = Math.ceil(this.totalPagesValue); // Total number of slides = total pages
    // Set each slide to take the full width of the container
    this.updateSlides();
  }

  next() {
    if (this.currentValue < this.totalSlides - 1) {
      this.currentValue++;
      this.updateSlides();
    } else {
      this.loadNextPage();
    }
  }

  previous() {
    if (this.currentValue > 0) {
      this.currentValue--;
      this.updateSlides();
    }
  }

  updateSlides() {
    // Ensure correct offset calculation
    const offset = -this.currentValue * 100; // Move by 100% per slide
    this.slidesContainerTarget.style.transform = `translateX(${offset}%)`; // Apply horizontal movement
  }

  loadNextPage() {
    const nextPage = this.currentValue + 2; // Fetch next page (1-based indexing)
    fetch(`${window.location.pathname}?page=${nextPage}`, {
      headers: { accept: "application/json" }
    })
      .then((response) => response.json())
      .then((data) => {
        this.appendImages(data.images);
        this.currentValue++;
        this.updateSlides();
      });
  }

  appendImages(images) {
    const slide = document.createElement("div");
    slide.classList.add("flex-shrink-0", "w-full", "flex", "justify-between", "gap-2");
    images.forEach((img) => {
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("flex-shrink-0", "w-[9.9%]"); // Ensure consistent image width
      imgDiv.innerHTML = `<img src="${img.url}" class="w-full h-full object-cover rounded-lg border" />`;
      slide.appendChild(imgDiv);
    });
    this.slidesContainerTarget.appendChild(slide);
    this.totalSlides++;
  }
}
