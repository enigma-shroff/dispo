import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["slidesContainer", "slide"];
  static values = {
    current: { type: Number, default: 0 },
    totalPages: { type: Number },
    loadedSlides: { type: Number, default: 1 },
  };

  connect() {
    this.totalSlides = Math.ceil(this.totalPagesValue); // Total number of pages/slides
    console.log("Total Slides:", this.totalSlides);
    this.updateSlides(true); // Initial render with adjusted offset
  }

  next() {
    if (this.currentValue < this.loadedSlidesValue - 1) {
      this.currentValue++;
      this.updateSlides();
    } else if (this.loadedSlidesValue < this.totalSlides) {
      this.loadNextPage();
    }
  }

  previous() {
    if (this.currentValue > 0) {
      this.currentValue--;
      this.updateSlides();
    }
  }

  updateSlides(initial = false) {
    // If it's the first render, keep offset at 0
    const offset = initial ? 0 : 50 - this.currentValue * 100;
    this.slidesContainerTarget.style.transform = `translateX(${offset}%)`;
  }

  loadNextPage() {
    const nextPage = this.loadedSlidesValue + 1;

    fetch(`${window.location.pathname}?page=${nextPage}`, {
      headers: { accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.images && data.images.length > 0) {
          this.appendSlide(data.images);
          this.loadedSlidesValue++;
          this.currentValue++;
          this.updateSlides();
        } else {
          console.warn("No more images to load.");
        }
      })
      .catch((error) => console.error("Failed to load next page:", error));
  }

  appendSlide(images) {
    const slide = document.createElement("div");
    slide.classList.add(
      "flex-shrink-0",
      "w-full",
      "flex",
      "justify-between",
      "gap-2"
    );

    // Add up to 8 images or placeholders
    for (let i = 0; i < 8; i++) {
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("flex-shrink-0", "w-[9.9%]");

      if (images[i]) {
        imgDiv.innerHTML = `
          <img src="${images[i].url}" 
               class="w-full h-full object-cover rounded-lg border" />
        `;
      } else {
        // Placeholder for missing images
        imgDiv.innerHTML = `
          <div class="w-full h-full bg-gray-200 rounded-lg border"></div>
        `;
      }

      slide.appendChild(imgDiv);
    }

    this.slidesContainerTarget.appendChild(slide);
  }
}
