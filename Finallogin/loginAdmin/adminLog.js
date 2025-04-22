// const SHEETDB_API_URL = "https://sheetdb.io/api/v1/r1gmr69ui8hze"; // Replace with your SheetDB API URL

// let isLogin = true; // Flag to toggle between Login and Sign-Up forms

// // Function to fetch all PIN codes from the Google Sheet
// async function fetchAllPinCodes() {
//   try {
//     const response = await fetch(SHEETDB_API_URL);
//     const data = await response.json();
//     if (data.length > 0) {
//       // Extract all PIN codes from the `pinCode` column
//       const pinCodes = data.map((entry) => entry.pinCode).filter(Boolean); // Filter out empty/null values
//       return pinCodes;
//     } else {
//       throw new Error("No PIN codes found in the sheet.");
//     }
//   } catch (error) {
//     console.error("Error fetching PIN codes:", error);
//     alert("An error occurred while fetching PIN codes. Please try again.");
//     return [];
//   }
// }

// // Login Function
// async function login(data) {
//   try {
//     const response = await fetch(
//       `${SHEETDB_API_URL}/search?admin=${data.admin}&passwordAd=${data.passwordAd}`
//     );
//     const users = await response.json();
//     if (users.length > 0) {
//       alert("Login successful! Redirecting to another page...");
//       window.location.href = "../../forAdmine/may/admin.html"; // Redirect to another page
//     } else {
//       alert("Invalid admin username or password. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("An error occurred. Please try again.");
//   }
// }

// // Sign-Up Function
// async function signUp(data) {
//   try {
//     // Check if admin username already exists
//     const checkResponse = await fetch(
//       `${SHEETDB_API_URL}/search?admin=${data.admin}`
//     );
//     const existingUsers = await checkResponse.json();
//     if (existingUsers.length > 0) {
//       alert(
//         "Admin username already taken. Please choose a different username."
//       );
//       return;
//     }

//     // Fetch all PIN codes from the Google Sheet
//     const pinCodes = await fetchAllPinCodes();
//     if (pinCodes.length === 0) {
//       alert("No valid PIN codes found. Please contact the administrator.");
//       return;
//     }

//     // Validate PIN code for admin sign-up
//     const pinCode = document.getElementById("pinCode").value;
//     if (pinCode && !pinCodes.includes(pinCode)) {
//       alert("Invalid Admin PIN Code. Please try again.");
//       return;
//     }

//     // Add a role field to the data (admin or user)
//     data.role = pinCode && pinCodes.includes(pinCode) ? "admin" : "user";

//     // Proceed with sign-up if admin username does not exist and PIN code is valid
//     const response = await fetch(SHEETDB_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ data: [data] }),
//     });
//     if (response.ok) {
//       alert("Sign up successful! Please log in.");
//       toggleForm(); // Switch to login form after successful sign up
//     } else {
//       alert("Sign up failed. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("An error occurred. Please try again.");
//   }
// }

// async function handleAuth(event) {
//   event.preventDefault();
//   const form = document.getElementById("authForm");
//   const formData = new FormData(form);
//   const data = {
//     admin: formData.get("admin"), // Use the new column name `admin`
//     passwordAd: formData.get("passwordAd"), // Use the new column name `passwordAd`
//   };

//   if (isLogin) {
//     // Login Logic
//     await login(data);
//   } else {
//     // Sign-Up Logic
//     const confirmPassword = document.getElementById("confirmPassword").value;
//     if (data.passwordAd !== confirmPassword) {
//       alert("Passwords do not match. Please try again.");
//       return;
//     }
//     await signUp(data); // Wait for sign-up to complete before proceeding
//   }
// }

// // Toggle between Login and Sign-Up forms
// function toggleForm() {
//   const formTitle = document.getElementById("formTitle");
//   const confirmPasswordField = document.getElementById("confirmPasswordField");
//   const pinCodeField = document.getElementById("pinCodeField");
//   const toggleMessage = document.getElementById("toggleMessage");
//   const submitButton = document.getElementById("submitButton");

//   if (isLogin) {
//     formTitle.innerText = "Sign Up";
//     confirmPasswordField.style.display = "block";
//     pinCodeField.style.display = "block"; // Show PIN code field
//     toggleMessage.innerHTML =
//       'Already have an account? <span onclick="toggleForm()">Log In</span>';
//     submitButton.innerText = "Sign Up";
//   } else {
//     formTitle.innerText = "Login";
//     confirmPasswordField.style.display = "none";
//     pinCodeField.style.display = "none"; // Hide PIN code field
//     toggleMessage.innerHTML =
//       'Don\'t have an account? <span onclick="toggleForm()">Sign Up</span>';
//     submitButton.innerText = "Log in";
//   }
//   isLogin = !isLogin;
// }

class Admin {
  constructor() {
    this.SHEETDB_API_URL = "https://sheetdb.io/api/v1/r1gmr69ui8hze";
    this.isLogin = true;
    this.init();
  }

  init() {
    this.form = document.getElementById("authForm");
    this.formTitle = document.getElementById("formTitle");
    this.confirmPasswordField = document.getElementById("confirmPasswordField");
    this.pinCodeField = document.getElementById("pinCodeField");
    this.toggleMessage = document.getElementById("toggleMessage");
    this.submitButton = document.getElementById("submitButton");
    this.form.addEventListener("submit", this.handleAuth.bind(this));
  }

  async fetchAllPinCodes() {
    try {
      const response = await fetch(this.SHEETDB_API_URL);
      const data = await response.json();
      if (data.length > 0) {
        const pinCodes = data.map((entry) => entry.pinCode).filter(Boolean);
        return pinCodes;
      } else {
        throw new Error("No PIN codes found in the sheet.");
      }
    } catch (error) {
      console.error("Error fetching PIN codes:", error);
      alert("An error occurred while fetching PIN codes. Please try again.");
      return [];
    }
  }

  async login(data) {
    try {
      const response = await fetch(
        `${this.SHEETDB_API_URL}/search?admin=${data.admin}&passwordAd=${data.passwordAd}`
      );
      const users = await response.json();
      if (users.length > 0) {
        alert("Login successful! Redirecting to another page...");
        window.location.href = "../../forAdmine/may/admin.html";
      } else {
        alert("Invalid admin username or password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  async signUp(data) {
    try {
      const checkResponse = await fetch(
        `${this.SHEETDB_API_URL}/search?admin=${data.admin}`
      );
      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        alert(
          "Admin username already taken. Please choose a different username."
        );
        return;
      }

      const pinCodes = await this.fetchAllPinCodes();
      if (pinCodes.length === 0) {
        alert("No valid PIN codes found. Please contact the administrator.");
        return;
      }

      const pinCode = document.getElementById("pinCode").value;
      if (pinCode && !pinCodes.includes(pinCode)) {
        alert("Invalid Admin PIN Code. Please try again.");
        return;
      }

      data.role = pinCode && pinCodes.includes(pinCode) ? "admin" : "user";

      const response = await fetch(this.SHEETDB_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: [data] }),
      });
      if (response.ok) {
        alert("Sign up successful! Please log in.");
        this.toggleForm();
      } else {
        alert("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  async handleAuth(event) {
    event.preventDefault();
    const formData = new FormData(this.form);
    const data = {
      admin: formData.get("admin"),
      passwordAd: formData.get("passwordAd"),
    };

    if (this.isLogin) {
      await this.login(data);
    } else {
      const confirmPassword = document.getElementById("confirmPassword").value;
      if (data.passwordAd !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }
      await this.signUp(data);
    }
  }

  toggleForm() {
    if (this.isLogin) {
      this.formTitle.innerText = "Sign Up";
      this.confirmPasswordField.style.display = "block";
      this.pinCodeField.style.display = "block";
      this.toggleMessage.innerHTML =
        'Already have an account? <span onclick="admin.toggleForm()">Log In</span>';
      this.submitButton.innerText = "Sign Up";
    } else {
      this.formTitle.innerText = "Login";
      this.confirmPasswordField.style.display = "none";
      this.pinCodeField.style.display = "none";
      this.toggleMessage.innerHTML =
        'Don\'t have an account? <span onclick="admin.toggleForm()">Sign Up</span>';
      this.submitButton.innerText = "Log in";
    }
    this.isLogin = !this.isLogin;
  }
}

const admin = new Admin();
window.toggleForm = () => admin.toggleForm();
