// Doctors page specific JavaScript

let currentDoctors = []
let filteredDoctors = []

document.addEventListener("DOMContentLoaded", () => {
  initializeDoctorsPage()
  setupDoctorsEventListeners()
  loadSearchParameters()
})

// Initialize doctors page
function initializeDoctorsPage() {
  if (typeof window.getAllDoctors === "function") {
    currentDoctors = window.getAllDoctors()
    filteredDoctors = currentDoctors
    displayDoctors(filteredDoctors)
    updateResultsCount(filteredDoctors.length)
  } else {
    setTimeout(initializeDoctorsPage, 100)
  }
}

// Setup doctors page event listeners
function setupDoctorsEventListeners() {
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
    sortBy.addEventListener("change", sortDoctors)
  }
}

// Load search parameters from session storage
function loadSearchParameters() {
  const searchQuery = sessionStorage.getItem("searchQuery")
  const searchLocation = sessionStorage.getItem("searchLocation")
  const searchSpecialization = sessionStorage.getItem("searchSpecialization")

  if (searchQuery) {
    document.getElementById("searchInput").value = searchQuery
    sessionStorage.removeItem("searchQuery")
  }

  if (searchLocation) {
    document.getElementById("locationFilter").value = searchLocation
    sessionStorage.removeItem("searchLocation")
  }

  if (searchSpecialization) {
    document.getElementById("specializationFilter").value = searchSpecialization
    sessionStorage.removeItem("searchSpecialization")
  }

  // Apply filters if any parameters were loaded
  if (searchQuery || searchLocation || searchSpecialization) {
    applyFilters()
  }
}

// Apply filters
function applyFilters() {
  const searchQuery = document.getElementById("searchInput").value
  const specialization = document.getElementById("specializationFilter").value
  const location = document.getElementById("locationFilter").value

  filteredDoctors = window.searchDoctors(searchQuery, location, specialization)

  // Apply current sort
  const sortBy = document.getElementById("sortBy").value
  if (sortBy) {
    filteredDoctors = window.sortDoctors(filteredDoctors, sortBy)
  }

  displayDoctors(filteredDoctors)
  updateResultsCount(filteredDoctors.length)
}

// Sort doctors
function sortDoctors() {
  const sortBy = document.getElementById("sortBy").value
  if (sortBy) {
    filteredDoctors = window.sortDoctors(filteredDoctors, sortBy)
    displayDoctors(filteredDoctors)
  }
}

// Display doctors
function displayDoctors(doctors) {
  const container = document.getElementById("doctorsContainer")
  const noResults = document.getElementById("noResults")

  if (!container) return

  if (doctors.length === 0) {
    container.style.display = "none"
    if (noResults) noResults.style.display = "block"
    return
  }

  container.style.display = "grid"
  if (noResults) noResults.style.display = "none"

  container.innerHTML = doctors.map((doctor) => window.createDoctorCard(doctor)).join("")

  // Add animation to cards
  const cards = container.querySelectorAll(".doctor-card")
  cards.forEach((card, index) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"

    setTimeout(() => {
      card.style.transition = "all 0.3s ease"
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    }, index * 50)
  })
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

// Debounce function for search input
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

// Filter doctors by specialization (called from specialization cards)
function filterBySpecialization(specialization) {
  document.getElementById("specializationFilter").value = specialization
  applyFilters()
}

// Clear all filters
function clearFilters() {
  document.getElementById("searchInput").value = ""
  document.getElementById("specializationFilter").value = ""
  document.getElementById("locationFilter").value = ""
  document.getElementById("sortBy").value = "name"

  filteredDoctors = currentDoctors
  displayDoctors(filteredDoctors)
  updateResultsCount(filteredDoctors.length)
}

// Export doctors data (for admin use)
function exportDoctorsData() {
  const dataStr = JSON.stringify(filteredDoctors, null, 2)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  const exportFileDefaultName = "doctors_data.json"

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", exportFileDefaultName)
  linkElement.click()
}

// Remove all the dummy functions since they're now available from data.js
