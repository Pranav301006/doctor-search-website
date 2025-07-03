// Global variables
let currentDoctors = []
let filteredDoctors = []
const doctorsData = [] // Declare doctorsData variable
function getAllDoctors() {
  return doctorsData // Define getAllDoctors function
}

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Make sure data.js is loaded first
  if (typeof doctorsData !== "undefined") {
    initializeApp()
    setupEventListeners()
  } else {
    // Retry after a short delay if data isn't loaded yet
    setTimeout(() => {
      initializeApp()
      setupEventListeners()
    }, 100)
  }
})

// Initialize the application
function initializeApp() {
  currentDoctors = getAllDoctors()
  filteredDoctors = currentDoctors

  // Set minimum date for appointment booking
  const today = new Date().toISOString().split("T")[0]
  const dateInputs = document.querySelectorAll('input[type="date"]')
  dateInputs.forEach((input) => {
    input.min = today
  })
}

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }

  // Modal functionality
  setupModalListeners()

  // FAQ functionality
  setupFAQListeners()
}

// Setup modal event listeners
function setupModalListeners() {
  const modal = document.getElementById("appointmentModal")
  const closeBtn = document.querySelector(".close")

  if (modal && closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none"
    })

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none"
      }
    })
  }

  // Appointment form submission
  const appointmentForm = document.getElementById("appointmentForm")
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", handleAppointmentSubmission)
  }
}

// Setup FAQ event listeners
function setupFAQListeners() {
  const faqQuestions = document.querySelectorAll(".faq-question")
  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.parentElement
      const isActive = faqItem.classList.contains("active")

      // Close all FAQ items
      document.querySelectorAll(".faq-item").forEach((item) => {
        item.classList.remove("active")
      })

      // Open clicked item if it wasn't active
      if (!isActive) {
        faqItem.classList.add("active")
      }
    })
  })
}

// Generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let starsHTML = ""

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star star"></i>'
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt star"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star star empty"></i>'
  }

  return starsHTML
}

// Create doctor card HTML
function createDoctorCard(doctor) {
  return `
        <div class="doctor-card" onclick="viewDoctorDetails(${doctor.id})">
            <div class="doctor-header">
                <img src="${doctor.imageUrl}" alt="${doctor.name}" class="doctor-avatar">
                <div class="doctor-info">
                    <h3>${doctor.name}</h3>
                    <div class="doctor-specialization">${doctor.specialization}</div>
                    <div class="doctor-qualification">${doctor.qualification}</div>
                </div>
            </div>
            <div class="doctor-details">
                <div class="doctor-rating">
                    <div class="stars">
                        ${generateStarRating(doctor.rating)}
                    </div>
                    <span class="rating-text">${doctor.rating} (${Math.floor(Math.random() * 100) + 50} reviews)</span>
                </div>
                <div class="doctor-detail">
                    <i class="fas fa-briefcase"></i>
                    <span>${doctor.experience} years experience</span>
                </div>
                <div class="doctor-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${doctor.city}, ${doctor.state}</span>
                </div>
                <div class="doctor-detail">
                    <i class="fas fa-clock"></i>
                    <span>${doctor.availableTime}</span>
                </div>
            </div>
            <div class="doctor-fee">₹${doctor.consultationFee} consultation fee</div>
            <div class="doctor-actions">
                <a href="pages/doctor-detail.html?id=${doctor.id}" class="btn-view">View Profile</a>
                <button class="btn-book" onclick="event.stopPropagation(); openAppointmentModal(${doctor.id})">Book Now</button>
            </div>
        </div>
    `
}

// View doctor details
function viewDoctorDetails(doctorId) {
  window.location.href = `pages/doctor-detail.html?id=${doctorId}`
}

// Open appointment modal
function openAppointmentModal(doctorId) {
  const modal = document.getElementById("appointmentModal")
  if (modal) {
    modal.style.display = "block"
    modal.setAttribute("data-doctor-id", doctorId)
  }
}

// Handle appointment form submission
function handleAppointmentSubmission(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const appointmentData = {
    doctorId: document.getElementById("appointmentModal").getAttribute("data-doctor-id"),
    patientName: document.getElementById("patientName").value,
    patientPhone: document.getElementById("patientPhone").value,
    patientEmail: document.getElementById("patientEmail").value,
    appointmentDate: document.getElementById("appointmentDate").value,
    appointmentTime: document.getElementById("appointmentTime").value,
    reason: document.getElementById("appointmentReason").value,
  }

  // Simulate appointment booking
  setTimeout(() => {
    alert("Appointment booked successfully! You will receive a confirmation call shortly.")
    document.getElementById("appointmentModal").style.display = "none"
    event.target.reset()
  }, 1000)
}

// Contact form submission
function handleContactFormSubmission(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  }

  // Simulate form submission
  setTimeout(() => {
    alert("Thank you for your message! We will get back to you soon.")
    event.target.reset()
  }, 1000)
}

// Utility functions
function formatPhoneNumber(phone) {
  return phone.replace(/(\+91)(\d{5})(\d{5})/, "$1-$2-$3")
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// Show loading state
function showLoading(containerId) {
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `
  }
}

// Show error state
function showError(containerId, message) {
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `
  }
}
