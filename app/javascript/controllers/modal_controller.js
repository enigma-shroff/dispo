import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["modal", "container", "content"]; // Add "content" for modal content

  connect() {
    this.boundCloseOnOutsideClick = this.closeOnOutsideClick.bind(this); // Bind the method for event listener
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
  

}
