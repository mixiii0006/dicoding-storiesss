export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    const form = document.getElementById("login-form");
    const message = document.getElementById("login-message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "";

      const email = form.email.value.trim();
      const password = form.password.value.trim();

      if (!email || !password) {
        message.textContent = "Please fill in all fields.";
        return;
      }

      try {
        const { loginUser } = await import("../../data/api.js");
        const response = await loginUser(email, password);
        if (response.error) {
          message.textContent = response.message || "Login failed.";
        } else {
          message.textContent = "Login successful!";

          localStorage.setItem("token", response.loginResult.token);
          localStorage.setItem("userId", response.loginResult.userId);
          localStorage.setItem("userName", response.loginResult.name);

          window.location.hash = "#/";
        }
      } catch (error) {
        message.textContent = error.message || "Login failed.";
      }
    });
  }
}
