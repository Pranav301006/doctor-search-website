// Main application JavaScript - All functions in one file for simplicity

// Global variables
let allDoctors = []
let filteredDoctors = []

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOM loaded, initializing app...")

  // Initialize data
  allDoctors = doctorsData
  filteredDoctors = allDoctors

  console.log("📊 Doctors data:", allDoctors)

  // Initialize different pages based on current page
  initializePage()
})

// Initialize page based on current URL
function initializePage() {
  const currentPage = window.location.pathname
  console.log("📄 Current page:", currentPage)

  if (currentPage.includes("index.html") || currentPage === "/" || currentPage.endsWith("/")) {
    initializeHomePage()
  } else if (currentPage.includes("doctors.html")) {
    initializeDoctorsPage()
  } else if (currentPage.includes("doctor-detail.html")) {
    initializeDoctorDetailPage()
  }

  // Initialize common features
  initializeNavigation()
  initializeModals()
}

// Initialize home page
function initializeHomePage() {
  console.log("🏠 Initializing home page...")
  loadFeaturedDoctors()
  setupSearchForm()
}

// Initialize doctors listing page
function initializeDoctorsPage() {
  console.log("👨‍⚕️ Initializing doctors page...")
  displayAllDoctors()
  setupFilters()
  loadSearchParameters()
}

// Initialize doctor detail page
function initializeDoctorDetailPage() {
  console.log("📋 Initializing doctor detail page...")
  const urlParams = new URLSearchParams(window.location.search)
  const doctorId = urlParams.get("id")

  if (doctorId) {
    loadDoctorDetail(doctorId)
  } else {
    showError("doctorProfile", "Doctor not found")
  }
}

// Load featured doctors on home page
function loadFeaturedDoctors() {
  const container = document.getElementById("featuredDoctors")
  if (!container) {
    console.log("❌ Featured doctors container not found")
    return
  }

  console.log("⭐ Loading featured doctors...")

  // Get top 6 doctors by rating
  const featured = allDoctors.sort((a, b) => b.rating - a.rating).slice(0, 6)

  container.innerHTML = featured.map((doctor) => createDoctorCard(doctor)).join("")
  console.log("✅ Featured doctors loaded:", featured.length)
}

// Display all doctors on doctors page
function displayAllDoctors() {
  const container = document.getElementById("doctorsContainer")
  if (!container) {
    console.log("❌ Doctors container not found")
    return
  }

  console.log("👥 Displaying all doctors...")
  container.innerHTML = allDoctors.map((doctor) => createDoctorCard(doctor)).join("")
  updateResultsCount(allDoctors.length)
  console.log("✅ All doctors displayed:", allDoctors.length)
}

// Create doctor card HTML
function createDoctorCard(doctor) {
  return `
        <div class="doctor-card" onclick="viewDoctorDetails(${doctor.id})">
            <div class="doctor-header">
                <img src="${doctor.imageUrl}" alt="${doctor.name}" class="doctor-avatar" onerror="this.src='https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Dr'">
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
                <button class="btn-view" onclick="event.stopPropagation(); viewDoctorDetails(${doctor.id})">View Profile</button>
                <button class="btn-book" onclick="event.stopPropagation(); openAppointmentModal(${doctor.id})">Book Now</button>
            </div>
        </div>
    `
}

// Generate star rating
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

// View doctor details
function viewDoctorDetails(doctorId) {
  console.log("👀 Viewing doctor details for ID:", doctorId)

  // Check if we're on the doctors page or home page
  const currentPage = window.location.pathname
  if (currentPage.includes("pages/")) {
    window.location.href = `doctor-detail.html?id=${doctorId}`
  } else {
    window.location.href = `pages/doctor-detail.html?id=${doctorId}`
  }
}

// Load doctor detail
function loadDoctorDetail(doctorId) {
  console.log("📋 Loading doctor detail for ID:", doctorId)

  const doctor = allDoctors.find((d) => d.id === Number.parseInt(doctorId))

  if (!doctor) {
    showError("doctorProfile", "Doctor not found")
    return
  }

  displayDoctorProfile(doctor)
}

// Display doctor profile
function displayDoctorProfile(doctor) {
  const container = document.getElementById("doctorProfile")
  if (!container) return

  container.innerHTML = `
        <div class="profile-header">
            <img src="${doctor.imageUrl}" alt="${doctor.name}" class="profile-avatar" onerror="this.src='https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Dr'">
            <h1>${doctor.name}</h1>
            <div class="profile-specialization">${doctor.specialization}</div>
            <div class="profile-rating">
                <div class="stars">
                    ${generateStarRating(doctor.rating)}
                </div>
                <span class="rating-text">${doctor.rating} (${Math.floor(Math.random() * 100) + 50} reviews)</span>
            </div>
            <div class="profile-actions">
                <button class="btn-appointment" onclick="openAppointmentModal(${doctor.id})">
                    <i class="fas fa-calendar-plus"></i>
                    Book Appointment
                </button>
                <a href="tel:${doctor.phone}" class="btn-contact">
                    <i class="fas fa-phone"></i>
                    Call Now
                </a>
            </div>
        </div>
        
        <div class="profile-content">
            <div class="profile-grid">
                <div class="profile-main">
                    <div class="profile-section">
                        <h2><i class="fas fa-user"></i> About Dr. ${doctor.name.split(" ").slice(-1)[0]}</h2>
                        <p>${doctor.about}</p>
                    </div>
                    
                    <div class="profile-section">
                        <h2><i class="fas fa-graduation-cap"></i> Qualifications & Experience</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <i class="fas fa-certificate"></i>
                                <div>
                                    <div class="info-label">Qualification</div>
                                    <div class="info-value">${doctor.qualification}</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-briefcase"></i>
                                <div>
                                    <div class="info-label">Experience</div>
                                    <div class="info-value">${doctor.experience} years</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-stethoscope"></i>
                                <div>
                                    <div class="info-label">Specialization</div>
                                    <div class="info-value">${doctor.specialization}</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-star"></i>
                                <div>
                                    <div class="info-label">Rating</div>
                                    <div class="info-value">${doctor.rating}/5.0</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h2><i class="fas fa-map-marker-alt"></i> Location & Contact</h2>
                        <div class="info-grid">
                            <div class="info-item">
                                <i class="fas fa-hospital"></i>
                                <div>
                                    <div class="info-label">Hospital/Clinic</div>
                                    <div class="info-value">${doctor.address}</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <i class="fas fa-city"></i>
                                <div>
                                    <div class="info-label">City</div>
                                    <div class="info-value">${doctor.city}, ${doctor.state}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-sidebar">
                    <div class="sidebar-section">
                        <h3><i class="fas fa-clock"></i> Availability</h3>
                        <div class="availability-item">
                            <span class="availability-day">${doctor.availableDays}</span>
                            <span class="availability-time">${doctor.availableTime}</span>
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3><i class="fas fa-rupee-sign"></i> Consultation Fee</h3>
                        <div class="fee-display">
                            <div class="fee-amount">₹${doctor.consultationFee}</div>
                            <div class="fee-label">Per Consultation</div>
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <h3><i class="fas fa-address-book"></i> Contact Information</h3>
                        <div class="contact-item">
                            <i class="fas fa-phone"></i>
                            <a href="tel:${doctor.phone}">${doctor.phone}</a>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <a href="mailto:${doctor.email}">${doctor.email}</a>
                        </div>
                    </div>
                    
                    <div class="sidebar-section">
                        <button class="btn-primary" onclick="openAppointmentModal(${doctor.id})" style="width: 100%;">
                            <i class="fas fa-calendar-plus"></i>
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Setup search form on home page
function setupSearchForm() {
  const searchInput = document.getElementById("searchInput")
  const locationSelect = document.getElementById("locationSelect")

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
  }
}

// Perform search from home page
function performSearch() {
  const searchQuery = document.getElementById("searchInput")?.value || ""
  const location = document.getElementById("locationSelect")?.value || ""

  // Store search parameters
  sessionStorage.setItem("searchQuery", searchQuery)
  sessionStorage.setItem("searchLocation", location)

  // Navigate to doctors page
  window.location.href = "pages/doctors.html"
}

// Global search function (called from search button)
function searchDoctors() {
  performSearch()
}

// Filter by specialization
function filterBySpecialization(specialization) {
  sessionStorage.setItem("searchSpecialization", specialization)
  window.location.href = "pages/doctors.html"
}

// Setup filters on doctors page
function setupFilters() {
  const searchInput = document.getElementById("searchInput")
  const specializationFilter = document.getElementById("specializationFilter")
  const locationFilter = document.getElementById("locationFilter")
  const sortBy = document.getElementById("sortBy")

  if (searchInput) {
    searchInput.addEventListener("input", debounce(applyFilters, 300))
  }

  if (specializationFilter) {
    specializationFilter.addEventListener("change", applyFilters)
  }

  if (locationFilter) {
    locationFilter.addEventListener("change", applyFilters)
  }

  if (sortBy) {
    sortBy.addEventListener("change", applySorting)
  }
}

// Load search parameters from session storage
function loadSearchParameters() {
  const searchQuery = sessionStorage.getItem("searchQuery")
  const searchLocation = sessionStorage.getItem("searchLocation")
  const searchSpecialization = sessionStorage.getItem("searchSpecialization")

  if (searchQuery) {
    const input = document.getElementById("searchInput")
    if (input) input.value = searchQuery
    sessionStorage.removeItem("searchQuery")
  }

  if (searchLocation) {
    const select = document.getElementById("locationFilter")
    if (select) select.value = searchLocation
    sessionStorage.removeItem("searchLocation")
  }

  if (searchSpecialization) {
    const select = document.getElementById("specializationFilter")
    if (select) select.value = searchSpecialization
    sessionStorage.removeItem("searchSpecialization")
  }

  // Apply filters if any parameters were loaded
  if (searchQuery || searchLocation || searchSpecialization) {
    applyFilters()
  }
}

// Apply filters
function applyFilters() {
  const searchQuery = document.getElementById("searchInput")?.value.toLowerCase() || ""
  const specialization = document.getElementById("specializationFilter")?.value || ""
  const location = document.getElementById("locationFilter")?.value || ""

  filteredDoctors = allDoctors.filter((doctor) => {
    const matchesSearch =
      !searchQuery ||
      doctor.name.toLowerCase().includes(searchQuery) ||
      doctor.specialization.toLowerCase().includes(searchQuery)

    const matchesSpecialization =
      !specialization || doctor.specialization.toLowerCase().includes(specialization.toLowerCase())

    const matchesLocation = !location || doctor.city.toLowerCase() === location.toLowerCase()

    return matchesSearch && matchesSpecialization && matchesLocation
  })

  displayFilteredDoctors()
  updateResultsCount(filteredDoctors.length)
}

// Apply sorting
function applySorting() {
  const sortBy = document.getElementById("sortBy")?.value || "name"

  filteredDoctors.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "rating":
        return b.rating - a.rating
      case "experience":
        return b.experience - a.experience
      case "fee":
        return a.consultationFee - b.consultationFee
      default:
        return 0
    }
  })

  displayFilteredDoctors()
}

// Display filtered doctors
function displayFilteredDoctors() {
  const container = document.getElementById("doctorsContainer")
  const noResults = document.getElementById("noResults")

  if (!container) return

  if (filteredDoctors.length === 0) {
    container.style.display = "none"
    if (noResults) noResults.style.display = "block"
    return
  }

  container.style.display = "grid"
  if (noResults) noResults.style.display = "none"

  container.innerHTML = filteredDoctors.map((doctor) => createDoctorCard(doctor)).join("")
}

// Update results count
function updateResultsCount(count) {
  const resultsCount = document.getElementById("resultsCount")
  if (resultsCount) {
    if (count === 0) {
      resultsCount.textContent = "No doctors found"
    } else if (count === 1) {
      resultsCount.textContent = "1 doctor found"
    } else {
      resultsCount.textContent = `${count} doctors found`
    }
  }
}

// Initialize navigation
function initializeNavigation() {
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
}

// Initialize modals
function initializeModals() {
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

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

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

// Set minimum date for appointment booking
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0]
  const dateInputs = document.querySelectorAll('input[type="date"]')
  dateInputs.forEach((input) => {
    input.min = today
  })
})

console.log("✅ App.js loaded successfully!")

window.getAllDoctors = () => allDoctors;
window.createDoctorCard = createDoctorCard;
window.searchDoctors = function(searchQuery, location, specialization) {
  searchQuery = (searchQuery || "").toLowerCase();
  location = location || "";
  specialization = specialization || "";
  return allDoctors.filter((doctor) => {
    const matchesSearch =
      !searchQuery ||
      doctor.name.toLowerCase().includes(searchQuery) ||
      doctor.specialization.toLowerCase().includes(searchQuery);
    const matchesSpecialization =
      !specialization || doctor.specialization.toLowerCase().includes(specialization.toLowerCase());
    const matchesLocation = !location || doctor.city.toLowerCase() === location.toLowerCase();
    return matchesSearch && matchesSpecialization && matchesLocation;
  });
};
window.sortDoctors = function(doctors, sortBy) {
  return [...doctors].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.experience - a.experience;
      case "fee":
        return a.consultationFee - b.consultationFee;
      default:
        return 0;
    }
  });
};
