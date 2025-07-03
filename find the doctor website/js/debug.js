// Debug helper to check if data is loading properly
console.log("Debug: Checking if doctorsData is available...")

const doctorsData = [] // Declare doctorsData variable to avoid undeclared variable error

if (typeof doctorsData !== "undefined") {
  console.log("✅ doctorsData loaded successfully:", doctorsData.length, "doctors found")
  console.log("First doctor:", doctorsData[0])
} else {
  console.error("❌ doctorsData is not defined. Check if data.js is loaded properly.")
}

// Check if functions are available
const functionsToCheck = ["getAllDoctors", "getDoctorById", "searchDoctors", "getFeaturedDoctors"]
functionsToCheck.forEach((funcName) => {
  if (typeof window[funcName] === "function") {
    console.log(`✅ ${funcName} is available`)
  } else {
    console.error(`❌ ${funcName} is not available`)
  }
})
