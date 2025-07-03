// Doctor detail page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  initializeDoctorDetailPage()
})

// Initialize doctor detail page
function initializeDoctorDetailPage() {
  const urlParams = new URLSearchParams(window.location.search)
  const doctorId = urlParams.get("id")

  if (doctorId) {
    loadDoctorDetails(doctorId)
  } else {
    showError("doctorProfile", "Doctor not found")
  }
}

// Load doctor details
function loadDoctorDetails(doctorId) {
  if (typeof window.getDoctorById === "function") {
    const doctor = window.getDoctorById(doctorId)

    if (!doctor) {
      showError("doctorProfile", "Doctor not found")
      return
    }

    displayDoctorProfile(doctor)
  } else {
    setTimeout(() => loadDoctorDetails(doctorId), 100)
  }
}

// Display doctor profile
function displayDoctorProfile(doctor) {
  const container = document.getElementById("doctorProfile")
  if (!container) return

  const profileHTML = `
        <div class="profile-header">
            <img src="${doctor.imageUrl}" alt="${doctor.name}" class="profile-avatar">
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
                            <a href="tel:${doctor.phone}">${formatPhoneNumber(doctor.phone)}</a>
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

  container.innerHTML = profileHTML

  // Add animation
  container.style.opacity = "0"
  container.style.transform = "translateY(20px)"

  setTimeout(() => {
    container.style.transition = "all 0.5s ease"
    container.style.opacity = "1"
    container.style.transform = "translateY(0)"
  }, 100)
}

// Generate availability schedule
function generateAvailabilitySchedule(availableDays, availableTime) {
  const days = availableDays.split("-")
  const schedule = []

  if (days.length === 2) {
    const startDay = days[0].trim()
    const endDay = days[1].trim()
    const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const startIndex = daysList.indexOf(startDay)
    const endIndex = daysList.indexOf(endDay)

    if (startIndex !== -1 && endIndex !== -1) {
      for (let i = startIndex; i <= endIndex; i++) {
        schedule.push({
          day: daysList[i],
          time: availableTime,
        })
      }
    }
  }

  return schedule
}

// Book appointment for specific doctor
function bookAppointmentForDoctor(doctorId) {
  window.openAppointmentModal(doctorId)
}

// Share doctor profile
function shareDoctorProfile(doctorId) {
  const doctor = window.getDoctorById(doctorId)
  if (!doctor) return

  const shareData = {
    title: `Dr. ${doctor.name} - ${doctor.specialization}`,
    text: `Check out Dr. ${doctor.name}, a ${doctor.specialization} with ${doctor.experience} years of experience.`,
    url: window.location.href,
  }

  if (navigator.share) {
    navigator.share(shareData)
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("Profile link copied to clipboard!")
    })
  }
}

// Print doctor profile
function printDoctorProfile() {
  window.print()
}

// Add to favorites (localStorage)
function addToFavorites(doctorId) {
  const favorites = JSON.parse(localStorage.getItem("favoriteDoctors") || "[]")

  if (!favorites.includes(doctorId)) {
    favorites.push(doctorId)
    localStorage.setItem("favoriteDoctors", JSON.stringify(favorites))
    alert("Doctor added to favorites!")
  } else {
    alert("Doctor is already in your favorites!")
  }
}

// Remove from favorites
function removeFromFavorites(doctorId) {
  let favorites = JSON.parse(localStorage.getItem("favoriteDoctors") || "[]")
  favorites = favorites.filter((id) => id !== doctorId)
  localStorage.setItem("favoriteDoctors", JSON.stringify(favorites))
  alert("Doctor removed from favorites!")
}

// Check if doctor is in favorites
function isInFavorites(doctorId) {
  const favorites = JSON.parse(localStorage.getItem("favoriteDoctors") || "[]")
  return favorites.includes(doctorId)
}

// Declare undeclared variables
function showError(elementId, message) {
  const element = document.getElementById(elementId)
  if (element) {
    element.innerHTML = `<div class="error">${message}</div>`
  }
}

function generateStarRating(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

  let starsHTML = ""
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>'
  }
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>'
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>'
  }

  return starsHTML
}

function formatPhoneNumber(phoneNumber) {
  // Placeholder function to format phone number
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
}
