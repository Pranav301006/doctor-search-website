// Home page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedDoctors()
  setupHomeEventListeners()
  initializeHeroAnimations()
  setupSpecializationCardHoverEffects()
  setupScrollAnimations()
})

// Setup home page event listeners
function setupHomeEventListeners() {
  // Search functionality
  const searchInput = document.getElementById("searchInput")
  const locationSelect = document.getElementById("locationSelect")

  if (searchInput) {
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        searchDoctorsFromHome()
      }
    })
  }
}

// Load featured doctors
function loadFeaturedDoctors() {
  const featuredContainer = document.getElementById("featuredDoctors")
  if (!featuredContainer) return

  const featuredDoctors = window.getFeaturedDoctors(6) // Placeholder for imported function

  if (featuredDoctors.length === 0) {
    featuredContainer.innerHTML = '<p class="text-center">No featured doctors available.</p>'
    return
  }

  featuredContainer.innerHTML = featuredDoctors.map((doctor) => window.createDoctorCard(doctor)).join("") // Placeholder for imported function
}

// Search doctors from home page
function searchDoctorsFromHome() {
  const searchQuery = document.getElementById("searchInput").value
  const location = document.getElementById("locationSelect").value

  // Store search parameters in sessionStorage
  sessionStorage.setItem("searchQuery", searchQuery)
  sessionStorage.setItem("searchLocation", location)

  // Redirect to doctors page
  window.location.href = "pages/doctors.html"
}

// Global search function (called from search button)
function searchDoctors() {
  searchDoctorsFromHome()
}

// Filter by specialization
function filterBySpecialization(specialization) {
  sessionStorage.setItem("searchSpecialization", specialization)
  window.location.href = "pages/doctors.html"
}

// Hero section animations
function initializeHeroAnimations() {
  const heroTitle = document.querySelector(".hero-title")
  const heroSubtitle = document.querySelector(".hero-subtitle")
  const searchContainer = document.querySelector(".search-container")

  if (heroTitle) {
    heroTitle.style.opacity = "0"
    heroTitle.style.transform = "translateY(30px)"

    setTimeout(() => {
      heroTitle.style.transition = "all 0.8s ease"
      heroTitle.style.opacity = "1"
      heroTitle.style.transform = "translateY(0)"
    }, 200)
  }

  if (heroSubtitle) {
    heroSubtitle.style.opacity = "0"
    heroSubtitle.style.transform = "translateY(30px)"

    setTimeout(() => {
      heroSubtitle.style.transition = "all 0.8s ease"
      heroSubtitle.style.opacity = "1"
      heroSubtitle.style.transform = "translateY(0)"
    }, 400)
  }

  if (searchContainer) {
    searchContainer.style.opacity = "0"
    searchContainer.style.transform = "translateY(30px)"

    setTimeout(() => {
      searchContainer.style.transition = "all 0.8s ease"
      searchContainer.style.opacity = "1"
      searchContainer.style.transform = "translateY(0)"
    }, 600)
  }
}

// Specialization card hover effects
function setupSpecializationCardHoverEffects() {
  const specializationCards = document.querySelectorAll(".specialization-card")

  specializationCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })
}

// Intersection Observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
      }
    })
  }, observerOptions)

  // Observe sections for animation
  const sections = document.querySelectorAll(".specializations, .featured-doctors")
  sections.forEach((section) => {
    observer.observe(section)
  })
}

// Placeholder for imported functions
window.getFeaturedDoctors = (limit) => {
  // Implementation of getFeaturedDoctors
  return []
}

window.createDoctorCard = (doctor) => {
  // Implementation of createDoctorCard
  return '<div class="doctor-card">Doctor Name</div>'
}
