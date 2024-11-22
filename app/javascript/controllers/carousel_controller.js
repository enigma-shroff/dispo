import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["slidesContainer", "slide"];
  static values = {
    current: { type: Number, default: 0 },  // Track the current page (slide)
    totalPages: { type: Number }  // Total number of pages (calculated from your pagination)
  }

  connect() {
    // Calculate the total number of slides
    this.totalSlides = Math.ceil(this.totalPagesValue); // 10 images per slide
    console.log(`Total slides: ${this.totalSlides}`); // Check total slides
    this.updateSlides();
  }

  next() {
    if (this.currentValue < this.totalSlides - 1) {
      this.currentValue++;
      this.updateSlides();
    } else {
      // Optionally, add logic to fetch next set of images if this is the last slide
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
    const offset = -this.currentValue * 100; // Move slides by 100% for each page (10 images per page)
    this.slidesContainerTarget.style.transform = `translateX(${offset}%)`;  // Apply the transformation
  }

  // Load more images when the user clicks "next" and reaches the end
  loadNextPage() {
    const nextPage = this.currentValue + 2; // Assuming you're paging 1-based, so +2 for the next page
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
      imgDiv.classList.add("flex-shrink-0", "w-[9.9%]");
      imgDiv.innerHTML = `<img src="${img.url}" class="w-full h-full object-cover rounded-lg border" />`;
      slide.appendChild(imgDiv);
    });
    this.slidesContainerTarget.appendChild(slide);
    this.totalSlides++; // Increment total slides after loading the next page
  }
}
