export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    const form = document.getElementById("register-form");
    const message = document.getElementById("register-message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "";

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value.trim();

      if (!name || !email || !password) {
        message.textContent = "Please fill in all fields.";
        return;
      }

      try {
        const { registerUser } = await import("../../data/api.js");
        const response = await registerUser(name, email, password);
        if (response.error) {
          message.textContent = response.message || "Registration failed.";
        } else {
          message.textContent = "Registration successful! You can now login.";
          setTimeout(() => {
            window.location.hash = "#/login";
          }, 2000);
        }
      } catch (error) {
        message.textContent = error.message || "Registration failed.";
      }
    });
  }
}
