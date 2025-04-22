class Admin extends AuthForm {
  constructor(SHEETDB_API_URL) {
    super(SHEETDB_API_URL); // Call the parent class constructor
    this.pinCodeField = document.getElementById("pinCodeField");
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

  async signUp(data) {
    try {
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

  toggleForm() {
    super.toggleForm(); // Call the parent class toggleForm method

    if (this.isLogin) {
      this.pinCodeField.style.display = "block"; // Show PIN code field for sign-up
    } else {
      this.pinCodeField.style.display = "none"; // Hide PIN code field for login
    }
  }
}
