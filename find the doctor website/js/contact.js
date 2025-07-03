// Contact page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  setupContactForm()
})

// Setup contact form
function setupContactForm() {
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactFormSubmission)
  }
}

// Handle contact form submission
function handleContactFormSubmission(event) {
  event.preventDefault()

  // Get form data
  const formData = new FormData(event.target)
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  }

  // Validate form data
  if (!validateContactForm(contactData)) {
    return
  }

  // Show loading state
  const submitButton = event.target.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitButton.disabled = true

  // Simulate form submission
  setTimeout(() => {
    // Reset button
    submitButton.innerHTML = originalText
    submitButton.disabled = false

    // Show success message
    showSuccessMessage("Thank you for your message! We will get back to you within 24 hours.")

    // Reset form
    event.target.reset()

    // Store contact in localStorage for admin reference
    storeContactSubmission(contactData)
  }, 2000)
}

// Validate contact form
function validateContactForm(data) {
  const errors = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Please enter a valid name (at least 2 characters)")
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please enter a valid email address")
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push("Please enter a valid phone number")
  }

  if (!data.subject) {
    errors.push("Please select a subject")
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Please enter a message (at least 10 characters)")
  }

  if (errors.length > 0) {
    showErrorMessage(errors.join("\n"))
    return false
  }

  return true
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone format
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
  return phoneRegex.test(phone)
}

// Show success message
function showSuccessMessage(message) {
  const alertDiv = document.createElement("div")
  alertDiv.className = "alert alert-success"
  alertDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `

  document.body.appendChild(alertDiv)

  // Style the alert
  Object.assign(alertDiv.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#10b981",
    color: "white",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: "9999",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    maxWidth: "400px",
    animation: "slideInRight 0.3s ease",
  })

  // Remove after 5 seconds
  setTimeout(() => {
    alertDiv.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(alertDiv)
    }, 300)
  }, 5000)
}

// Show error message
function showErrorMessage(message) {
  const alertDiv = document.createElement("div")
  alertDiv.className = "alert alert-error"
  alertDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message.replace(/\n/g, "<br>")}</span>
    `

  document.body.appendChild(alertDiv)

  // Style the alert
  Object.assign(alertDiv.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#ef4444",
    color: "white",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: "9999",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    maxWidth: "400px",
    animation: "slideInRight 0.3s ease",
  })

  // Remove after 7 seconds
  setTimeout(() => {
    alertDiv.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(alertDiv)
    }, 300)
  }, 7000)
}

// Store contact submission in localStorage
function storeContactSubmission(contactData) {
  const submissions = JSON.parse(localStorage.getItem("contactSubmissions") || "[]")

  const submission = {
    ...contactData,
    timestamp: new Date().toISOString(),
    id: Date.now(),
  }

  submissions.push(submission)

  // Keep only last 50 submissions
  if (submissions.length > 50) {
    submissions.splice(0, submissions.length - 50)
  }

  localStorage.setItem("contactSubmissions", JSON.stringify(submissions))
}

// Get contact submissions (for admin use)
function getContactSubmissions() {
  return JSON.parse(localStorage.getItem("contactSubmissions") || "[]")
}

// Export contact submissions
function exportContactSubmissions() {
  const submissions = getContactSubmissions()
  const dataStr = JSON.stringify(submissions, null, 2)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  const exportFileDefaultName = "contact_submissions.json"

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", exportFileDefaultName)
  linkElement.click()
}

// Add CSS animations for alerts
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
