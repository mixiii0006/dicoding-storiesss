import RegisterPresenter from "./register-presenter.js";

export default class RegisterPage {
  async render() {
    return `
      <section class="container form-container" tabindex="0" aria-label="Register Page">
        <h1 class="form-title">Register</h1>
        <form id="register-form" aria-describedby="register-desc" class="form">
          <p id="register-desc">Please fill in the form to create an account.</p>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required aria-required="true" class="form-input" />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-required="true" class="form-input" />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required aria-required="true" minlength="8" class="form-input" />
          </div>
          <button type="submit" class="form-button">Register</button>
        </form>
        <div id="register-message" role="alert" aria-live="polite"></div>
      </section>

      <style>
        .container {
            max-width: 1800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .main-content {
            margin-top: 20px; 
        }
         </style>      
    `;
  }

  async afterRender() {
    this.presenter = new RegisterPresenter(this);
    this.presenter.init();
  }
}
