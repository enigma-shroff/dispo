// app/javascript/controllers/landing_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "loginModal", "signupModal" ]

  openLoginModal(event) {
    event.preventDefault()
    this.loginModalTarget.classList.remove('hidden')
  }

  openSignupModal(event) {
    event.preventDefault()
    this.signupModalTarget.classList.remove('hidden')
  }

  closeModal(event) {
    event.preventDefault()
    this.loginModalTarget.classList.add('hidden')
    this.signupModalTarget.classList.add('hidden')
  }
}