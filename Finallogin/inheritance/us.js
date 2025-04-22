import { AuthForm } from "main.js";

class User extends AuthForm {
  constructor(SHEETDB_API_URL) {
    super(SHEETDB_API_URL); // Call the parent class constructor
  }

  async signUp(data) {
    // Simple sign-up logic for User without PIN code verification
    try {
      const checkResponse = await fetch(
        `${this.SHEETDB_API_URL}/search?admin=${data.admin}`
      );
      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        alert("Username already taken. Please choose another.");
        return;
      }

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
    this.pinCodeField.style.display = "none"; // No need for PIN code field for users
  }
}
