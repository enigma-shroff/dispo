import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["progress", "progressText", "dropdownMenu", "loadingBar"];

  connect() {
    console.log("Export controller connected");
  }

  toggleDropdown() {
    this.dropdownMenuTarget.classList.toggle("show");
  }

  triggerExport(event) {
    const exportType = event.target.dataset.type;
    const eventId = this.element.dataset.eventId;

    // Reset progress
    this.loadingBarTarget.style.width = "0%";
    this.progressTextTarget.textContent = "Export Progress: 0%";

    // Start export request
    fetch(`/events/${eventId}/export?type=${exportType}`, { method: "POST",
      headers: { "X-CSRF-Token": document.querySelector("[name='csrf-token']").content } })
      .then((response) => {
        if (response.ok) {
          this.progressTextTarget.textContent = "Starting Export...";
          this.subscribeToProgressUpdates(eventId);
        } else {
          this.progressTextTarget.textContent = "Export Failed. Please try again.";
        }
      });
  }

  subscribeToProgressUpdates(eventId) {
    App.cable.subscriptions.create(
      { channel: "JobProgressChannel", event_id: eventId },
      {
        received: (data) => {
          this.loadingBarTarget.style.width = `${data.progress}%`;
          this.progressTextTarget.textContent = `Export Progress: ${data.progress}%`;

          if (data.progress >= 100) {
            this.progressTextTarget.textContent = "Export Complete! Your file is ready.";
          }
        },
      }
    );
  }
}
