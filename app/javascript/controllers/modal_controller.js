import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["modal", "container", "content", "image", "imageContainer", "originalButton"]; // Add "content" for modal content

  connect() {
    this.boundCloseOnOutsideClick = this.closeOnOutsideClick.bind(this); // Bind the method for event listener
    this.baseUrl = `${window.location.origin}`;
    this.originalImageUrl = ""; // Placeholder for the original image URL
    this.filteredImageUrl = ""; // Placeholder for the filtered image URL
  }

  open(event) {
    event.preventDefault();

    const qrUrl = event.target.dataset.modalQrUrl;
    if (!qrUrl) {
      console.error("QR URL not provided.");
      return;
    }

    this.modalTarget.classList.remove("hidden");
    this.loadQrCode(qrUrl);

    this.modalTarget.addEventListener("click", this.boundCloseOnOutsideClick);
  }

  close() {
    this.modalTarget.classList.add("hidden");
    this.containerTarget.innerHTML = "";
    this.modalTarget.removeEventListener("click", this.boundCloseOnOutsideClick);
  }

  async loadQrCode(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch QR code");

      const qrSvg = await response.text();
      this.containerTarget.innerHTML = qrSvg;
    } catch (error) {
      console.error("Error loading QR code:", error);
    }
  }

  closeOnOutsideClick(event) {
    const isOutside = !this.contentTarget.contains(event.target); // Check if click is outside modal content
    if (isOutside) {
      this.close();
    }
  }

  exportQr() {
    const svgElement = this.containerTarget.querySelector("svg");
    if (!svgElement) {
      console.error("No QR code found to export.");
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Export the canvas as a PNG
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = url;
  }

  async copyQr() {
    try {
      const svgElement = this.containerTarget.querySelector("svg");
      if (!svgElement) {
        alert("No QR code available to copy.");
        return;
      }
  
      // Convert SVG to a data URL
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
      const svgUrl = URL.createObjectURL(svgBlob);
  
      // Create an offscreen canvas to convert SVG to PNG
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
  
      // Create an image element to load the SVG
      const image = new Image();
      image.src = svgUrl;
  
      // Wait for the image to load
      await new Promise((resolve, reject) => {
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          resolve();
        };
        image.onerror = (error) => reject(error);
      });
  
      // Convert canvas to PNG blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
  
      // Write PNG blob to the clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
  
      alert("QR code copied to clipboard as an image!");
  
      // Clean up
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error("Clipboard write failed:", error);
      alert("Unable to copy QR code. Please check your browser's permissions.");
    }
  }
  

  openImage(event) {
    event.preventDefault();
    const filteredEndpoint = event.currentTarget.dataset.imageUrl; // Filtered image endpoint
    const originalEndpoint = event.currentTarget.dataset.originalImageUrl;
    this.originalImageUrl = `${this.baseUrl}${originalEndpoint}`; // Construct full URL for original image
    this.filteredImageUrl = `${this.baseUrl}${filteredEndpoint}`;
    const modalImage = this.imageTarget;
  
    modalImage.src = this.filteredImageUrl;
    this.imageContainerTarget.classList.remove("hidden");
    this.imageContainerTarget.addEventListener("click", this.closeImage);
  }
  
  closeImage(event) {
    // Close only if clicking outside the image
    if (event.target != this.imageTarget && event.target != this.originalButtonTarget) {
      this.imageContainerTarget.classList.add("hidden");
      this.imageTarget.src = ""; // Clear the image src
      this.imageContainerTarget.removeEventListener("click", this.closeImage);
      this.originalButtonTarget.innerHTML = "Original";
    }
  }

  showOriginal(event) {
    event.stopPropagation(); 
    // Toggle between original and filtered images
    if (this.imageTarget.src === this.originalImageUrl) {
      this.originalButtonTarget.innerHTML = "Original";
      this.imageTarget.src = this.filteredImageUrl;
    } else {
      this.originalButtonTarget.innerHTML = "Filtered";
      this.imageTarget.src = this.originalImageUrl;
    }
  }

  async downloadImage() {
    try {
      const response = await fetch(this.imageTarget.src); // Fetch the current image
      const blob = await response.blob(); // Convert to Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary link to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "image.jpg"; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url); // Clean up URL object
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  }

  deleteImage() {
    if (confirm("Are you sure you want to delete this image?")) {
      // Handle deletion logic here (e.g., send a request to the server)
      alert("Image deleted successfully!");
      this.close();
    }
  }
}
